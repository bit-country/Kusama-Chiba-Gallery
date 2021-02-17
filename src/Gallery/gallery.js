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
import { getPieces, getScene, setGround } from "../Model/state";
import API from "../Integration/API";
import * as LOADERS from "@babylonjs/loaders";

// Related to Dynamic Canvas sizing
// Max/min dimension scales
const maxDimensionRatio = 1.25, minDimensionRatio = 0.8;

export default function SetupGallery(canvasElement, polkadotAPI) {
  const {
    engine,
    scene
  } = SetupEngine(canvasElement);
  
  SetupPlayer(canvasElement);
  
  const light = new HemisphericLight("Skylight", new Vector3(0, 1, 0), scene);
  light.diffuse = new Color3(0.6, 0.5, 0.6);

  //const bottomRightWingLight = new PointLight("BottomRightWing", new Vector3(-5, 2.8, 15), scene);
  
  SceneLoader.ImportMesh("", "/assets/Building4.obj", "", scene, mesh => {
    for (let submesh of mesh) {
      if (mesh[0] != submesh) {
        submesh.parent = mesh[0];
      }

      submesh.material.maxSimultaneousLights = 10;
      submesh.checkCollisions = true;
      submesh.receiveShadows = true;
    }

    setGround(mesh[0]);

    const decal = MeshBuilder.CreateDecal("Seam", mesh[0], { 
      position: new Vector3(2.010, 1.110, 3.641),
      size: new Vector3(1, 1, 1),
      normal: Vector3.Down
    }, scene);

    decal.material = new StandardMaterial("DecalMat", scene);
    decal.material.diffuseTexture = new Texture("/assets/Decal.png", scene);
    decal.material.zOffset = -2;
    decal.material.emissiveTexture = new Texture("/assets/Decal-Emissive2.png", scene);
    decal.material.emissiveColor = new Color3(0.2, 0.2, 0.2);

    engine.runRenderLoop(() => {
      scene.render();
    });
  })

  // CreateSlot(new Slot(new Vector3(0, 1, 5), { width: 2, height: 2, depth: 0.25 }, 2, false), new Light(new Color3(0.8, 0.1, 0.7)));

  // CreateSlot(new Slot(new Vector3(4, 1, 5), { width: 4, height: 2, depth: 0.25 }, 2, false), new Light(new Color3(0.7, 0.1, 0.8)));

  // CreateSlot(new Slot(new Vector3(8, 1, 5), { width: 4, height: 2, depth: 0.25 }, 2, false), new Light(new Color3(0.1, 0.8, 0.7)));

  // CreateSlot(new Slot(new Vector3(-4, 1, 5), { width: 4, height: 2, depth: 0.25 }, 2, false), new Light(new Color3(0.1, 0.7, 0.8)));

  // CreateSlot(new Slot(new Vector3(-8, 1, 5), { width: 4, height: 2, depth: 0.25 }, 2, false), new Light(new Color3(0.8, 0.1, 0.5)));

  SetupHUD();

  API.getPositions().then(positions => {
    for (let slot of positions) {
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
        )
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
}
