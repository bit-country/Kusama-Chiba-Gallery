import {
  Color3, 
  DirectionalLight,
  MeshBuilder, 
  ShadowGenerator,
  StandardMaterial, 
  Vector3
} from "@babylonjs/core";
import SetupEngine from "./engine";
import { SetupPlayer } from "./gameplay";
import { SetupHUD } from "./hud";
import { CreateLight } from "./lightCreator";
import { addPiecePosition } from "./state";

export default function SetupGallery(canvasElement, polkadotAPI) {
  const {
    engine,
    scene
  } = SetupEngine(canvasElement);
  
  SetupPlayer(canvasElement);
  
  const light = new DirectionalLight("Skylight", new Vector3(0, -1, 1), scene);
  light.diffuse = new Color3(0.4, 0.4, 0.4);
  light.shadowMinZ = 1;
  light.shadowMaxZ = 10;
  light.contactHardeningLightSizeUVRatio = 1;

  const shadowGenerator = new ShadowGenerator(1024, light);
  shadowGenerator.useContactHardeningShadow = true;
  shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_LOW;
  
  const ground = MeshBuilder.CreateGround("Ground", { width: 100, height: 100 });
  ground.checkCollisions = true;
  ground.receiveShadows = true;

  const wallSouth = MeshBuilder
    .CreateBox("SouthernWall", { width: 100, height: 3, depth: 1 }, scene);
  
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

  const slotPos = new Vector3(0, 1, 5);
  const slotDimensions = { width: 2, height: 2, depth: 0.25 };
  const slotBounds = 2;
  const wallSlot = MeshBuilder.CreateBox("Slot", { width: 2, height: 2, depth: 0.25 });
  wallSlot.position = slotPos;
  wallSlot.checkCollisions = true;
  wallSlot.receiveShadows = true;

  shadowGenerator.addShadowCaster(wallSlot);

  const artLight = CreateLight(slotDimensions, wallSlot);

  const artSlot = MeshBuilder.CreatePlane("ArtPiece", { width: 2, height: 2 });
  artSlot.parent = wallSlot
  artSlot.position = new Vector3(0, 0, -(slotDimensions.depth / 2 + 0.01));
  artSlot.material = new StandardMaterial("ArtPieceMat");

  addPiecePosition({ 
    position: slotPos, 
    dimensions: slotDimensions, 
    bounds: slotBounds, 
    slotMesh: wallSlot, 
    slotMaterial: artSlot.material, 
    art: null,
    artist: "",
    owner: "",
    name: "",
  });

  SetupHUD();
}