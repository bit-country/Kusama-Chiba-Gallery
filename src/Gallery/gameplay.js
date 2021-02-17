import {
  Color3,
  MeshBuilder,
  PointerEventTypes,
  StandardMaterial,
  Texture,
  UniversalCamera, 
  Vector3
} from "@babylonjs/core"
import { getGround, getScene, setCamera } from "../Model/state";

export function SetupPlayer(canvasElement) {
  const scene = getScene();

  const camera = new UniversalCamera("Player", new Vector3(0, 2, 0), scene);
  camera.ellipsoid = new Vector3(0.25, 0.5, 0.25);
  camera.attachControl(canvasElement, true);
  camera.applyGravity = true;
  camera.checkCollisions = true;
  camera._needMoveForGravity = true; // Enable gravity calculation continuously. Sleeps without movement if false.

  // Speed at which we move.
  camera.speed = 0.25;

  // Input constants
  const UP_ARROW = 38, W_KEY = 87;
  const RIGHT_ARROW = 39, D_KEY = 68;
  const LEFT_ARROW = 37, A_KEY = 65;
  const DOWN_ARROW = 40, S_KEY = 83;
  const SPACE_KEY = 32, CONTROL_KEY = 17;
  const SHIFT_KEY = 16, ALT_KEY = 18;

  // Binding for movement.
  camera.inputs.attached.keyboard.keysUp = [UP_ARROW, W_KEY];
  camera.inputs.attached.keyboard.keysDown = [DOWN_ARROW, S_KEY];
  camera.inputs.attached.keyboard.keysLeft = [LEFT_ARROW, A_KEY];
  camera.inputs.attached.keyboard.keysRight = [RIGHT_ARROW, D_KEY];
  camera.inputs.attached.keyboard.keysUpward = [];
  camera.inputs.attached.keyboard.keysDownward = [];

  // scene.onPointerObservable.add((pointerInfo) => {
  //   if (pointerInfo.type == PointerEventTypes.POINTERDOWN) {
  //     const result = scene.pick(scene.pointerX, scene.pointerY);

  //     console.log(result)
      
  //     const decal = MeshBuilder.CreateDecal("Seam", result.pickedMesh, { 
  //       position: result.pickedPoint, 
  //       size: new Vector3(1, 1, 1),
  //       normal: result.getNormal(true)
  //     }, scene);

  //     decal.material = new StandardMaterial("DecalMat", scene);
  //     decal.material.diffuseTexture = new Texture("/assets/Decal.png", scene);
  //     decal.material.zOffset = -2;
  //     decal.material.emissiveTexture = new Texture("/assets/Decal-Emissive2.png", scene);
  //     decal.material.emissiveColor = new Color3(0.2, 0.2, 0.2);
  //   }
  // })

  setCamera(camera);
}