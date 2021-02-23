import {
  ActionManager,
  Color3,
  ExecuteCodeAction,
  MeshBuilder, 
  PredicateCondition, 
  StandardMaterial, 
  Vector3
} from "@babylonjs/core";
import { CreateLight } from "./lightCreator";
import { addPiecePosition, getActivePiece, getBuildingMeshes, getLocalPlayer } from "../Model/state";
import {
  SetDetailsOverVisibility
} from "../Gallery/hud";

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

  const newManager = new ActionManager(scene);
  newManager.hoverCursor = "none";
  newManager
    .registerAction(
      new ExecuteCodeAction(
        ActionManager.OnPickTrigger,
        event => {
          SetDetailsOverVisibility(true);
        },
        new PredicateCondition(
          newManager,
          () => 
            Vector3.Distance(getLocalPlayer().position, artSlot.position) < 4
            && getActivePiece()
        )
      )
    );

  artSlot.actionManager = newManager;


  if (shadowGenerator) {
    shadowGenerator.addShadowCaster(artSlot);
  }
  
  const artLight = CreateLight(slotDimensions, light, artSlot, containingMeshes, scene);
  artLight.includedOnlyMeshes.push(artSlot);

  if (containingMeshes) {
    artLight.includedOnlyMeshes.push(...containingMeshes);
  }

  return {
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
}