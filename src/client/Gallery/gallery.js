import {
  Color3, 
  DirectionalLight,
  HemisphericLight,
  Mesh,
  MeshBuilder, 
  PointLight, 
  SceneLoader, 
  ShadowGenerator,
  StandardMaterial,
  Texture,
  Vector3,
  Vector4
} from "@babylonjs/core";
import SetupEngine from "./engine";
import { SetupPlayer } from "./gameplay";
import { SetupHUD } from "./hud";
import Light from "../Model/Light";
import Slot from "../Model/Slot";
import { CreateSlot } from "../Utility/slotCreator";
import { getPieces, getScene, setBuildingMeshes, getBuildingMeshes, getSections } from "../Model/state";
import API from "../Integration/API";
import * as LOADERS from "@babylonjs/loaders";
import { JoinOrCreateRoom } from "./gameRoom";
import { FLOOR, WING } from "../constants";

// Related to Dynamic Canvas sizing
// Max/min dimension scales
const maxDimensionRatio = 1.25, minDimensionRatio = 0.8;

export default function SetupGallery(canvasElement, polkadotAPI) {
  const {
    engine,
    scene
  } = SetupEngine(canvasElement);
  
  SetupPlayer(canvasElement);

  JoinOrCreateRoom();
  
  const light = new HemisphericLight("Skylight", new Vector3(0, 1, 0), scene);
  light.diffuse = new Color3(0.6, 0.5, 0.6);

  //const bottomRightWingLight = new PointLight("BottomRightWing", new Vector3(-5, 2.8, 15), scene);
  
  SceneLoader.ImportMesh("", "/assets/Building5.obj", "", scene, mesh => {
    setBuildingMeshes(mesh);

    for (let submesh of mesh) {
      // Names are flipped.
      if (submesh.name.includes("BottomLeftWing")) {
        getSections().bottomRightWing.push(submesh);
      } else if (submesh.name.includes("BottomRightWing")) {
        getSections().bottomLeftWing.push(submesh);
      } else if (submesh.name.includes("BottomFloor")) {
        getSections().bottomFloor.push(submesh);
      } else if (submesh.name.includes("TopFloorFront")) {
        getSections().topFrontWing.push(submesh);
      } else if (submesh.name.includes("TopFloorBack")) {
        getSections().topBackWing.push(submesh);
      } else if (submesh.name.includes("TopRightWing")) {
        getSections().topLeftWing.push(submesh);
      } else if (submesh.name.includes("TopLeftWing")) {
        getSections().topRightWing.push(submesh);
      } else if (submesh.name.includes("Roof")) {
        getSections().roof.push(submesh);
      }

      // Be careful not to exceed max GL vertex buffers
      submesh.material.maxSimultaneousLights = 10;
      submesh.checkCollisions = true;
      submesh.receiveShadows = true;
    }

    engine.runRenderLoop(() => {
      scene.render();
    });

    API.getPositions().then(positions => {
      for (let slot of positions) {
  
        let floor = FLOOR.BOTTOM; 
        if (slot.position.y >= 3) {
          floor = FLOOR.TOP; 
        }
  
        let wing = WING.CENTRE;
        if (slot.position.z > 12) {
          wing = WING.RIGHT;
        } else if (slot.position.z < -12) {
          wing = WING.LEFT;
        } else if (slot.position.x > 10) {
          wing = WING.BACK;
        } else if (slot.position.x < -10) {
          wing = WING.FRONT;
        } // If none then it's centre
  
        let section = null;
        switch(wing) {
          case WING.CENTRE:
            section = getSections().bottomFloor;
            break;
          case WING.LEFT:
            section = floor == FLOOR.BOTTOM ? getSections().bottomLeftWing : getSections().topLeftWing;
            break
          case WING.RIGHT:
            section = floor == FLOOR.BOTTOM ? getSections().bottomRightWing : getSections().topRightWing;
            break
          case WING.FRONT:
            section = getSections().topFrontWing;
            break
          case WING.BACK:
            section = getSections().topBackWing;
            break
        }
  
        CreateSlot(
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
          section
        );
      }
    });
  
    API.getPieces().then(pieces => {
      const positions = getPieces();
  
      for (let piece of pieces) {
        const position = positions.find(pos => pos.id == piece.positionId);
  
        // Dynamic Canvas
        // Allow for different aspect ratio textures.
        const image = document.createElement("img");
        image.src = piece.image;
        image.onload = () => {
          // Ratio of height to width
          const ratio = image.naturalHeight / image.naturalWidth;
  
          // Prevent any one dimension exceeding the max
          if (ratio > maxDimensionRatio) { // If our image is too tall
            // Find the scale of ratio to max ratio
            const difRatio = maxDimensionRatio / ratio;
  
            let finalXRatio, finalYRatio;
            finalXRatio = difRatio; // Reduce width to match scale
            finalYRatio = maxDimensionRatio; // Set height to max
  
            position.slotMesh.scaling = new Vector3(finalXRatio, finalYRatio, 1);
          } else if (ratio < minDimensionRatio) { // If our image is too wide
            // Find the difference from min ratio
            const difRatio = minDimensionRatio - ratio;
  
            // Find the ratio between difference and actual
            const increaseRatio = difRatio / ratio;
  
            let finalXRatio, finalYRatio;
            if (increaseRatio > maxDimensionRatio) { 
              // We would have to increase width beyond max to keep ratio
              // so we'll max the width and reduce the height to maintain ratio
              finalXRatio = maxDimensionRatio;
              finalYRatio = ratio * finalXRatio;
            } else {
              // We can still increase the width while keeping the height at min
              finalXRatio = 1 + increaseRatio;
              finalYRatio = minDimensionRatio;
            }
            
            position.slotMesh.scaling = new Vector3(finalXRatio, finalYRatio, 1);
          } else {
            // Current ratio won't hit any limits so we can apply easily.
            position.slotMesh.scaling = new Vector3(1, ratio, 1);
          }
  
          position.slotMaterial.diffuseTexture = new Texture(piece.image, getScene());
        };     
      }
    })
  })

  SetupHUD();
}
