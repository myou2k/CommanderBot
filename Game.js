require("./utils").run();

const generateMissions = require("./Mission");
const generateRoles = require("./Role");

class Game {
  constructor(host, client, channel) {
    this.client = client;
    this.channel = channel;

    this.host = host.username;
    this.lobby = {}; // username, User pairs
    this.lobby[this.host] = host;
    this.round = 0;
    this.started = false;
    this.gameOver = false;

    this.roles = {};
    this.roleListById = {};

    this.order = [];
    this.leaderToken = 0;
    this.leader = "";

    this.missions = null;
    this.currMission = null;
    this.chaos = 0;

    this.roundsPassed = 0;
    this.roundsFailed = 0;

    //Clean ups
    this.collectors = {};
  }

  join(player) {
    if (player.username in this.lobby) {
      return `${player.username} is already in the game`;
    }
    this.lobby[player.username] = player;
    return `${player.username} has joined the game!`;
  }

  _config(numPlayers) {
    /* 

    GIVEN number of players return
    a list of missions and roles in the game.

    */

    this.missions = generateMissions(numPlayers);
    this._roles = generateRoles(numPlayers);

    // Assign seating order
    for (let playerName in this.lobby) {
      this.order.push(playerName);
    }
    this.order.shuffle();
    this.leader = this.order[0];
  }

  start() {
    let numPlayers = Object.keys(this.lobby).length;
    this._config(numPlayers);
    this.started = true;
    this._assignRoles();
    this._dmRoles();
    this.play();
  }

  async play() {
    // Play round, update results, check win conditions, keep playing

    // Using promises?

    // this._startRound()
    //   .then((result) => {
    //     this._resolveRound(result);
    //   })
    //   .then(() => {
    //     if (this.gameOver) {
    //       this.end();
    //     } else {
    //       this.play();
    //     }
    //   });

    //rewrite with async/await

    let result = await this._playRound();
    this._resolveRound(result);
    if (this.gameOver) {
      this.end(); //WIP
    } else {
      this.play();
    }
  }

  _assignRoles() {
    //Binds the players with the roles
    this._roles.shuffle();
    let i = 0;
    for (let playerName in this.lobby) {
      this.roles[playerName] = this._roles[i];
      if (this.roleListById[this._roles[i].roleId]) {
        this.roleListById[this._roles[i].roleId](playerName);
      } else {
        this.roleListById[this._roles[i].roleId] = [playerName];
      }
      i += 1;
    }
    console.log("Roles in this game:", this.roles);
  }

  _dmRoles() {
    for (let playerName in this.lobby) {
      let playerObj = this.lobby[playerName];
      let playerRole = this.roles[playerName];
      playerObj
        .createDM()
        .then((channel) => {
          channel.send(
            `Game has started. This DM channel is for all sensitive information!`
          );
          channel.send(`You are ${playerRole.roleName}`);

          if (playerRole.roleId === "e") {
            let otherSpies = [];
            let spyLeader = this.roleListById["ec"][0];
            this.roleListById["e"].forEach((name) => {
              if (name !== playerName) {
                otherSpies.push(name);
              }
            });
            otherSpies.push(spyLeader)
            otherSpies.shuffle()
            channel.send(`The other spies are ${otherSpies.join(" and ")}`);
            return;
          }
          if (playerRole.roleId === "ec") {
            let otherSpies = [];
            this.roleListById["e"].forEach((name) => {
              otherSpies.push(name);
            });
            channel.send(`The other spies are ${otherSpies.join(" and ")}`);
            return;
          }
          if (playerRole.roleId === "bg") {
            let commanders = [
              this.roleListById["c"][0],
              this.roleListById["ec"][0],
            ];
            commanders.shuffle();
            channel.send(
              `The two commanders are ${commanders[0]} and ${commanders[1]}`
            );
            return;
          }
          if (playerRole.roleId === "c") {
            let spies = [];
            this.roleListById["e"].forEach((name) => {
              spies.push(name);
            });
            spies.push(this.roleListById["ec"][0]);
            spies.shuffle();
            channel.send(`The spies are ${spies.join(" and ")}`);
            return;
          }
        })
        .catch((err) => console.log(err));
    }
  }

