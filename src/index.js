const { Telegraf, Markup } = require('telegraf');
const data = require('./json/CONFIG.json');
const script = require('./json/script.json')
const persons = require('./json/people.json')
const fs = require('fs')

const bot = new Telegraf(data.token);

const savePerson = (id, username) => {
    try {
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
    } catch (e) {
        bot.telegram.sendMessage(393017439, 'Ошибка');
    } 
}

bot.start(async (ctx) => {
    try {
        await ctx.reply(script.greeting, Markup.keyboard([['Видеообращение', 'Текстовое обращение']]).oneTime().resize())
        savePerson(ctx.message.chat.id, ctx.message.from.username);
    } catch (e) {
        bot.telegram.sendMessage(393017439, 'Ошибка');
    }
});

bot.help(async (ctx) => {
    try {
        await ctx.reply(script.greeting, Markup.keyboard([['Видеообращение', 'Текстовое обращение']]).oneTime().resize())
        savePerson(ctx.message.chat.id, ctx.message.from.username);
    } catch (e) {
        bot.telegram.sendMessage(393017439, 'Ошибка');
    }
})

bot.command('chat_id', async ctx => {
    try {
        await ctx.reply(ctx.message.chat.id);
    } catch (e) {
        bot.telegram.sendMessage(393017439, 'Ошибка');
    }
})

bot.command('poster', async ctx => {
    try {
        await ctx.reply(script.drive)
        await ctx.reply(script.thanks)
    } catch (e) {
        bot.telegram.sendMessage(393017439, 'Ошибка');
    }
})

bot.command('manual', async ctx => {
    try {
        await ctx.reply(script.manual, Markup.keyboard([['Выбрать постер', 'Зачем это мне?']]).oneTime().resize())
    } catch (e) {
        bot.telegram.sendMessage(393017439, 'Ошибка');
    }
})

bot.on('message', async ctx => {
    try { 
        const text = ctx.message.text;
        
        if (text === 'Видеообращение') {
            await ctx.replyWithVideo('BAACAgIAAxkBAAIBi2IfuCKYW0v4OvdSr9SSA75oCAshAAIKFgAC4TT4SMK-RDLURhG0IwQ', Markup.keyboard([['Выбрать постер', 'Инструкции', 'Зачем это мне?']]).oneTime().resize())
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
    } catch (e) {
        bot.telegram.sendMessage(393017439, 'Ошибка');
    }
})

bot.launch();