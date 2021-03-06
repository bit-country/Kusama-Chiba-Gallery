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
  maxClients = 100;

  onCreate(options) {
    this.setState(new StateHandler());

    // event check
    this.onMessage(PLAYER_MOVE, (client, { position, rotation, direction }) => {
      const player = this.state.players[client.sessionId];
      player.x = position._x;
      player.y = position._y;
      player.z = position._z;
      this.broadcast(
        BROADCAST_PLAYER_POSITION,
        {
          movement: PLAYER_MOVE,
          sessionId: client.sessionId,
          position: { x: position._x, y: position._y, z: position._z },
          rotation: rotation,
          direction,
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
      //chatService.Write(data, "Chat");
      this.broadcast(BROADCAST_CHAT, data);
    });
  }

  onJoin(client, { name, character }) {
    //  this.clients[0].send()

    if (typeof this.state.players[client.sessionId] === "undefined") {
      // chatService.Read("Chat", { room: this.roomName }).then((chat) => {
      //   if (chat) {
      //     client.send(BROADCAST_CHAT_INIT, chat);
      //   }
      // });

      let player = new Player();
      player.name = name;
      player.x = 0;
      player.y = 0;
      player.z = 0;
      player.character = character;
      player.joinedTime = getCurrentTime();
      player.sessionId = client.sessionId;
      this.state.players[client.sessionId] = player;

      this.broadcast(BROADCAST_PLAYER_JOINED, {
        playerName: name,
      });
    }
  }

  onLeave(client) {
    console.log(`${client.sessionId} left`);

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
