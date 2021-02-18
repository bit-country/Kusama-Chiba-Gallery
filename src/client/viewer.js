import {
  Color3,
  DirectionalLight,
  HemisphericLight,
  MeshBuilder,
  ShadowGenerator,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import SetupEngine from "./engine";
import { SetupPlayer } from "./gameplay";
import { SetupHUD } from "./hud";
import Light from "./Models/Light";
import Slot from "./Models/Slot";
import { CreateSlot } from "./slotCreator";
import { setGround } from "./state";
import { JoinOrCreateRoom } from "./gameRoom";
export default function SetupGallery(canvasElement, polkadotAPI) {
  const { engine, scene } = SetupEngine(canvasElement);
  SetupPlayer();

  JoinOrCreateRoom();
  const light = new HemisphericLight("Skylight", new Vector3(0, 1, 0), scene);
  light.diffuse = new Color3(0.05, 0.1, 0.15);
  // Disable shadows
  // light.shadowMinZ = 1;
  // light.shadowMaxZ = 10;
  // light.contactHardeningLightSizeUVRatio = 1;

  // const shadowGenerator = new ShadowGenerator(1024, light);
  // shadowGenerator.useContactHardeningShadow = true;
  // shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_LOW;

  const ground = MeshBuilder.CreateGround("Ground", {
    width: 100,
    height: 100,
  });
  ground.material = new StandardMaterial("GroundMat", scene);
  ground.material.maxSimultaneousLights = 12;
  ground.checkCollisions = true;
  ground.receiveShadows = true;
  ground.position.y = 0;
  setGround(ground);

  const wallSouth = MeshBuilder.CreateBox(
    "SouthernWall",
    { width: 100, height: 3, depth: 1 },
    scene
  );

  wallSouth.position = new Vector3(0, 1.5, -50);
  wallSouth.addRotation(0, Math.PI, 0);
  wallSouth.checkCollisions = true;

  const wallWest = wallSouth.createInstance("WesternWall");
  wallWest.addRotation(0, 1.57, 0);
  wallWest.position = new Vector3(-50, 1.5, 0);
  wallWest.checkCollisions = true;

  const wallNorth = wallSouth.createInstance("NorthernWall");
  wallNorth.addRotation(0, Math.PI, 0);
  wallNorth.position = new Vector3(0, 1.5, 50);
  wallNorth.checkCollisions = true;

  const wallEast = wallSouth.createInstance("EasternWall");
  wallEast.addRotation(0, -1.57, 0);
  wallEast.position = new Vector3(50, 1.5, 0);
  wallEast.checkCollisions = true;

  CreateSlot(
    new Slot(
      new Vector3(0, 1, 5),
      { width: 2, height: 2, depth: 0.25 },
      2,
      true
    ),
    new Light(new Color3(0.8, 0.1, 0.7))
  );

  CreateSlot(
    new Slot(
      new Vector3(4, 1, 5),
      { width: 4, height: 2, depth: 0.25 },
      2,
      true
    ),
    new Light(new Color3(0.7, 0.1, 0.8))
  );

  CreateSlot(
    new Slot(
      new Vector3(8, 1, 5),
      { width: 4, height: 2, depth: 0.25 },
      2,
      false
    ),
    new Light(new Color3(0.1, 0.8, 0.7))
  );

  CreateSlot(
    new Slot(
      new Vector3(-4, 1, 5),
      { width: 4, height: 2, depth: 0.25 },
      2,
      true
    ),
    new Light(new Color3(0.1, 0.7, 0.8))
  );

  CreateSlot(
    new Slot(
      new Vector3(-8, 1, 5),
      { width: 4, height: 2, depth: 0.25 },
      2,
      false
    ),
    new Light(new Color3(0.8, 0.1, 0.5))
  );

  SetupHUD();
}
