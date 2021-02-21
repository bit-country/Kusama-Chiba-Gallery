/* eslint-disable */

import { SceneLoader, Vector3, TargetCamera } from "@babylonjs/core";
import * as Colyseus from "colyseus.js";
// import * as HUD from "./HUD/HUDPlayerList";
import Axios from "axios";
import Player from "../../common/entities/Player";
import { getScene, getCamera, setGameRoom } from "../Model/state";
import { SetupPlayer } from "./gameplay";
// import SetupPlayerHUD from "../gameClient/HUD/HUDPlayerList";
const gameHttpEndpoint = "http://localhost:2657";
const gameWS = "ws://localhost:2657";

const client = new Colyseus.Client(gameWS);
const worldName = "gallery";
const username = "Daniel ";
// multiplayer
export const JoinOrCreateRoom = () => {
  client.joinOrCreate(worldName, { username }).then((room) => {
    setGameRoom(room);
    room.state.players.onAdd = (player, currentSession) => {
      const { sessionId } = room;
      if (currentSession !== sessionId) {
        const p = new Player(player);
      }
      // TODO: create the current player obj here to get the position from server
    };
    room.onStateChange((state) => {
      console.log("the room state has been updated:", state);
    });
    room.onMessage("updatePosition", ({ sessionId, position, rotation }) => {
      // Update the postion for other player
      const player = getScene().getMeshByName(sessionId);
      player.position = new Vector3(position.x, position.y, position.z);
      if (rotation.left || rotation.right) {
        player.rotate(Vector3.Up(), rotation.left ? -0.1 : 0.1);
      }
      const walkAnim = player.getAnimationGroupByName("Walking");
      ///  getScene().getAnimationGroupByName("Walking");
      walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
    });
    room.onMessage("removePlayer", ({ sessionId, players }) => {
      const player = getScene().getMeshByName(sessionId);
      player.dispose();
    });

    room.onLeave(() => {});
  });
};
// const InitialRoom = (worldName) => {
//   client
//     .joinOrCreate(worldName, { username })
//     .then((room) => {
//       setGameRoom(room);
//       room.state.players.onAdd = (player, currentSession) => {
//         const { sessionId } = room;
//         if (currentSession === sessionId) {
//           //For Debugging only
//           //HUD.updateSessionDetails(player, room.id);
//           HUD.addPlayerToList(player);
//           noa.entities.addComponent(noa.playerEntity, "playerMesh", {
//             mesh: meshes[0],
//             startHidden: true,
//           });
//           noa.ents.setPosition(noa.playerEntity, [
//             player.x,
//             player.y,
//             player.z,
//           ]);
//         } else {
//           // sync all players/ data
//           HUD.addPlayerToList(player);
//           noa.entities.addComponent(currentSession, "position");
//           noa.entities.addComponent(currentSession, "playerMesh", {
//             mesh: meshes[0].createInstance(""),
//           });
//           noa.ents.setPosition(currentSession, [player.x, player.y, player.z]);
//           noa.entities.addComponent(currentSession, "movement");
//           noa.entities.addComponent(currentSession, "physics");
//           noa.entities.addComponent(currentSession, "smooth-camera");
//         }
//       };
//       room.state.players.onChange = (player, key) => {
//         //room.sessionId => self player id
//         if (key !== room.sessionId) {
//           // Update the postion for other player
//           noa.entities.setPosition(player.sessionId, [
//             player.x,
//             player.y,
//             player.z,
//           ]);
//           noa.entities.getMovement(player.sessionId).heading = player.heading;
//         }
//       };
//       room.onMessage("removePlayer", ({ sessionId, players }) => {
//         // remove (other)player entity and update player list
//         noa.ents.deleteEntity(sessionId, true);
//         HUD.updatePlayerList(players);
//       });

