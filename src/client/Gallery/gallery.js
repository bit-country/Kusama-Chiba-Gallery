import {
  AssetContainer,
  Color3, 
  DirectionalLight,
  GlowLayer,
  HemisphericLight,
  Mesh,
  MeshBuilder, 
  PointLight, 
  Scene, 
  SceneLoader, 
  ShadowGenerator,
  StandardMaterial,
  Texture,
  Vector3,
  Vector4
} from "@babylonjs/core";
import SetupEngine from "./engine";
import { SetupPlayer } from "./gameplay";
import { SetShowNavigator, SetShowNFTDetails, SetupHUD } from "./hud";
import Light from "../Model/Light";
import Slot from "../Model/Slot";
import { CreateSlot } from "../Utility/slotCreator";
import { getPieces, getScene, setBuildingMeshes, getBuildingMeshes, getSections, getEngine, getActivePiece, getCamera, setActivePiece, setScene, setLobbyScene, addPiecePosition, setActiveNavigator, setLobbyMesh, setContainer } from "../Model/state";
import API from "../Integration/API";
import * as LOADERS from "@babylonjs/loaders";
import { JoinOrCreateRoom } from "./gameRoom";
import { FLOOR, WING } from "../constants";

export default function SetupGallery() {
  const engine = getEngine();

  const scene = new Scene(engine);
  scene.gravity.y = -0.15;

  const container = new AssetContainer(scene);
  setContainer(scene, container);

  const glowLayer = new GlowLayer("GlowLayer", scene, { blurKernelSize: 64 });
  glowLayer.intensity = 1;

  function gameTick() {
    const pieces = getPieces();
    const camera = getCamera();

    const activePiece = getActivePiece();

    if (camera.target.x > 8 &&
      camera.target.y < 3 &&
      camera.target.z > -2 && 
      camera.target.z < 2) {
      SetShowNavigator(true);
      setActiveNavigator(true);
    } else {
      SetShowNavigator(false);
      setActiveNavigator(false);
    }

    if (activePiece) {
      const {
        position: slotPos,
        dimensions: slotDimensions,
        bounds: slotBounds,
      } = activePiece;

      if (
        camera.target.x < slotPos.x - slotDimensions.width / 2 - slotBounds ||
        camera.target.x > slotPos.x + slotDimensions.width / 2 + slotBounds ||
        camera.target.z < slotPos.z - slotDimensions.depth / 2 - slotBounds ||
        camera.target.z > slotPos.z + slotDimensions.depth / 2 + slotBounds
      ) {
        SetShowNFTDetails(false);
        setActivePiece(null);
      }
    }

    for (let piece of pieces) {
      const {
        position: slotPos,
        dimensions: slotDimensions,
        bounds: slotBounds,
      } = piece;

      // TODO update to use player, or consider using picking instead.
      if (
        camera.target.x > slotPos.x - slotDimensions.width / 2 - slotBounds &&
        camera.target.x < slotPos.x + slotDimensions.width / 2 + slotBounds &&
        camera.target.z > slotPos.z - slotDimensions.depth / 2 - slotBounds &&
        camera.target.z < slotPos.z + slotDimensions.depth / 2 + slotBounds
      ) {
        SetShowNFTDetails(true);
        setActivePiece(piece);
      }
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
