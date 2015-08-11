var models = require('./models');
var Tweet = models.Tweet;
var User = models.User;

var add = function () {};


var list = function () {
  return Tweet.findAll({include: [User] }).then(function(tweets){
    var tweetList = tweets.reverse().map(function(tweet){
      return {
         name: tweet.User.name, 
         text: tweet.tweet,
         id: tweet.id,
         pictureUrl: tweet.User.pictureUrl
       };
    });
    return tweetList;
  });
};

var findUser = function (username) {
  return Tweet.findAll({
    include: [{
      model: User, 
      where: {
        name: username
      }
    }]
  })
  .then(function (tweets) {
    return tweets.map(function (tweet) {
      return {
        name: tweet.User.name, 
        id: tweet.id,
        text: tweet.tweet, 
        pictureUrl: tweet.User.pictureUrl
      };
    });
  });
};

var findTweet = function (tweetId) {
  return Tweet.findOne({
    where: { id: tweetId },
    include: [ User ]
  })
  .then(function (tweet) {
    return {
      name: tweet.User.name,
      text: tweet.tweet,
      id: tweet.id,
      pictureUrl: tweet.User.pictureUrl
    };
  });
};

var postTweet = function (userName, tweetText){
  var userMemo;
  return User.findOne({
    where: {name: userName}
  }).then(function (user){
    if (!user){
      return User.create( {name: userName, pictureUrl: 'http://lorempixel.com/48/48/'});
    }
    else return user;
  })
  .then(function (user){
    userMemo = user;
    return Tweet.create( {
      tweet: tweetText, 
      UserId: user.id
    });
  })
  .then(function (tweet){
    return {
      name: userMemo.name, 
      text: tweet.tweet,
      id: tweet.id,
      pictureUrl: userMemo.pictureUrl
    };
  });
};



module.exports = {
  list: list,
  findUser: findUser,
  findTweet: findTweet,
  postTweet: postTweet
};