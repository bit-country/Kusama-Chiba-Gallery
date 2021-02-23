import { Engine } from "@babylonjs/core";
import {
  getScene,
  setEngine,
} from "../Model/state";

let pointerDownHandler;

// Set up engine, resizing and render loop.
export default function SetupEngine(canvasElement) {
  const engine = new Engine(canvasElement);

  pointerDownHandler = () => {
    if (!engine.isFullscreen) {
      engine.enterFullscreen(true);
    }
  }
  
  canvasElement.addEventListener("pointerdown", pointerDownHandler);

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
