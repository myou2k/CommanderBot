class Role {
    constructor(){
        this.isGood = isGood
        this.roleName = roleName
    }
}

function generateRoles(numPlayers){
    const numGood = numPlayers != 9 ? Math.floor(numPlayers / 2) + 1 : 6
    const numEvil = numPlayers - numGood
    let roleList = []

    for(i = 0; i < numGood - 2; i++){
        roleList.push(new Role(true, 'A Reistance Member'))
    }
    for(i = 0; i < numEvil - 1; i++){
        roleList.push(new Role(false, 'Spy'))
    }

    roleList.push(new Role(true, 'The Reistance Commander'))
    roleList.push(new Role(true, 'The Reistance Bodyguard'))
    roleList.push(new Role(false, 'The Spy Commander'))

    return roleList
}

module.exports = generateRoles

