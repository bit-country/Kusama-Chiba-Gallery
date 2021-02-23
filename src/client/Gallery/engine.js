import { Engine } from "@babylonjs/core";
import {
  getScene,
  setEngine,
} from "../Model/state";

// Set up engine, resizing and render loop.
export default function SetupEngine(canvasElement) {
  const engine = new Engine(canvasElement);

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
