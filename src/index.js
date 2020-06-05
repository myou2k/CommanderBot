require('dotenv').config()

const Game = require('./Game')
// const Player = require('./Player')

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
            msg.reply('There\'s already a game created')
            return
        }
        Session = new Game(msg.author, Bot, msg.channel)
        reply = `${msg.author.username}'s game is now created`
        msg.channel.send(reply)
    }
    
    if(msg.content === '!lobby'){
        if(!Session){
            msg.reply('No game created')
            return
        }

        let playerList = []
        for(let player in Session.lobby){
            playerList.push(player)
        }
        reply = `${playerList.join(', ')} ${playerList.length > 1 ? 'are' : 'is'} playing right now`
        msg.reply(reply)
    }

    if(msg.content === '!join'){
        if(!Session){
            msg.reply('No game created')
            return
        }
        if(Session.started){
            msg.reply('Game has already started')
            return
        }
        reply = Session.join(msg.author)
        if(reply){
            msg.channel.send(reply)
        }
    }

    if(msg.content === '!start'){
        if(!Session){
            msg.reply('No game created')
            return
        }
        if(Session.started){
            msg.reply('Game has already started')
            return
        }
        if(msg.author.username != Session.host){
            msg.reply('Only the host can start the game')
            return
        }

        let numPlayers = Object.keys(Session.lobby).length
        console.log(numPlayers)
        if(5 > numPlayers || numPlayers > 10){
            msg.reply('You can only start with 5 to 10 players')
            return
        }

        msg.channel.send('Game is starting...')
        Session.start()
    }

    if(msg.content === '!end'){
        Session = null
    }

    if(msg.content === '!test'){
        Session.test()
    }
})

Bot.login(process.env.TOKEN)

// TestBots

// const startTestBot = require('./testBots')
// startTestBot()


