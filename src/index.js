const { Telegraf, Markup } = require('telegraf');
const data = require('./json/CONFIG.json');
const script = require('./json/script.json')
const fs = require('fs')

const handleError = (err) => {
    const adminId = 393017439;
    bot.telegram.sendMessage(adminId, err.toString());
};

const bot = new Telegraf(data.token);

bot.start(async (ctx) => {
    try {
        await ctx.reply(script.greeting, Markup.keyboard([['Видеообращение', 'Текстовое обращение']]).oneTime().resize())
    } catch (e) {
        handleError(e);
    }
});

bot.command('chat_id', async ctx => {
    try {
        await ctx.reply(ctx.message.chat.id);
    } catch (e) {
        handleError(e);
    }
})

bot.command('poster', async ctx => {
    try {
        await ctx.reply(script.drive)
        await ctx.reply(script.thanks)
    } catch (e) {
        handleError(e);
    }
})

bot.command('manual', async ctx => {
    try {
        await ctx.reply(script.manual, Markup.keyboard([['Выбрать постер', 'Зачем это мне?']]).oneTime().resize())
    } catch (e) {
        handleError(e);
    }
});

bot.hears('Видеообращение', async (ctx) => {
    await ctx.replyWithVideo(
	    'BAACAgIAAxkBAAIBi2IfuCKYW0v4OvdSr9SSA75oCAshAAIKFgAC4TT4SMK-RDLURhG0IwQ', 
	    Markup.keyboard([['Выбрать постер', 'Инструкции', 'Зачем это мне?']])
	    .oneTime().resize()
    );
});

bot.hears('Текстовое обращение', async (ctx) => {
    await ctx.reply(script.first_speak);
    await ctx.reply(script.second_speak);
    await ctx.reply(script.third_speak, Markup.keyboard([['Выбрать постер', 'Инструкции', 'Зачем это мне?']]).oneTime().resize());
});

bot.hears('Инструкции', async (ctx) => {
    await ctx.reply(script.manual, Markup.keyboard([['Выбрать постер', 'Зачем это мне?']]).oneTime().resize());
});

bot.hears('Зачем это мне?', async (ctx) => {
    await ctx.reply(script.why, Markup.keyboard([['Выбрать постер', 'Инструкции']]).oneTime().resize());
});

bot.hears('Выбрать постер', async (ctx) => {
    await ctx.reply(script.drive);
    await ctx.reply(script.thanks);
});

bot.on('message', async ctx => {
    await ctx.reply(script.none);
})

bot.launch();
