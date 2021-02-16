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
    id
  } = slot;

  const artSlot = MeshBuilder.CreatePlane("ArtPiece", { width: slotDimensions.width, height: slotDimensions.height });
  artSlot.position = slotPos;
  artSlot.material = new StandardMaterial("ArtPieceMat");

  if (shadowGenerator) {
    shadowGenerator.addShadowCaster(artSlot);
  }
  
  const artLight = CreateLight(slotDimensions, light, artSlot);
  artLight.includedOnlyMeshes.push(artSlot, getGround());

  addPiecePosition({
    id,
    position: slotPos,
    dimensions: slotDimensions,
    bounds: slotBounds,
    slotMesh: artSlot,
    slotMaterial: artSlot.material,
    art: null,
    artist: "",
    owner: "",
    name: "",
    emissive: slot.emissive,
  });
}