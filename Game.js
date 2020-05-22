const generateMissions = require('./Mission')
const generateRoles = require('./Role')

class Game {
    constructor(host, client){
        this.client = client
        this.host = host
        this.lobby = {}
        this.lobby[this.host.username] = this.host
        this.round = 0
        this.started = false
    }

    join(player){
        if(player.username in this.lobby){
            return null
        }
        this.lobby[player.username] = player
        return `${player.username} has joined the game!`
    }

    /* 

    GIVEN number of players return
    a list of missions and roles in the game.

    */

    config(numPlayers){
        this.missions = generateMissions(numPlayers)
        this.roles = generateRoles(numPlayers)
    }

    start(){
        numPlayers = Object.keys(this.lobby).length
        this.config()
        this.started = true
    }
}

module.exports = Game