//       room.onLeave(() => {
//         window.currentGameRoom = undefined;
//         window.ActivePlayerList = undefined;
//       });
//     })
//     .catch((e) => {
//       console.error("join error", e);
//     });
//   // SceneLoader.ImportMesh(
//   //   null,
//   //   `./graphics/character/scene.babylon`,
//   //   null,
//   //   getScene(),
//   //   (meshes) => {
//   //     meshes[0].scaling = new Vector3(0.5, 0.5, 0.5);
//   //
//   //     const camera = new TargetCamera(
//   //       "Player",
//   //       new Vector3(0, 2, 0),
//   //       getScene()
//   //     );
//   //     camera.setTarget(meshes[0]);
//   //     client
//   //       .joinOrCreate(worldName, { username })
//   //       .then((room) => {
//   //         window.currentGameRoom = room;
//   //         room.state.players.onAdd = (player, currentSession) => {
//   //           const { sessionId } = room;
//   //           if (currentSession === sessionId) {
//   //             //For Debugging only
//   //             //HUD.updateSessionDetails(player, room.id);
//   //             HUD.addPlayerToList(player);
//   //             noa.entities.addComponent(noa.playerEntity, "playerMesh", {
//   //               mesh: meshes[0],
//   //               startHidden: true,
//   //             });
//   //             noa.ents.setPosition(noa.playerEntity, [
//   //               player.x,
//   //               player.y,
//   //               player.z,
//   //             ]);
//   //           } else {
//   //             // sync all players/ data
//   //             HUD.addPlayerToList(player);
//   //             noa.entities.addComponent(currentSession, "position");
//   //             noa.entities.addComponent(currentSession, "playerMesh", {
//   //               mesh: meshes[0].createInstance(""),
//   //             });
//   //             noa.ents.setPosition(currentSession, [
//   //               player.x,
//   //               player.y,
//   //               player.z,
//   //             ]);
//   //             noa.entities.addComponent(currentSession, "movement");
//   //             noa.entities.addComponent(currentSession, "physics");
//   //             noa.entities.addComponent(currentSession, "smooth-camera");
//   //           }
//   //         };
//   //         room.state.players.onChange = (player, key) => {
//   //           //room.sessionId => self player id
//   //           if (key !== room.sessionId) {
//   //             // Update the postion for other player
//   //             noa.entities.setPosition(player.sessionId, [
//   //               player.x,
//   //               player.y,
//   //               player.z,
//   //             ]);
//   //             noa.entities.getMovement(player.sessionId).heading =
//   //               player.heading;
//   //           }
//   //         };
//   //         room.onMessage("removePlayer", ({ sessionId, players }) => {
//   //           // remove (other)player entity and update player list
//   //           noa.ents.deleteEntity(sessionId, true);
//   //           HUD.updatePlayerList(players);
//   //         });
//   //         room.onMessage(AIRDROP_PLAYER_JOIN, (player) => {
//   //           if (window.frames["smartasset-iframe"]) {
//   //             window.frames["smartasset-iframe"].contentWindow.postMessage({
//   //               playerJoined: player.sessionId,
//   //             });
//   //             console.log("displaying player list");
//   //           }
//   //         });
//   //         room.onMessage(AIRDROP_ANNOUNCE, (partyHost) => {
//   //           if (room.sessionId !== partyHost.sessionId) {
//   //             window.GameEvent.showNotification(
//   //               "airdrop",
//   //               /* callback method for confirming event */ () => {
//   //                 room.send(AIRDROP_CONFIRM, room.sessionId);
//   //               }
//   //             );
//   //           }
//   //         });
//   //         room.onMessage(AIRDROP_START, ({ value, partyHost }) => {
//   //
//   //           console.log("airdrop starting");
//   //           if (room.sessionId !== partyHost) {
//   //             startAirdrop(value);
//   //           }
//   //         });
//   //         room.onLeave(() => {
//   //           window.currentGameRoom = undefined;
//   //           window.ActivePlayerList = undefined;
//   //         });
//   //       })
//   //       .catch((e) => {
//   //         console.error("join error", e);
//   //       });
//   //   }
//   // );
// };
