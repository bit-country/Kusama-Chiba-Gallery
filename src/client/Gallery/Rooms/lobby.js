/* eslint-disable */

import { Vector3 } from "@babylonjs/core";
import * as Colyseus from "colyseus.js";
import Player from "../../../common/entities/Player";
import { setGameRoom, getPlayer } from "../../Model/state";
import { PLAYER_MOVE } from "../../../common/MessageTypes";

const gameHttpEndpoint = "http://localhost:2657";
const gameWS = "ws://localhost:2657";

const client = new Colyseus.Client(gameWS);
const lobby = "lobby";

export const EnterLobby = (username) => {
  client.joinOrCreate(lobby, { username }).then((room) => {
    setGameRoom(room);
    room.state.players.onAdd = (player, currentSession) => {
      const { sessionId } = room;
      if (currentSession !== sessionId) {
        debugger;
        new Player(player);
      } else {
        //TODO: update current player position & sync with the server
        //const t = getPlayer(currentSession);
      }
    };
    room.onStateChange((state) => {
      console.log("the room state has been updated:", state);
    });
    room.onMessage(
      "updatePosition",
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
            if (rotation.left || rotation.right) {
              player.mesh.rotate(Vector3.Up(), rotation.left ? -0.1 : 0.1);
            }
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
    room.onMessage("removePlayer", ({ sessionId, players }) => {
      const player = getPlayer(sessionId);
      player.mesh.dispose();
    });

    room.onLeave(() => {});
  });
};
