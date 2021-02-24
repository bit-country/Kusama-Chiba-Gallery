/* eslint-disable */
import { Room } from "colyseus";
import StateHandler from "../common/StateHandler.js";
import Player from "../common/Player.js";
import {
  PLAYER_MOVE,
  PLAYER_STOP,
  BROADCAST_PLAYER_JOINED,
  BROADCAST_PLAYER_POSITION,
  PLAYER_CHAT,
  BROADCAST_CHAT,
} from "../common/MessageTypes.js";

function randomPosition(min, max) {
  return Math.random() * (max - min) + min;
}
function getCurrentTime() {
  return new Date().toLocaleTimeString([], { timeStyle: "short" });
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

    this.onMessage(PLAYER_CHAT, (client, { content }) => {
      this.broadcast(BROADCAST_CHAT, {
        content,
        sender: this.state.players[client.id].name,
        time: getCurrentTime(),
      });
    });
  }

  onJoin(client, { name }) {
    if (typeof this.state.players[client.sessionId] === "undefined") {
      let player = new Player();
      player.name = name;

      player.joinedTime = getCurrentTime();
      player.sessionId = client.sessionId;
      player.x = randomPosition(-1, 1);
      player.z = randomPosition(-1, 1);
      player.y = 0;
      this.state.players[client.sessionId] = player;
      this.broadcast(BROADCAST_PLAYER_JOINED, {
        playerName: name,
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
    this.state.players[client.sessionId].leaveTime = getCurrentTime();
    this.broadcast("removePlayer", {
      sessionId: client.sessionId,
      player: this.state.players[client.sessionId],
    });
    delete this.state.players[client.sessionId];
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
