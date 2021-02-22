/* eslint-disable */
import { Room } from "colyseus";
import StateHandler from "../common/StateHandler.js";
import Player from "../common/Player.js";
import {
  PLAYER_MOVE,
  PLAYER_STOP,
  BROADCAST_PLAYER_JOINED,
  BROADCAST_PLAYER_POSITION,
} from "../common/MessageTypes.js";

function randomPosition(min, max) {
  return Math.random() * (max - min) + min;
}
export class GameRoom extends Room {
  maxClients = 50;

  onCreate(options) {
    this.setState(new StateHandler());
    // event check
    this.onMessage(PLAYER_MOVE, (client, { position, rotation }) => {
      const player = this.state.players[client.sessionId];
      player.pressedKeys = { x: position._x, y: position._y, z: position._z };
      this.broadcast(
        BROADCAST_PLAYER_POSITION,
        {
          movement: PLAYER_MOVE,
          sessionId: client.sessionId,
          position: player.pressedKeys,
          rotation: rotation,
        },
        { except: client }
      );
    });
    this.onMessage(PLAYER_STOP, (client) => {
      this.broadcast(
        BROADCAST_PLAYER_POSITION,
        {
          movement: PLAYER_STOP,
          sessionId: client.sessionId,
        },
        { except: client }
      );
    });
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
      this.broadcast(BROADCAST_PLAYER_JOINED, {
        playerName: username,
      });
    }
  }

  onUpdate(e) {
    for (const sessionId in this.state.players) {
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
