import { Engine } from "@babylonjs/core";
import {
  getEngine,
  getScene,
  setEngine,
} from "../Model/state";
import LoadingScreen from "./loadingScreen";

export function CapturePointer() {
  const engine = getEngine();

  engine.getInputElement().requestPointerLock();
  engine.getInputElement().focus();
}



// Set up engine, resizing and render loop.
export default function SetupEngine(canvasElement) {
  const engine = new Engine(canvasElement);

  engine.loadingScreen = new LoadingScreen();
  engine.displayLoadingUI();

  canvasElement.addEventListener("pointerdown", CapturePointer);

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

  engine.runRenderLoop(() => {
    getScene()?.render();
  });

  return engine;
}
