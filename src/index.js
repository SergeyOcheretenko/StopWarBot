const { Telegraf } = require('telegraf');
const data = require('./json/CONFIG.json');
const script = require('./json/script.json')
const fs = require('fs')
const persons = require('./json/people.json')

const bot = new Telegraf(data.token);

const savePerson = (id, username) => {
    let count = 1;
    let flag = false;
    const keys = Object.keys(persons);
    for (const key of keys) {
        if (persons[key][0] === id) {
            flag = true;
            break;
        }
    }

    if (!flag) {
        persons[count] = [id, username];
        const new_persons = JSON.stringify(persons);
        fs.writeFileSync('./json/people.json', new_persons)
    }    
}

bot.start(async (ctx) => {
    savePerson(ctx.message.chat.id, ctx.message.from.username);
    await ctx.reply(script.greeting);
});

bot.help(async (ctx) => {
    savePerson(ctx.message.chat.id, ctx.message.from.username);
    await ctx.reply(script.greeting);
})

bot.command('chat_id', ctx => {
    ctx.reply(ctx.message.chat.id);
})

bot.on('message', ctx => {
    ctx.reply('Я не знаю что вы имели ввиду.\n\nНажимайте /help и я расскажу вам как действовать дальше.')
})

bot.launch();