import { Color3, Texture, Vector3 } from "@babylonjs/core";
import { SetupPlayer } from "../Gallery/gameplay";
import API from "../Integration/API";
import Light from "../Model/Light";
import Slot from "../Model/Slot";
import { addPiecePosition, clearPieces, getGalleryScene, getLobbyMesh, getLobbyScene, getPieces, setScene } from "../Model/state";
import dynamicCanvas from "./dynamicCanvas";
import { CreateSlot } from "./slotCreator";

export function GoToLobby() {
  ChangeScene(getGalleryScene());
}

export function GoToGallery(id) {
  const scene = getLobbyScene();
  ChangeScene(scene);

  // Clean up
  const pieces = getPieces(scene);

  for (let piece of pieces) {
    scene.removeMesh(piece.slotMesh, true);
    scene.removeMaterial(piece.slotMaterial);
    scene.removeLight(piece.slotLight);
  }

  clearPieces(scene);


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
          scene
        );
  
        addPiecePosition(scene, slotInfo);
  
        // Dynamic Canvas
        // Allow for different aspect ratio textures.
        dynamicCanvas(scene, slotInfo, piece.image);
      }
    });
  });
}


export function ChangeScene(scene) {
  setScene(scene);

  // Disable input on alternative scene.
  if (scene == getGalleryScene()) {
    getLobbyScene().detachControl();
  } else {
    getGalleryScene().detachControl();
  }

  SetupPlayer();
  
  // Ensure removal of bindings to allow for proper reconnect.
  scene.detachControl();
  // Manually unset keyboard as will still be true from the beginning.
  scene._inputManager._keyboardIsAttached = false;

  // Attach again for input.
  scene.attachControl();
}