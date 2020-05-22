require('dotenv').config()

const Game = require('./Game')

const Discord = require('discord.js')
const Bot = new Discord.Client()

Bot.on('ready', () => {
    console.log(`logged in as ${Bot.user.tag}!`)
})

let Session = null

Bot.on('message', msg => {
    if(msg.content === '!ping'){
        msg.reply('pong')
    }

    if(msg.content === '!create'){
        if(Session){
            msg.reply('There\'s already a game ging in session')
            return
        }
        Session = new Game(msg.author, Bot)
        reply = `${msg.author}'s game is now in session`
        msg.channel.send(reply)
    }
    
    if(msg.content === '!lobby'){
        if(!Session){
            msg.reply('No game in session')
            return
        }

        let playerList = []
        for(player in Session.lobby){
            playerList.push(player)
        }
        reply = `${playerList.join(', ')} ${playerList.length > 1 ? 'are' : 'is'} playing right now`
        msg.reply(reply)
    }

    if(msg.content === '!join'){
        if(!Session){
            msg.reply('No game in session')
            return
        }
        reply = Session.join(msg.author)
        if(reply){
            msg.channel.send(reply)
        }
    }
})

Bot.login(process.env.TOKEN)

