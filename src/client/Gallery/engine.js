import { Engine, GlowLayer, Scene, AssetContainer } from "@babylonjs/core";
import { SetShowNavigator, SetShowNFTDetails } from "./hud";
import {
  getPieces,
  getCamera,
  setEngine,
  setScene,
  setActivePiece,
  getActivePiece,
  getPlayer,
  setContainer,
} from "../Model/state";

export default function SetupEngine(canvasElement) {
  const engine = new Engine(canvasElement);

  const scene = new Scene(engine);
  scene.gravity.y = -0.15;
  const container = new AssetContainer(scene);
  setContainer(container);
  const glowLayer = new GlowLayer("GlowLayer", scene, { blurKernelSize: 64 });
  glowLayer.intensity = 1;

  function gameTick() {
    const pieces = getPieces();
    const camera = getCamera();

    const activePiece = getActivePiece();

    if (
      camera.target.x > 8 &&
      camera.target.y < 3 &&
      camera.target.z > -2 &&
      camera.target.z < 2
    ) {
      SetShowNavigator(true);
    } else {
      SetShowNavigator(false);
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

  const resizeHandler = () => {
    const {
      width,
      height,
    } = canvasElement.parentElement.getBoundingClientRect();

    canvasElement.width = width;
    canvasElement.height = height;

    engine.resize();
  };

  window.addEventListener("resize", resizeHandler);
  resizeHandler();

  setEngine(engine);
  setScene(scene);

  return {
    engine,
    scene,
  };
}
