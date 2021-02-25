import {
  Color3, 
  GlowLayer,
  HemisphericLight,
  PointerEventTypes, 
  Scene, 
  SceneLoader, 
  Texture, 
  Vector3,
} from "@babylonjs/core";
import { SetShowNavigator, SetShowNFTDetails, showActivePiece, ShowNavigator } from "./hud";
import { 
  getPieces, 
  getEngine, 
  getActivePiece, 
  setActivePiece, 
  setLobbyScene, 
  setActiveNavigator, 
  setLobbyMesh, 
  getLocalPlayer, 
  getActiveNavigator
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

    if (pickInfo.pickedMesh) {
      if (pickInfo.pickedMesh.isArt && Vector3.Distance(player.position, pickInfo.pickedMesh.position) < 10) {
        SetShowNFTDetails(true);
        setActivePiece(pickInfo.pickedMesh.ArtDetails);
      } else if (pickInfo.pickedMesh.isDoor && Vector3.Distance(player.position, pickInfo.pickedPoint) < 10) {
        SetShowNavigator(true);
        setActiveNavigator(true);
      } else {
        SetShowNFTDetails(false);
        setActivePiece(null);
        SetShowNavigator(false);
        setActiveNavigator(false);
      }   
    } else {
      SetShowNFTDetails(false);
      setActivePiece(null);
      SetShowNavigator(false);
      setActiveNavigator(false);
    }
  }, PointerEventTypes.POINTERMOVE);

  scene.onPointerObservable.add(() => {
    const piece = getActivePiece();
    const navigator = getActiveNavigator();

    if (piece) {
      showActivePiece();
    } else if (navigator) {
      ShowNavigator();
    }
  }, PointerEventTypes.POINTERUP);

  const glowLayer = new GlowLayer("GlowLayer", scene, { blurKernelSize: 64 });
  glowLayer.intensity = 1;

  setLobbyScene(scene);
  
  const light = new HemisphericLight("Skylight", new Vector3(0, 1, 0), scene);
  light.diffuse = new Color3(0.2, 0.2, 0.4);
  
  SceneLoader.ImportMesh("", "/assets/Gallery3.gltf", "", scene, mesh => {
    for (let submesh of mesh) {
      if (submesh.name.includes("primitive5")) { // 5 is door as of gallery3
        submesh.isDoor = true;
      }

      // Be careful not to exceed max GL vertex buffers
      if (submesh.material) {
        submesh.material.maxSimultaneousLights = 10;
      }

      submesh.checkCollisions = true;
      submesh.receiveShadows = true;
    }

    setLobbyMesh(mesh);
  });
}
