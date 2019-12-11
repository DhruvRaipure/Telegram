var token = '633676448:AAHTBZQ3I0YEjah8XK-G3dVpXSafvGESo0A';

var Bot = require('node-telegram-bot-api'),
    bot = new Bot(token, { polling: true });

console.log('bot server started...');
bot.onText(/^\/say_hello (.+)$/, function (msg, match) {
    var name = match[1];
    bot.sendMessage(msg.chat.id, 'Hello ' + name + '!').then(function () {
      // reply sent!
    });
  });
  bot.onText(/^\mighty_mighty$/, function (msg, match) {
    var name = match[0];
    bot.sendMessage(msg.chat.id, 'Yemit! ').then(function () {
      // reply sent!
    });
  });