require("./utils").run();

const generateMissions = require("./Mission");
const generateRoles = require("./Role");

class Game {
  constructor(host, client) {
    this.client = client;
    this.host = host.username;
    this.lobby = {}; // username, User pairs
    this.lobby[this.host] = host;
    this.round = 0;
    this.started = false;
  }

  join(player) {
    if (player.username in this.lobby) {
      return null;
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
  }

  start() {
    numPlayers = Object.keys(this.lobby).length;
    this._config(numPlayers);
    this.started = true;
    this._assignRoles();
    this._dmRoles();
    this._nextRound();
  }

  _assignRoles() {
    //Binds the players with the roles
    this._roles.shuffle();
    this.roles = {};
    this.roleListById = {};
    let i = 0;
    console.log(this.lobby);
    for (let playerName in this.lobby) {
      this.roles[playerName] = this._roles[i];
      if (this.roleListById[this._roles[i].roleId]) {
        this.roleListById[this._roles[i].roleId](playerName);
      } else {
        this.roleListById[this._roles[i].roleId] = [playerName];
      }
      i += 1;
    }
  }

  _dmRoles() {
    for (let playerName in this.lobby) {
      let playerObj = this.lobby[playerName];
      let playerRole = this.roles[playerName];
      playerObj.createDM().then((channel) => {
        channel.send(`Game has started. Keep this DM Open!`);
        channel.send(`You are ${playerRole.roleName}`);

        if (playerRole.roleId === "e") {
          let otherSpies = [];
          let spyLeader = this.roleListById["ec"][0];
          this.roleListById["e"].forEach((name) => {
            if (name !== playerName) {
              otherSpies.push(name);
            }
          });
          channel.send(
            `The other spies are ${otherSpies.join(" and ")}`
          );
          channel.send(`The Spy Commander is ${spyLeader}`);
          return;
        }
        if (playerRole.roleId === "ec") {
          let otherSpies = [];
          this.roleListById["e"].forEach((name) => {
            otherSpies.push(name);
          });
          channel.send(
            `The other spies are ${otherSpies.join(" and ")}`
          );
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
      });
    }
  }

  test() {
    this._config(7);
    console.log(this._roles);
    this._assignRoles();
    console.log(this.roles);
    this.roleListById = {
      'e': ["adam", "bob"],
      'g': ["cat", "david"],
      'bg': ["esther"],
      'c': ["frank"],
      'ec': ["gary"],
    };
    this._dmRoles();
  }
}

module.exports = Game;
