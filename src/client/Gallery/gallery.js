import {
  Color3, 
  GlowLayer,
  HemisphericLight,
  PointerEventTypes, 
  Scene, 
  SceneLoader, 
  Vector3,
} from "@babylonjs/core";
import { SetShowNavigator, SetShowNFTDetails, showActivePiece } from "./hud";
import { 
  getPieces, 
  getEngine, 
  getActivePiece, 
  setActivePiece, 
  setLobbyScene, 
  setActiveNavigator, 
  setLobbyMesh, 
  getLocalPlayer 
} from "../Model/state";

// Set up the gallery scenes and their associated word logic.
export default function SetupGallery() {
  const engine = getEngine();

  const scene = new Scene(engine);
  scene.gravity.y = -0.15;
  scene.hoverCursor = "none";

  scene.onPointerObservable.add(() => {
    const pickInfo = scene.pick(
      engine.getInputElement().width / 2, 
      engine.getInputElement().height / 2);

    const player = getLocalPlayer();

    if (pickInfo.pickedMesh && pickInfo.pickedMesh.isArt && 
      Vector3.Distance(player.position, pickInfo.pickedMesh.position) < 10) {
      SetShowNFTDetails(true);
      setActivePiece(pickInfo.pickedMesh.ArtDetails);
    } else {
      SetShowNFTDetails(false);
      setActivePiece(null);
    }
  }, PointerEventTypes.POINTERMOVE);

  scene.onPointerObservable.add(() => {
    const piece = getActivePiece();

    if (piece) {
      showActivePiece();
    }
  }, PointerEventTypes.POINTERUP);

  const glowLayer = new GlowLayer("GlowLayer", scene, { blurKernelSize: 64 });
  glowLayer.intensity = 1;

  function gameTick() {
    const player = getLocalPlayer();

    if (!player) {
      return;
    }

    if (player.position.x > 8 &&
      player.position.y < 3 &&
      player.position.z > -2 && 
      player.position.z < 2) {
      SetShowNavigator(true);
      setActiveNavigator(true);
    } else {
      SetShowNavigator(false);
      setActiveNavigator(false);
    }
  }

  scene.beforeRender = gameTick;
  setLobbyScene(scene);
  
  const light = new HemisphericLight("Skylight", new Vector3(0, 1, 0), scene);
  light.diffuse = new Color3(0.6, 0.5, 0.6);
  
  SceneLoader.ImportMesh("", "/assets/Gallery.obj", "", scene, mesh => {
    for (let submesh of mesh) {
      // Be careful not to exceed max GL vertex buffers
      submesh.material.maxSimultaneousLights = 10;
      submesh.checkCollisions = true;
      submesh.receiveShadows = true;
    }

    setLobbyMesh(mesh);
  });
}
