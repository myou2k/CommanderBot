const Discord = require("discord.js");
require('dotenv').config()

const startTestBots = () => {
  const Tester1 = new Discord.Client();
  let pubChannel1 = null
  let dmChannel1 = null
  Tester1.on("ready", () => {
    console.log(`loggedin as ${Tester1.user.tag}`);
  });

  Tester1.on("message", (msg) => {
    if (msg.content.startsWith('!echo1')) {
      pubChannel1 = msg.channel
      let [cmd, ...echo] = msg.content.split(' ')
      echo = echo.join(' ')
      msg.channel.send(`${echo}`)
    }

    if(msg.channel.type === 'dm'){
        dmChannel1 = msg.channel
        console.log('Tester1', msg.content)
    }

    if(msg.content.startsWith('!dm1')){
        let [cmd, ...echo] = msg.content.split(' ')
        echo = echo.join(' ')
        dmChannel1.send(`${echo}`)
    }

  });

  const Tester2 = new Discord.Client();
  let pubChannel2 = null
  let dmChannel2 = null
  Tester2.on("ready", () => {
    console.log(`loggedin as ${Tester2.user.tag}`);
  });

  Tester2.on("message", (msg) => {
    if(msg.content.startsWith('!echo2')) {
      pubChannel2 = msg.channel
      let [cmd, ...echo] = msg.content.split(' ')
      echo = echo.join(' ')
      msg.channel.send(`${echo}`)
    }

    if(msg.channel.type === 'dm'){
        dmChannel2 = msg.channel
        console.log('Tester2', msg.content)
    }

    if(msg.content.startsWith('!dm2')){
        let [cmd, ...echo] = msg.content.split(' ')
        echo = echo.join(' ')
        dmChannel2.send(`${echo}`)
    }

  });

  const Tester3 = new Discord.Client();
  let pubChannel3 = null
  let dmChannel3 = null
  Tester3.on("ready", () => {
    console.log(`loggedin as ${Tester3.user.tag}`);
  });

  Tester3.on("message", (msg) => {
    if (msg.content.startsWith('!echo3')) {
      pubChannel3 = msg.channel    
      let [cmd, ...echo] = msg.content.split(' ')
      echo = echo.join(' ')
      msg.channel.send(`${echo}`)
    }

    if(msg.channel.type === 'dm'){
        dmChannel3 = msg.channel
        console.log('Tester3', msg.content)
    }

    if(msg.content.startsWith('!dm3')){
        let [cmd, ...echo] = msg.content.split(' ')
        echo = echo.join(' ')
        dmChannel3.send(`${echo}`)
    }

  });

  const Tester4 = new Discord.Client();
  let pubChannel4 = null
  let dmChannel4 = null
  Tester4.on("ready", () => {
    console.log(`loggedin as ${Tester4.user.tag}`);
  });

  Tester4.on("message", (msg) => {
    if (msg.content.startsWith('!echo4')) {
      pubChannel4 = msg.channel
      let [cmd, ...echo] = msg.content.split(' ')
      echo = echo.join(' ')
      msg.channel.send(`${echo}`)
    }

    if(msg.channel.type === 'dm'){
        dmChannel4 = msg.channel
        console.log('Tester4', msg.content)
    }

    if(msg.content.startsWith('!dm4')){
        let [cmd, ...echo] = msg.content.split(' ')
        echo = echo.join(' ')
        dmChannel4.send(`${echo}`)
    }

  });

  Tester1.login(process.env.BOT1)
  Tester2.login(process.env.BOT2)
  Tester3.login(process.env.BOT3)
  Tester4.login(process.env.BOT4)



};

module.exports = startTestBots