class Mission {
    constructor(agents, index){
        this.agents = agents
        this.index = index

        this.failsNeeded = (this.index === 4 && this.agents >= 4) ? 2 : 1
        this.phase = -1 // -1 : not started, 0 : proposing,  1: in progress, 2 : done 
        this.result = '' // 'p' : passed, 'f' : failed

        this.history = []
        this.lastProposal = null

        this.finalTeam = []
        this.currTeam = []
    }

    addProposal(leader, team){
        let proposal = {}
        proposal[leader] = team
        this.lastProposal = proposal
        this.currTeam = team
    }

    addHistory(proposal, result){
        this.history.push([proposal, result])
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
            missionList.push(new Mission(MissionTable[numPlayers][i], i + 1))
        }
    }
    else{
        for(i = 0; i < MissionTable[8].length; i++){
            missionList.push(new Mission(MissionTable[8][i], i + 1))
        }
    }
    return missionList
}

module.exports = generateMissions