  async _playRound() {
    this.currMission = this.missions[this.round];
    let currMission = this.currMission;

    let result = "";

    currMission.phase = -1; // -1 : not started, 0 : proposing,  1: voting for team, 2 : team putting in pass/fail, 3: done

    while (currMission.phase !== 3) {
      if (currMission.phase === -1) {
        await this.channel.send(
          `Current mission: ${currMission.index}, starting leader: ${this.leader}`
        );
        currMission.phase = 0;
        await this.channel.send(
          `${currMission.agents} agents required for the mission, ${currMission.failsNeeded} fails needed for spies`
        );
      } else if (currMission.phase === 0) {
        await this.channel.send(
          `${
            this.lobby[this.leader]
          }, use '!team @user @user...' to propose a team`
        );

        let currLeader = this.leader;

        let resolvedProposalPromise = await this.channel.awaitMessages(
          (msg) => msg.content.startsWith("!team"),
          { max: 1 }
        );
        let proposal = resolvedProposalPromise.first();
        if (currMission.phase !== 0) {
          await proposal.reply("Can't propose team");
        }

        if (proposal.author.username !== currLeader) {
          await proposal.reply(`Only the leader can propose a team`);
          continue;
        }
        let team = proposal.mentions.members.array().map(member => member.user);
        if (new Set(team).size === currMission.agents) {
          console.log(' proposed team', team)
          await proposal.channel.send(
            `${currLeader} proposed team: ${team
              .map(playerObj => playerObj.username).join(" and ")}`
          );
          currMission.addProposal(currLeader, team);
          currMission.phase = 1;
        } else {
          await proposal.reply("Invalid proposal, try again");
        }
      } else if (currMission.phase === 1) {
        await this.channel.send(
          `Team voting begins now. DM '!accept' or '!reject' to me`
        );

        let teamVotes = {
          "!accept": [],
          "!reject": [],
        };

        let votePromiseArr = [];

        for (let playerName in this.lobby) {
          let teamVote = this.lobby[playerName].dmChannel.awaitMessages(
            (msg) => msg.content === "!accept" || msg.content === "!reject",
            { max: 1 }
          );
          votePromiseArr.push(teamVote);
        }

        let voteCollection = await Promise.all(votePromiseArr);
        voteCollection.forEach((v) =>
          teamVotes[v.first().content].push(v.first().author.username)
        );

        await this.channel.send(
          `Accept Votes : ${teamVotes["!accept"].join(" ")}`
        );
        await this.channel.send(
          `Reject Votes : ${teamVotes["!reject"].join(" ")}`
        );
        if (teamVotes["!accept"].length > teamVotes["!reject"].length) {
          await this.channel.send("Proposal Passes");
          this.chaos = 0;

          currMission.finalTeam = currMission.currTeam;
          currMission.phase = 2;
        } else {
          await this.channel.send("Proposal Fails");
          this.chaos += 1;
          if (this.chaos >= 5) {
            currMission.phase = 3;
            result = "chaos";
            return Promise.resolve(result);
          }
          await this.channel.send(`Current chaos: ${this.chaos}`);
          currMission.phase = 0;
        }
        currMission.addHistory(currMission.currTeam, teamVotes);
        this.leaderToken += 1;
        this.leader = this.order[
          this.leaderToken % Object.keys(this.lobby).length
        ];
      } else if (currMission.phase === 2) {
        await this.channel.send(`Mission is in progress...`);

        let missionVotes = {
          "!pass": 0,
          "!fail": 0,
        };

        let missionVotePromiseArr = [];

        console.log('currMission.finalTeam', currMission.finalTeam)

        for(let member of currMission.finalTeam) {
        //   console.log('member', member)
        //   console.log('this.roles[member.username]', this.roles[member.username])
          console.log('member.dmChannel', member.dmChannel)
          if (this.roles[member.username].isGood) {
            await member.dmChannel.send(
              "As a resistance member you can only !pass"
            );
            let missionVote = member.dmChannel.awaitMessages(
              (msg) => msg.content === "!pass",
              { max: 1 }
            );
            console.log('missionVote', missionVote)
            missionVotePromiseArr.push(missionVote);
          } else {
            await member.dmChannel.send(
              "As a spy you can choose to !pass or !fail this mission"
            );
            let missionVote = member.dmChannel.awaitMessages(
              (msg) => msg.content === "!pass" || msg.content === "!fail",
              { max: 1 }
            );
            console.log('missionVote', missionVote)
            missionVotePromiseArr.push(missionVote);
          }
        };
        console.log('missionVotePromiseArr', missionVotePromiseArr)
        let missionVoteCollection = await Promise.all(missionVotePromiseArr);
        console.log('missionVoteCollection after', missionVoteCollection)
        missionVoteCollection.forEach(
          (v) => (missionVotes[v.first().content] += 1)
        );
        await this.channel.send(
          `Mission Results: ${missionVotes["!pass"]} pass, ${missionVotes["!fail"]} fail`
        );
        if (missionVotes["!fail"] >= currMission.failsNeeded) {
          result = "fail";
        } else {
          result = "pass";
        }
        currMission.phase = 3;
      }
    }
    return Promise.resolve(result);
  }

