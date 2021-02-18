/* eslint-disable */
import { Room } from "colyseus";
// const { Room } = require("colyseus");
// const { StateHandler } = require("../common/StateHandler.js");
// const { Player } = require("Player.js");
// const { Room } = require("colyseus");

import StateHandler from "../common/StateHandler.js";
import Player from "../common/Player.js";
// import WaitingRoom from "../../../src/components/BitWorldViewer/gameCommon/WaitingRoom";
// const schema = require("@colyseus/schema");
import { PLAYER_MOVEMENT } from "../common/MessageTypes.js";
// const ArraySchema = schema.ArraySchema;

function randomPosition(min, max) {
  return Math.random() * (max - min) + min;
}
export class GameRoom extends Room {
  maxClients = 50;

  onCreate(options) {
    //this.setSimulationInterval(() => this.onUpdate());
    this.setState(new StateHandler());
    // event check
    this.onMessage(PLAYER_MOVEMENT, (client, { position, rotation }) => {
      console.log(rotation);
      const player = this.state.players[client.sessionId];
      player.pressedKeys = { x: position._x, y: position._y, z: position._z };
    //  player.rotation = { x: rotation._x, y: rotation._y, z: rotation._z };
      this.broadcast(
        "updatePosition",
        {
          sessionId: client.sessionId,
          position: player.pressedKeys,
          rotation: rotation,
        },
        { except: client }
      );
    });
    //this.setSeatReservationTime(30);
  }

  onJoin(client, { username }) {
    console.log(`${client.sessionId} joined`);
    if (typeof this.state.players[client.sessionId] === "undefined") {
      let player = new Player();
      player.name = username;
      player.sessionId = client.sessionId;
      player.x = randomPosition(-1, 1);
      player.z = randomPosition(-1, 1);
      player.y = 0;
      this.state.players[client.sessionId] = player;
      // check for existing event
    }
  }

  onUpdate(e) {
    debugger;
    for (const sessionId in this.state.players) {
      debugger;

      const player = this.state.players[sessionId];
      if (player.pressedKeys) {
        player.x = player.pressedKeys.x;
        player.z = player.pressedKeys.z;
        player.y = player.pressedKeys.y;
      }
    }
  }

  onLeave(client) {
    delete this.state.players[client.sessionId];
    this.broadcast("removePlayer", {
      sessionId: client.sessionId,
      players: this.state.players,
    });
  }

  onDispose() {
    // return new Promise((resolve, reject) => {
    //   doDatabaseOperation((err, data) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(data);
    //     }
    //   });
    // });
  }
}
