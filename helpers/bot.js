var SlackBot = require('slackbots'); // import slackbot library
var mongoose = require('mongoose');  // import mongoose library for accessing MongoDB
var Badword = require('../models/Badword.js'); // import slackbot data model

/* Create Bot using My Slack Team API KEY */
var bot = new SlackBot({
    token: process.env.BOT_API_KEY,
    name: 'SlackBot'
});

exports.run = () => {
  bot.on('start', onStart);
  bot.on('message', onMessage);
}

var onStart = () => {
  console.log('Bot started');
}

var onMessage = (message) => {
  users = [];
  channels = [];
  var botUsers = bot.getUsers();
  users = botUsers._value.members;
  var botChannels = bot.getChannels();
  channels = botChannels._value.channels;

  if(message.type === 'message' && Boolean(message.text)) {
    var channel = channels.find(channel => channel.id === message.channel);
    var usr = users.find(user => user.id === message.user);

    if(usr.name !== 'attitudebot') {
      if(message.text.toLowerCase().indexOf('shit') || message.text.toLowerCase().indexOf('fuck') || message.text.toLowerCase().indexOf('bitch')) {
        var keyword = '';
        if(message.text.toLowerCase().indexOf('shit')) {
          keyword = 'shit';
        }
        if(message.text.toLowerCase().indexOf('fuck')) {
          keyword = 'fuck';
        }
        if(message.text.toLowerCase().indexOf('bitch')) {
          keyword = 'bitch';
        }
        saveWord(channel,usr,keyword);
      }
    }
  }
}

var saveWord = (channel,user, word) => {
  Badword.create({user_id:user.id,keyword:word}, (err, post) => {
    if (err) {
      console.log(err);
      return;
    } else {
      countWord(channel,user);
    }
  });
}

var countWord = (channel,user) => {
  Badword.find({user_id:user.id}).exec((err, badwords) => {
    if (err) {
      console.log(err);
      return;
    } else {
      if(badwords.length > 5) {
        bot.postMessageToChannel(channel.name, 'It\'s enough '+user.name+' you will kicked from this channel!', {as_user: true});
      } else {
        bot.postMessageToChannel(channel.name, 'Becareful '+user.name+' you have say bad word '+badwords.length+' times.', {as_user: true});
      }
    }
  });
}
