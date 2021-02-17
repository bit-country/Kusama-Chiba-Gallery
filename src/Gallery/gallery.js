import {
  Color3, 
  DirectionalLight,
  HemisphericLight,
  Mesh,
  MeshBuilder, 
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


export default function SetupGallery(canvasElement, polkadotAPI) {
  const {
    engine,
    scene
  } = SetupEngine(canvasElement);
  
  SetupPlayer(canvasElement);
  
  const light = new HemisphericLight("Skylight", new Vector3(0, 1, 0), scene);
  light.diffuse = new Color3(0.05, 0.1, 0.15);
  
  SceneLoader.ImportMesh("", "/assets/Building.obj", "", scene, mesh => {
    for (let submesh of mesh) {
      submesh.material = new StandardMaterial("BuildingMat", scene);
      submesh.material.maxSimultaneousLights = 12;
      submesh.checkCollisions = true;
      submesh.receiveShadows = true;
    }

    setGround(mesh[0]);
    debugger;

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

      // TODO Allow for different aspect ratio textures.
      position.slotMaterial.diffuseTexture = new Texture(piece.image, getScene());
    }
  })
}
