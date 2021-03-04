import { Color3, Vector3 } from "@babylonjs/core";
import { characterCleanup, SetupPlayerCamera } from "../Gallery/gameplay";
import { EnterRoom } from "../Gallery/room";
import API from "../Integration/API";
import Light from "../Model/Light";
import Slot from "../Model/Slot";
import { 
  addPiecePosition, 
  clearPieces, 
  getGalleryScene, 
  getGameRoom, 
  getLobbyMesh, 
  getLobbyScene, 
  getPieces, 
  getPlayers, 
  getScene, 
  getSelectedCharacter, 
  getUsername, 
  removePlayer, 
  setScene 
} from "../Model/state";
import dynamicCanvas from "./dynamicCanvas";
import populatePieceDetails from "./populatePieceDetails";
import { CreateSlot } from "./slotCreator";

export function GoToLobby() {
  const lobby = getLobbyScene();

  if (getScene() == lobby) {
    return;
  }

  ChangeScene(lobby);  
  
  EnterRoom("lobby", getUsername(), getSelectedCharacter(), new Vector3(1.5, 0, 0), new Vector3(0, 1.57079, 0));
}

export function GoToGallery(id) {
  const gallery = getGalleryScene();

  ChangeScene(gallery);
  //removePlayer()
  EnterRoom(`gallery-${id}`, getUsername(), getSelectedCharacter(), new Vector3(8, 0, 0), new Vector3(0, 1.57079, 0));

  // Clean up
  const pieces = getPieces(gallery);

  for (let piece of pieces) {
    gallery.removeMesh(piece.slotMesh, true);
    gallery.removeMaterial(piece.slotMaterial);
    gallery.removeLight(piece.slotLight);
  }

  clearPieces(gallery);


  // Set up
  const mesh = getLobbyMesh();
  API.getPositionsLobby().then(positions => {
    API.getCollectionPieces(id, 9).then(pieces => {
      let index = 0;
      for (let piece of pieces) {
        if (index > positions.length) {
          return;
        }
  
        const slot = positions[index++];

        const slotInfo = CreateSlot(
          new Slot(
            new Vector3(slot.position.x, slot.position.y + slot.height / 2, slot.position.z), 
            new Vector3(slot.rotation.x, slot.rotation.y, slot.rotation.z),
            { width: slot.width, height: slot.height, depth: 0.25 }, 
            2, 
            false,
            slot._id
          ), 
          new Light(
            new Color3(slot.light.color.x, slot.light.color.y, slot.light.color.z),
            slot.light.angle
          ),
          mesh,
          gallery
        );
  
        addPiecePosition(gallery, slotInfo);
  
        // Dynamic Canvas
        // Allow for different aspect ratio textures.
        dynamicCanvas(gallery, slotInfo, piece.image);

        populatePieceDetails(slotInfo, piece);
      }
    });
  });
}


export function ChangeScene(scene) {
  const gameRoom = getGameRoom();
  
  if (gameRoom) {
    gameRoom.leave();

    // Clean up player character and animations
    characterCleanup();

    // Clean up other players
    const sceneToLeave = getScene();

    const players = getPlayers();

    for (let player of players) {
      if (player.mesh) {
        sceneToLeave.removeMesh(player.mesh);
        player.mesh.dispose();
      } else {
        sceneToLeave.removeMesh(player);
        player.dispose();
      }
    }
  }
  
  setScene(scene);
  
  // Disable input on alternative scene.
  if (scene == getGalleryScene()) {
    getLobbyScene().detachControl();
  } else {
    getGalleryScene().detachControl();
  }

  SetupPlayerCamera();
  
  // Ensure removal of bindings to allow for proper reconnect.
  scene.detachControl();
  // Manually unset keyboard as will still be true from the beginning.
  scene._inputManager._keyboardIsAttached = false;

  // Attach again for input.
  scene.attachControl();
}