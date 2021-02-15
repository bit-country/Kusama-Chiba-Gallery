import {
  Color3,
  MeshBuilder, 
  StandardMaterial, 
  Vector3
} from "@babylonjs/core";
import { CreateLight } from "./lightCreator";
import { addPiecePosition, getGround } from "../Model/state";

export function CreateSlot(slot, light, shadowGenerator) {
  const {
    dimensions: slotDimensions,
    position: slotPos,
    bounds: slotBounds,
  } = slot;

  const wallSlot = MeshBuilder.CreateBox("Slot", { width: slotDimensions.width, height: slotDimensions.height, depth: slotDimensions.depth });
  wallSlot.position = slotPos;
  wallSlot.checkCollisions = true;
  wallSlot.receiveShadows = true;

  if (shadowGenerator) {
    shadowGenerator.addShadowCaster(wallSlot);
  }

  const artLight = CreateLight(slotDimensions, light, wallSlot);
  
  const artSlot = MeshBuilder.CreatePlane("ArtPiece", { width: slotDimensions.width, height: slotDimensions.height });
  artSlot.parent = wallSlot;
  artSlot.position = new Vector3(0, 0, -(slotDimensions.depth / 2 + 0.01));
  artSlot.material = new StandardMaterial("ArtPieceMat");
  
  artLight.includedOnlyMeshes.push(wallSlot, artSlot, getGround());

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
    emissive: slot.emissive,
  });
}