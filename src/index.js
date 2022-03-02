const { Telegraf, Markup } = require('telegraf');
const data = require('./json/CONFIG.json');
const script = require('./json/script.json')
const persons = require('./json/people.json')
const fs = require('fs')

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
        count++;
    }

    if (!flag) {
        persons[count] = [id, username];
        const new_persons = JSON.stringify(persons);
        fs.writeFileSync('./json/people.json', new_persons)
    }    
}

bot.start(async (ctx) => {
    await ctx.reply(script.greeting, Markup.keyboard([['Видеообращение', 'Текстовое обращение']]).oneTime().resize())
    savePerson(ctx.message.chat.id, ctx.message.from.username);
});

bot.help(async (ctx) => {
    await ctx.reply(script.greeting, Markup.keyboard([['Видеообращение', 'Текстовое обращение']]).oneTime().resize())
    savePerson(ctx.message.chat.id, ctx.message.from.username);
})

bot.command('chat_id', async ctx => {
    await ctx.reply(ctx.message.chat.id);
})

bot.command('poster', async ctx => {
    await ctx.reply(script.drive)
    await ctx.reply(script.thanks)
})

bot.command('manual', async ctx => {
    await ctx.reply(script.manual, Markup.keyboard([['Выбрать постер', 'Зачем это мне?']]).oneTime().resize())
})

bot.on('message', async ctx => {
    const text = ctx.message.text;
    
    if (text === 'Видеообращение') {
        await ctx.reply(script.youtube)
    } else if (text === 'Текстовое обращение') {
        await ctx.reply(script.first_speak);
        await ctx.reply(script.second_speak);
        await ctx.reply(script.third_speak, Markup.keyboard([['Выбрать постер', 'Инструкции', 'Зачем это мне?']]).oneTime().resize())
    } else if (text === "Инструкции") {
        await ctx.reply(script.manual, Markup.keyboard([['Выбрать постер', 'Зачем это мне?']]).oneTime().resize())
    } else if (text === "Зачем это мне?") {
        await ctx.reply(script.why, Markup.keyboard([['Выбрать постер', 'Инструкции']]).oneTime().resize())
    } else if (text === 'Выбрать постер') {
        await ctx.reply(script.drive)
        await ctx.reply(script.thanks)
    } else {
        await ctx.reply(script.none)
    }
})

bot.launch();