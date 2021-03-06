import {
  AssetsManager,
  Color3, 
  GlowLayer,
  HemisphericLight,
  PointerEventTypes, 
  Scene, 
  SceneLoader, 
  Vector3,
} from "@babylonjs/core";
import { SetShowNavigator, SetShowNFTDetails, showActivePiece, ShowNavigator } from "./hud";
import { 
  getEngine, 
  getActivePiece, 
  setActivePiece,
  setActiveNavigator, 
  setLobbyMesh, 
  getLocalPlayer, 
  getActiveNavigator,
  setGalleryScene
} from "../Model/state";
import { SetupSlotMesh } from "../Utility/slotCreator";
import SetupCharacterLoadTasks from "./preloader";

// Set up the gallery scenes and their associated word logic.
export default function SetupGallery() {
  return new Promise((resolve, reject) => {
    const engine = getEngine();

    const scene = new Scene(engine);
    scene.gravity.y = -0.15;
    scene.hoverCursor = "none";

    const light = new HemisphericLight("Skylight", new Vector3(0, 1, 0), scene);
    light.diffuse = new Color3(0.2, 0.2, 0.4);

    const glowLayer = new GlowLayer("GlowLayer", scene, { blurKernelSize: 64 });
    glowLayer.intensity = 1;

    scene.onPointerObservable.add(() => {
      const pickInfo = scene.pick(
        engine.getInputElement().width / 2, 
        engine.getInputElement().height / 2);

      const player = getLocalPlayer();

      if (!player) {
        return;
      }

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

    setGalleryScene(scene);
    
    SetupSlotMesh(scene);

    // We're happy to allow the caller to continue here.
    resolve();
    
    const assetManager = new AssetsManager(scene);

    const loaded = SetupCharacterLoadTasks(scene, assetManager);
    
    const buildingTask = assetManager.addMeshTask("LobbyBuilding", "", "", "./assets/Gallery4.gltf");
    buildingTask.onSuccess = task => {
      const {
        loadedMeshes: mesh
      } = task;

      for (let submesh of mesh) {
        if (submesh.name.includes("primitive6")) { // 6 is door as of gallery4
          submesh.isDoor = true;
        }

        // Be careful not to exceed max GL vertex buffers
        if (submesh.material) {
          submesh.material.maxSimultaneousLights = 10;
          submesh.material.freeze();
        }

        submesh.checkCollisions = true;
        submesh.receiveShadows = true;
        submesh.freezeWorldMatrix();
      }

      setLobbyMesh(mesh);
    };

    loaded.then(resolve);

    assetManager.load();
  });
}