  _resolveRound(result) {
    if (result === "pass") {
      this.roundsPassed += 1;
      this.round += 1 
    }
    if (result === "fail") {
      this.roundsFailed += 1;
      this.round += 1 
    }
    if (result === "chaos") {
      this.gameOver = true;
    }
    if (this.roundsPassed >= 3) {
      this.gameOver = true;
    }
    if (this.roundsFailed >= 3) {
      this.gameOver = true;
    }
  }

  async end() {
    if (this.chaos >= 5) {
      await this.channel.send(
        `The Resistance has fallen into chaos, Spies win`
      );
    }
    if (this.roundsFailed >= 3) {
      await this.channel.send(`3 Rounds failed, Spies win`);
    }

    let spies = this.roleListById["e"].concat(this.roleListById['ec']);
    console.log(spies)

    await this.channel.send(`The Spies are ${spies.join(" and ")}`);

    if (this.roundsPassed >= 3) {
      await this.channel.send(
        `3 Rounds passed, Spies have one chance to assassinate the commander`
      );
      let spyVote = await this.channel.awaitMessages(
        (msg) =>
          msg.content.startsWith("!kill") &&
          this.lobby[msg.content.split(" ")[1]] &&
          msg.author.username === this.roleListById["ec"][0],
        { max: 1 }
      );
      let name = spyVote.first().content.split(" ")[1];
      await this.channel.send(`The commander is ${this.roleListById["c"][0]}`);
      await this.channel.send(`The spies chose to assassinate ${name}`);
      if (name === this.roleListById["c"][0]) {
        await this.channel.send(`Spies Win`);
      } else {
        await this.channel.send(`Resistance Win`);
      }
    }
    await this.channel.send(`Use the !end command to finish the game`);
  }

  async test() {
        this._config(7);
        console.log(this._roles);
        this._assignRoles();
        console.log(this.roles);
        this.roleListById = {
          'e': ["adam", "bob"],
          'g': ["cat", "david"],
          'bg': ["esther"],
          'c': ["frank"],
          'ec': ["myou2k"],
        };
        this._dmRoles();
        this.lobby = {
            'myou2k': 'mock',
            'adam': 'mock',
            'frank': 'mock',
        }
        this.roundsPassed = 3
        this.end()
      }
}

module.exports = Game;
