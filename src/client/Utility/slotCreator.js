import {
  Color3,
  MeshBuilder, 
  StandardMaterial,
  Vector3} from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle, TextBlock } from "@babylonjs/gui";
import { getScene, getSlotMesh, setSlotMesh } from "../Model/state";
import { CreateLight } from "./lightCreator";

export function SetupSlotMesh(scene) {
  const baseMesh = MeshBuilder.CreatePlane("ArtPiece", { width: 2, height: 2 }, scene);
  baseMesh.position = new Vector3(1000, 1000, 1000);

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

  if (baseMesh.ArtDetails) {
    artSlot = baseMesh.clone("artSlot", null, true, true);
  } else {
    artSlot = baseMesh;
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

  var plane = MeshBuilder.CreatePlane("plane", { width: 2, height: 1 }, scene);
  plane.parent = artSlot;
  plane.position.y = -1.4;
  plane.position.z = -0.1;

  var advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);

  var container = new Rectangle();
  container.cornerRadius = 20;
  container.color = "white";
  container.thickness = 0;
  container.background = "#00000066";
  container.adaptHeightToChildren = true;
  container.adaptWidthToChildren = true;

  var label = new TextBlock();
  label.text = "Loading...";
  label.fontSize = "68px";
  label.resizeToFit = true;
  label.paddingTopInPixels = 
    label.paddingBottomInPixels =
    label.paddingLeftInPixels =
    label.paddingRightInPixels = 10;

  container.addControl(label);

  advancedTexture.addControl(container);

  artSlot.ArtDetails = {
    id,
    position: slotPos,
    dimensions: slotDimensions,
    bounds: slotBounds,
    slotMesh: artSlot,
    slotMaterial: artSlot.material,
    slotLight: artLight,
    slotLabelMesh: plane,
    slotLabel: label,
    art: null,
    artist: "",
    owner: "",
    name: "",
    emissive: slot.emissive,
  };

  return artSlot.ArtDetails;
}