import {
  Engine,
  GlowLayer,
  Scene,
  Vector3,
  ArcRotateCamera,
} from "@babylonjs/core";
import { SetShowNFTDetails } from "./hud";
import {
  getPieces,
  getCamera,
  setEngine,
  setScene,
  setActivePiece,
  getActivePiece,
  setCamera,
} from "./state";

export default function SetupEngine(canvasElement) {
  const engine = new Engine(canvasElement);

  const scene = new Scene(engine);
  scene.gravity.y = -0.15;

  const glowLayer = new GlowLayer("GlowLayer", scene, { blurKernelSize: 64 });
  glowLayer.intensity = 1;
  var camera = new ArcRotateCamera(
    "playerCamera",
    Math.PI / -2,
    Math.PI / 2,
    5,
    new Vector3(0, 1, 0),
    scene
  );
  setCamera(camera);
  function gameTick() {
    const pieces = getPieces();
    const camera = getCamera();

    const activePiece = getActivePiece();

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

  engine.runRenderLoop(() => {
    scene.render();
  });

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
  // var camera = new ArcRotateCamera(
  //   "playerCamera",
  //   Math.PI / -2,
  //   Math.PI / 2,
  //   5,
  //   new Vector3(0, 1, 0),
  //   scene
  // );
  // scene.activeCamera = camera;
  // scene.activeCamera.attachControl(document.getElementById("canvas"), true);
  // camera.lowerRadiusLimit = 5;
  // camera.upperRadiusLimit = 10;
  // camera.wheelDeltaPercentage = 0.01;
  // camera.ellipsoid = new Vector3(0.25, 0.5, 0.25);
  // camera.applyGravity = true;
  // camera.checkCollisions = true;
  // camera._needMoveForGravity = true; // Enable gravity calculation continuously. Sleeps without movement if false.
  // camera.speed = 0.3;

  // setCamera(camera);
  return {
    engine,
    scene,
  };
}
