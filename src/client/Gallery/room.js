import { Vector3 } from "@babylonjs/core";
import * as Colyseus from "colyseus.js";
import Player from "../../common/entities/Player";
import { setGameRoom, getPlayer, getLocalPlayer } from "../Model/state";
import {
  PLAYER_MOVE,
  BROADCAST_PLAYER_POSITION,
  BROADCAST_CHAT,
  BROADCAST_CHAT_INIT,
} from "../../common/MessageTypes";
import axios from "axios";
import { importCharacter } from "./gameplay";
import { ChatSetup } from "./chat";

// import SetupPlayerHUD from "../gameClient/HUD/HUDPlayerList";
const gameHttpEndpoint = "http://localhost:2657";
const gameWS = "ws://localhost:2657";

export const InitialSetup = (username, character) => {
  EnterRoom("lobby", username || "Guest", character, new Vector3(-14, 3.1, 0), new Vector3(0, -1.57079, 0));
};

const client = new Colyseus.Client(gameWS);

const ToChat = (text) => {
  const chat = document.querySelector("#root .hud .chat");
  let nameText = document.createElement("p");
  nameText.style.color = "#ffffffad";
  nameText.style.margin = "0";
  nameText.append(text);
  chat.append(nameText);
  chat.scrollTop = chat.scrollHeight;
};

const JoinOrCreateGallery = (gallery, playerName, character, spawnPosition, spawnRotation) => {
  client.joinOrCreate(gallery, { name: playerName }).then((room) => {
    setGameRoom(room);
    
    importCharacter(character, spawnPosition, spawnRotation);

    ChatSetup();

    room.state.players.onAdd = (player, currentSession) => {
      ToChat(
        `[${player.joinedTime}] ${player.name} has joined the ${room.name}.`
      );
      const { sessionId } = room;
      if (currentSession !== sessionId) {
        new Player(player);
      } else {
        //TODO: update current player position & sync with the server
        //const t = getPlayer(currentSession);
      }
    };

    room.onMessage(
      BROADCAST_PLAYER_POSITION,
      ({ sessionId, position, rotation, movement }) => {
        const player = getPlayer(sessionId);
        if (player) {
          const walking = player.Walking;
          if (movement === PLAYER_MOVE) {
            // Update the postion for other player
            player.mesh.position = new Vector3(
              position.x,
              position.y,
              position.z
            );

            player.mesh.rotation = new Vector3(
              rotation._x,
              rotation._y,
              rotation._z
            );

            walking.start(true, 1.0, walking.from, walking.to, false);
          } else {
            // player stop
            const idle = player.Idle;
            walking.stop();
            idle.start(true, 1.0, idle.from, idle.to, false);
          }
        }
      }
    );

    room.onMessage("removePlayer", ({ player, sessionId }) => {
      const playerUI = getPlayer(sessionId);
      playerUI.mesh.dispose();

      ToChat(`[${player.leaveTime}] ${player.name} left the room.`);
    });

    room.onMessage(BROADCAST_CHAT, ({ sender, senderId, content }) => {
      ToChat(
        `${sender}${room.sessionId === senderId ? " (you)" : ""}: ${content}`
      );
    });
    room.onMessage(BROADCAST_CHAT_INIT, (chat) => {
      debugger;
      chat.forEach(({ sender, content }) => {
        ToChat(`${sender}: ${content}`);
      });
    });

    room.onLeave(() => {});
  });
};

// multiplayer
export const EnterRoom = (galleryName, playerName, character, spawnPosition, spawnRotation) => {
  // check whether the room is defined in the server or not.
  client.getAvailableRooms(galleryName).then((rooms) => {
    if (rooms.length === 0) {
      axios
        .post(`${gameHttpEndpoint}/room/new`, { name: galleryName })
        .then((res) => {
          return JoinOrCreateGallery(galleryName, playerName, character, spawnPosition, spawnRotation);
        });
    } else {
      JoinOrCreateGallery(galleryName, playerName, character, spawnPosition, spawnRotation);
    }
  });
};

export const GetTotalRooms = () => {};
export const GetRoomList = () => {};
