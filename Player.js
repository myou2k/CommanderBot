// Wrapper around the discord user obj for our game

class Player {
    constructor(userObj){
        this.userObj = userObj

        this.name = userObj.username
        this.dmChannel = userObj.dmChannel

        this.role = null
    }

    assignRole(role){
        this.role = role
    }
}

module.exports = Player