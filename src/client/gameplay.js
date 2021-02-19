import {
  ArcRotateCamera,
  Vector3,
  SceneLoader,
  HemisphericLight,
  Color3,
  ActionManager,
  ExecuteCodeAction,
} from "@babylonjs/core";
import { getCamera, getGameRoom, getScene, setCamera } from "./state";
import "@babylonjs/loaders/glTF";
import { PLAYER_MOVEMENT } from "../common/MessageTypes";

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
  camera._needMoveForGravity = true; // Enable gravity calculation continuously. Sleeps without movement if false.
  camera.speed = 0.3;
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
  var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
  light.intensity = 0.6;
  light.specular = Color3.Black();
  // Binding for movement.
  SceneLoader.ImportMeshAsync(
    null,
    `./graphics/character/HVGirl.glb`,
    null,
    scene
  ).then(({ meshes }) => {
    let mesh = meshes[0];
    mesh.scaling.scaleInPlace(0.05);
    var animating = true;

    getCamera().target = mesh;
    const walkAnim = scene.getAnimationGroupByName("Walking");
    const walkBackAnim = scene.getAnimationGroupByName("WalkingBack");
    const idleAnim = scene.getAnimationGroupByName("Idle");
    const sambaAnim = scene.getAnimationGroupByName("Samba");

    //Rendering loop (executed for everyframe)
    scene.onBeforeRenderObservable.add(() => {
      var keydown = false;
      //Manage the movements of the character (e.g. position, direction)
      if (inputMap["w"]) {
        mesh.moveWithCollisions(mesh.forward.scaleInPlace(meshSpeed));
        keydown = true;
      }
      if (inputMap["s"]) {
        mesh.moveWithCollisions(mesh.forward.scaleInPlace(-meshSpeedBackwards));
        keydown = true;
      }
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
        console.log(mesh.rotation);
        getGameRoom().send(PLAYER_MOVEMENT, {
          position: mesh.position,
          rotation: {
            left: inputMap["a"],
            right: inputMap["d"],
            // forward: inputMap["w"],
            // backward: inputMap["s"],
          },
        });

        if (!animating) {
          animating = true;
          if (inputMap["s"]) {
            //Walk backwards
            walkBackAnim.start(
              true,
              1.0,
              walkBackAnim.from,
              walkBackAnim.to,
              false
            );
          } else if (inputMap["t"]) {
            //Samba!
            sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
          } else {
            //Walk
            walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
          }
        }
      } else {
        if (animating) {
          //Default animation is idle when no key is down
          idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);

          //Stop all animations besides Idle Anim when no key is down
          sambaAnim.stop();
          walkAnim.stop();
          walkBackAnim.stop();

          //Ensure animation are played only once per rendering loop
          animating = false;
        }
      }
    });
  });
  setCamera(camera);
}
