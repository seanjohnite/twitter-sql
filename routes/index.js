var tweetBank = require('../tweetBank');
var tweetDB = require('../tweetDB');
var models = require('../models/');
var Tweet = models.Tweet;
var User = models.User;

module.exports = function (io) {
	var router = require('express').Router();

	router.get('/', function (req, res) {
		tweetDB.list()
		.then(function (tweetList) {
			res.render('index', {
				showForm: true,
				title: 'Home',
				tweets: tweetList
			});
		});
	});

	router.get('/users/:name', function (req, res) {
		tweetDB.findUser(req.params.name)
		.then(function (tweets) {
			res.render('index', {
				showForm: true,
				title: req.params.name,
				tweets: tweets,
				theName: req.params.name
			});
		});
	});

	router.get('/users/:name/tweets/:id', function (req, res) {
		var id = parseInt(req.params.id);
		tweetDB.findTweet(id)
		.then(function (tweet) {
			console.log(tweet);
			res.render('index', {title: req.params.name, tweets: [tweet]})
		});
	});

	router.post('/submit', function (req, res) {
		tweetDB.postTweet(req.body.name, req.body.text)
		.then (function(tweet){
			io.sockets.emit('new_tweet', tweet);
			res.redirect('/');
		});
		// tweetBank.add(req.body.name, req.body.text);
		// var theNewTweet = tweetBank.list().pop();
		// io.sockets.emit('new_tweet', theNewTweet);
		// res.redirect('/');
	});
	return router;
};