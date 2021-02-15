import {
  UniversalCamera, 
  Vector3
} from "@babylonjs/core"
import { getScene, setCamera } from "./state";

export function SetupPlayer(canvasElement) {
  // const scene = getScene();

  // const camera = new UniversalCamera("Player", new Vector3(0, 2, 0), scene);
  // camera.ellipsoid = new Vector3(0.25, 0.5, 0.25);
  // camera.attachControl(canvasElement, true);
  // camera.applyGravity = true;
  // camera.checkCollisions = true;
  // camera._needMoveForGravity = true; // Enable gravity calculation continuously. Sleeps without movement if false.

  // // Speed at which we move.
  // camera.speed = 0.25;

  // // Input constants
  // const UP_ARROW = 38, W_KEY = 87;
  // const RIGHT_ARROW = 39, D_KEY = 68;
  // const LEFT_ARROW = 37, A_KEY = 65;
  // const DOWN_ARROW = 40, S_KEY = 83;
  // const SPACE_KEY = 32, CONTROL_KEY = 17;
  // const SHIFT_KEY = 16, ALT_KEY = 18;

  // // Binding for movement.
  // camera.inputs.attached.keyboard.keysUp = [UP_ARROW, W_KEY];
  // camera.inputs.attached.keyboard.keysDown = [DOWN_ARROW, S_KEY];
  // camera.inputs.attached.keyboard.keysLeft = [LEFT_ARROW, A_KEY];
  // camera.inputs.attached.keyboard.keysRight = [RIGHT_ARROW, D_KEY];
  // camera.inputs.attached.keyboard.keysUpward = [];
  // camera.inputs.attached.keyboard.keysDownward = [];

  // setCamera(camera);
}