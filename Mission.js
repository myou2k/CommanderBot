class Mission {
    constructor(agents){
        this.agents = agents
    }
}

const MissionTable = {
    5 : [2, 3, 2, 3, 3],
    6 : [2, 3, 4, 3, 4],
    7 : [2, 3, 3, 4, 4],
    8 : [3, 4, 4, 5, 5]
}

function generateMissions(numPlayers){
    let missionList = []
    if(numPlayers < 8){
        for(i = 0; i < MissionTable[numPlayers].length; i++){
            missionList.push(new Mission(MissionTable[numPlayers][i]))
        }
    }
    else{
        for(i = 0; i < MissionTable[8].length; i++){
            missionList.push(new Mission(MissionTable[8][i]))
        }
    }
    return missionList
}

module.exports = generateMissions