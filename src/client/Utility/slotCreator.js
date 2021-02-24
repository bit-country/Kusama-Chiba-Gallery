import {
  Color3,
  MeshBuilder, 
  StandardMaterial} from "@babylonjs/core";
import { CreateLight } from "./lightCreator";

export function CreateSlot(slot, light, containingMeshes, scene, shadowGenerator) {
  const {
    dimensions: slotDimensions,
    position: slotPos,
    bounds: slotBounds,
    rotation: slotRot,
    id
  } = slot;

  const artSlot = MeshBuilder.CreatePlane("ArtPiece", { width: slotDimensions.width, height: slotDimensions.height }, scene);
  artSlot.position = slotPos;
  artSlot.rotation = slotRot;
  artSlot.material = new StandardMaterial("ArtPieceMat", scene);
  artSlot.material.specularColor = new Color3(0.1, 0.1, 0.1);

  artSlot.isArt = true;

  if (shadowGenerator) {
    shadowGenerator.addShadowCaster(artSlot);
  }
  
  const artLight = CreateLight(slotDimensions, light, artSlot, containingMeshes, scene);
  artLight.includedOnlyMeshes.push(artSlot);

  if (containingMeshes) {
    artLight.includedOnlyMeshes.push(...containingMeshes);
  }

  artSlot.ArtDetails = {
    id,
    position: slotPos,
    dimensions: slotDimensions,
    bounds: slotBounds,
    slotMesh: artSlot,
    slotMaterial: artSlot.material,
    slotLight: artLight,
    art: null,
    artist: "",
    owner: "",
    name: "",
    emissive: slot.emissive,
  };

  return artSlot.ArtDetails;
}