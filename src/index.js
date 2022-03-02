const { Telegraf } = require('telegraf');
const data = require('./CONFIG.json');

const bot = new Telegraf(data.token);

bot.start((msg) => msg.reply('Hello'));

bot.launch();