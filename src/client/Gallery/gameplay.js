import {
  ArcRotateCamera,
  Vector3,
  SceneLoader,
  HemisphericLight,
  Color3,
  ActionManager,
  ExecuteCodeAction,
  PointerEventTypes,
} from "@babylonjs/core";
import { getGameRoom, getScene, setCamera, setPlayer } from "../Model/state";
import "@babylonjs/loaders/glTF";
import { PLAYER_MOVE, PLAYER_STOP } from "../../common/MessageTypes";

let meshSpeed = 0.1;
let meshSpeedBackwards = 0.1;
let meshRotationSpeed = 0.1;

export function SetupPlayer() {
  const scene = getScene();

  var camera = new ArcRotateCamera(
    "playerCamera",
    Math.PI / -2,
    Math.PI / 2,
    5,
    new Vector3(0, 1, 0),
    scene
  );

  scene.activeCamera = camera;
  scene.activeCamera.attachControl(document.getElementById("canvas"), true);
  camera.lowerRadiusLimit = 5;
  camera.upperRadiusLimit = 10;
  camera.wheelDeltaPercentage = 0.01;
  camera.ellipsoid = new Vector3(0.25, 0.5, 0.25);
  camera.applyGravity = true;
  camera.checkCollisions = true;
  camera.speed = 0.3;

  // Speed at which we move.

  // Input constants
  const UP_ARROW = 38,
    W_KEY = 87;
  const RIGHT_ARROW = 39,
    D_KEY = 68;
  const LEFT_ARROW = 37,
    A_KEY = 65;
  const DOWN_ARROW = 40,
    S_KEY = 83;
  const SPACE_KEY = 32,
    CONTROL_KEY = 17;
  const SHIFT_KEY = 16,
    ALT_KEY = 18;

  // Keyboard events
  var inputMap = {};

  scene.actionManager = new ActionManager(scene);

  scene.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    })
  );

  scene.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    })
  );

  // Binding for movement.
  // camera.inputs.attached.keyboard.keysUp = [UP_ARROW, W_KEY];
  // camera.inputs.attached.keyboard.keysDown = [DOWN_ARROW, S_KEY];
  // camera.inputs.attached.keyboard.keysLeft = [LEFT_ARROW, A_KEY];
  // camera.inputs.attached.keyboard.keysRight = [RIGHT_ARROW, D_KEY];
  // camera.inputs.attached.keyboard.keysUpward = [];
  // camera.inputs.attached.keyboard.keysDownward = [];

  SceneLoader.ImportMeshAsync(
    null,
    `./graphics/character/HVGirl.glb`,
    null,
    scene
  ).then(({ meshes, animationGroups }) => {
    let mesh = meshes[0];
    setPlayer(mesh);

    mesh.scaling.scaleInPlace(0.05);
    var animating = true;
    mesh.ellipsoidOffset = new Vector3(0, 1, 0);
    camera.target = mesh;
    const walkAnim = scene.getAnimationGroupByName("Walking");
    //  const walkBackAnim = scene.getAnimationGroupByName("WalkingBack");
    const idleAnim = scene.getAnimationGroupByName("Idle");
    const sambaAnim = scene.getAnimationGroupByName("Samba");
    //Rendering loop (executed for everyframe)
    scene.onBeforeRenderObservable.add(() => {
      var keydown = false;

      mesh.moveWithCollisions(scene.gravity);

      //Manage the movements of the character (e.g. position, direction)
      if (inputMap["w"]) {
        mesh.moveWithCollisions(mesh.forward.scaleInPlace(meshSpeed));
        keydown = true;
      }
      // if (inputMap["s"]) {
      //   mesh.moveWithCollisions(mesh.forward.scaleInPlace(-meshSpeedBackwards));
      //   keydown = true;
      // }
      if (inputMap["a"]) {
        mesh.rotate(Vector3.Up(), -meshRotationSpeed);
        keydown = true;
      }
      if (inputMap["d"]) {
        mesh.rotate(Vector3.Up(), meshRotationSpeed);
        keydown = true;
      }
      if (inputMap["t"]) {
        keydown = true;
      }

      //Manage animations to be played
      if (keydown) {
        getGameRoom().send(PLAYER_MOVE, {
          position: mesh.position,
          rotation: {
            left: inputMap["a"],
            right: inputMap["d"],
          },
        });

        if (!animating) {
          animating = true;
          // if (inputMap["s"]) {
          //   //Walk backwards
          //   walkBackAnim.start(
          //     true,
          //     1.0,
          //     walkBackAnim.from,
          //     walkBackAnim.to,
          //     false
          //   );
          // } else
          if (inputMap["t"]) {
            //Samba!
            sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
          } else {
            //Walk
            walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
          }
        }
      } else {
        getGameRoom().send(PLAYER_STOP);
        if (animating) {
          //Default animation is idle when no key is down
          idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);

          //Stop all animations besides Idle Anim when no key is down
          sambaAnim.stop();
          walkAnim.stop();
          // walkBackAnim.stop();

          //Ensure animation are played only once per rendering loop
          animating = false;
        }
      }
    });
  });

  scene.onPointerObservable.add((pointerInfo) => {
    if (pointerInfo.type == PointerEventTypes.POINTERDOWN) {
      const result = scene.pick(scene.pointerX, scene.pointerY);

      console.log(result.pickedPoint);
      console.log(result.getNormal(true));
    }
  });

  setCamera(camera);
}
