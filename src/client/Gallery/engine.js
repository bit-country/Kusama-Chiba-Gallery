import { Engine, GlowLayer, Scene } from "@babylonjs/core";
import { SetShowNavigator, SetShowNFTDetails } from "./hud";
import {
  getPieces,
  getCamera,
  setEngine,
  setScene,
  setActivePiece,
  getActivePiece,
} from "../Model/state";

export default function SetupEngine(canvasElement) {
  const engine = new Engine(canvasElement);

  const scene = new Scene(engine);
  scene.gravity.y = -0.15;

  const glowLayer = new GlowLayer("GlowLayer", scene, { blurKernelSize: 64 });
  glowLayer.intensity = 1;

  function gameTick() {
    const pieces = getPieces();
    const camera = getCamera();

    const activePiece = getActivePiece();

    if (camera.position.x > 8 && camera.position.y < 3 && camera.position.z > -2 && camera.position.z < 2) {
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
        camera.position.x < slotPos.x - slotDimensions.width / 2 - slotBounds ||
        camera.position.x > slotPos.x + slotDimensions.width / 2 + slotBounds ||
        camera.position.z < slotPos.z - slotDimensions.depth / 2 - slotBounds ||
        camera.position.z > slotPos.z + slotDimensions.depth / 2 + slotBounds
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
        camera.position.x > slotPos.x - slotDimensions.width / 2 - slotBounds &&
        camera.position.x < slotPos.x + slotDimensions.width / 2 + slotBounds &&
        camera.position.z > slotPos.z - slotDimensions.depth / 2 - slotBounds &&
        camera.position.z < slotPos.z + slotDimensions.depth / 2 + slotBounds
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
