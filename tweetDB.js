var models = require('./models');
var Tweet = models.Tweet;
var User = models.User;

var TweetRender = function (tweet, user) {
  this.name = user.name;
  this.text = tweet.tweet;
  this.id = tweet.id;
  this.pictureUrl = user.pictureUrl;
};


var list = function () {
  return Tweet.findAll({include: [User] }).then(function(tweets){
    return tweetList = tweets.reverse().map(function(tweet){
      return new TweetRender(tweet, tweet.User);
    });
  });
};

var findUser = function (username) {
  var userMemo;
  return User.findOne({
    where: {name: username}
  })
  .then(function (user) {
    userMemo = user;
    return user.getTweets();
  })
  .then(function (tweets) {
    return tweets.map(function (tweet) {
      return new TweetRender(tweet, userMemo);
    });
  });
};

var findTweet = function (tweetId) {
  return Tweet.findOne({
    where: { id: tweetId },
    include: [ User ]
  })
  .then(function (tweet) {
    return new TweetRender(tweet, tweet.User);
  });
};

var getOrMakeUser = function (userName) {
  return User.findOne({
    where: {name: userName}
  }).then(function (user){
    if (!user){
      return User.create( {name: userName, pictureUrl: 'http://lorempixel.com/48/48/'});
    }
    else return user;
  });
};

var makeTweet = function (user, tweetText) {
  return Tweet.create( {
    tweet: tweetText, 
    UserId: user.id
  });
}

var postTweet = function (userName, tweetText){
  var userMemo;
  return getOrMakeUser(userName)
  .then(function (user){
    userMemo = user;
    return makeTweet(user, tweetText);
  })
  .then(function (tweet){
    return new TweetRender(tweet, userMemo);
  });
};

module.exports = {
  list: list,
  findUser: findUser,
  findTweet: findTweet,
  postTweet: postTweet
};