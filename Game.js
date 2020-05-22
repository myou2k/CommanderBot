class Game {
    constructor(host, client){
        this.client = client
        this.host = host
        this.lobby = {}
        this.lobby[this.host.username] = this.host
        this.status = ''
    }

    join(player){
        if(player.username in this.lobby){
            return null
        }
        this.lobby[player.username] = player
        return `${player.username} has joined the game!`
    }
}

module.exports = Game