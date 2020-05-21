require('dotenv').config()

const Discord = require('discord.js')
const Bot = new Discord.Client()

Bot.on('ready', () => {
    console.log(`logged in as ${Bot.user.tag}!`)
})

Bot.on('message', msg => {
    if(msg.content === '!ping'){
        msg.reply('pong')
    }
})

Bot.login(process.env.TOKEN)