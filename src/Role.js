class Role {
    constructor(isGood, roleName, roleId){
        this.isGood = isGood
        this.roleName = roleName

        /*
        Resistance Members : g (good)
        Spy: 'e' (evil)
        Commander: 'c'
        Bodyguard : 'bg'
        Spy Commander : 'ec' (evil commander)
        */

        this.roleId = roleId
    }
}

function generateRoles(numPlayers){
    const numGood = numPlayers != 9 ? Math.floor(numPlayers / 2) + 1 : 6
    const numEvil = numPlayers - numGood
    let roleList = []

    for(i = 0; i < numGood - 2; i++){
        roleList.push(new Role(true, 'a Resistance Member', 'g'))
    }
    for(i = 0; i < numEvil - 1; i++){
        roleList.push(new Role(false, 'a Spy', 'e'))
    }

    roleList.push(new Role(true, 'the Resistance Commander', 'c'))
    roleList.push(new Role(true, 'the Resistance Bodyguard', 'bg'))
    roleList.push(new Role(false, 'the Spy Commander', 'ec'))

    return roleList
}

module.exports = generateRoles

