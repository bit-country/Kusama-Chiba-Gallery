import { Vector3 } from "@babylonjs/core";
import * as Colyseus from "colyseus.js";
import Player from "../../common/entities/Player";
import { setGameRoom, getPlayer } from "../Model/state";
import {
  PLAYER_MOVE,
  BROADCAST_PLAYER_POSITION,
} from "../../common/MessageTypes";
import axios from "axios";
import { importCharacter } from "./gameplay";

// import SetupPlayerHUD from "../gameClient/HUD/HUDPlayerList";
const gameHttpEndpoint = "http://localhost:2657";
const gameWS = "ws://localhost:2657";

export const InitialSetup = (username, character) => {
  EnterRoom("gallery", username || "Guest", character);
};

const client = new Colyseus.Client(gameWS);

const ToChat = (text) => {
  const chat = document.querySelector("#root .hud .chat");
  let nameText = document.createElement("p");
  nameText.style.color = "#ffffffad";
  nameText.style.margin = "0";
  nameText.append(text);
  chat.append(nameText);
};

const JoinOrCreateGallery = (gallery, playerName, character) => {
  client.joinOrCreate(gallery, { name: playerName }).then((room) => {
    setGameRoom(room);
    importCharacter(character);

    room.state.players.onAdd = (player, currentSession) => {
      console.log(`entered a gallery - ${gallery}`);
      ToChat(`[${player.joinedTime}] ${player.name} has joined the room.`);
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

    room.onLeave(() => {});
  });
};

// multiplayer
export const EnterRoom = (galleryName, playerName, character) => {
  // check whether the room is defined in the server or not.
  client.getAvailableRooms(galleryName).then((rooms) => {
    if (rooms.length === 0) {
      axios
        .post(`${gameHttpEndpoint}/room/new`, { name: galleryName })
        .then((res) => {
          return JoinOrCreateGallery(galleryName, playerName, character);
        });
    } else {
      JoinOrCreateGallery(galleryName, playerName, character);
    }
  });
};

export const GetTotalRooms = () => {};
export const GetRoomList = () => {};
