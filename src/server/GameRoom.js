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
  BROADCAST_CHAT_INIT,
} from "../common/MessageTypes.js";
import * as chatService from "./ChatService.js";

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

    this.onMessage(PLAYER_CHAT, (client, { content, room }) => {
      console.log(client);
      const data = {
        room: this.roomName,
        content,
        sender: this.state.players[client.id].name,
        senderId: client.id,
        time: new Date().toLocaleString(),
      };
      chatService.Write(data, "Chat");
      this.broadcast(BROADCAST_CHAT, data);
    });
  }

  onJoin(client, { name }) {
    //  this.clients[0].send()
    if (typeof this.state.players[client.sessionId] === "undefined") {
      chatService.Read("Chat", { room: this.roomName }).then((chat) => {
        if (chat) {
          client.send(BROADCAST_CHAT_INIT, chat);
        }
      });

      let player = new Player();
      player.name = name;

      player.joinedTime = getCurrentTime();
      player.sessionId = client.sessionId;
      player.x = randomPosition(-15, -18);
      player.z = randomPosition(-2.5, 2.5);
      player.y = 3.1;
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
