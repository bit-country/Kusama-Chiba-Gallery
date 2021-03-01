import {
  Color3,
  MeshBuilder, 
  StandardMaterial,
  Vector3} from "@babylonjs/core";
import { getScene, getSlotMesh, setSlotMesh } from "../Model/state";
import { CreateLight } from "./lightCreator";

export function SetupSlotMesh(scene) {
  const baseMesh = MeshBuilder.CreatePlane("ArtPiece", { width: 2, height: 2 }, scene);
  baseMesh.inUse = false;

  setSlotMesh(scene, baseMesh);
}

export function CreateSlot(slot, light, containingMeshes, scene, shadowGenerator) {
  const {
    dimensions: slotDimensions,
    position: slotPos,
    bounds: slotBounds,
    rotation: slotRot,
    id
  } = slot;

  const baseMesh = getSlotMesh();

  let artSlot = null;

  if (baseMesh.inUse) {
    artSlot = baseMesh.clone("artSlot", null, true, true);
  } else {
    artSlot = baseMesh;
    baseMesh.inUse = true;
  }

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