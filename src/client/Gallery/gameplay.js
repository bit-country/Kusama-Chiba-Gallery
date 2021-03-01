import {
  Vector3,
  SceneLoader,
  ActionManager,
  ExecuteCodeAction,
  PointerEventTypes,
  UniversalCamera,
  Mesh,
} from "@babylonjs/core";
import {
  getCamera,
  getEngine,
  getGameRoom,
  getLocalPlayer,
  getScene,
  setCamera,
  setLocalPlayer,
} from "../Model/state";
import { PLAYER_MOVE, PLAYER_STOP } from "../../common/MessageTypes";
import { pointerInput } from "./inputManager";

let meshSpeed = 6;
let meshSpeedBackwards = 6;
let meshRotationSpeed = 6;

const cameraOffset = new Vector3(0, 1, -5);

// Keyboard events
let inputMap = {};
let pointerInputBinding = null,
  beforeRenderObservable = null;

export function characterCleanup() {
  const scene = getScene();
  const player = getLocalPlayer();

  scene.onPointerObservable.remove(pointerInputBinding);
  scene.onBeforeRenderObservable.remove(beforeRenderObservable);
  scene.removeMesh(player, true);
  for (let animationGroup of scene.animationGroups) {
    scene.removeAnimationGroup(animationGroup);
  }

  player.dispose();

  setLocalPlayer(null);
}

export const importCharacter = (character, spawnPosition, spawnRotation) => {
  const engine = getEngine();
  const scene = getScene();
  const camera = getCamera();

  if (!scene.actionManager) {
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
  }
  let selectedCharacter = document.querySelector("#selectedCharacter");

  SceneLoader.ImportMeshAsync(
    null,
    `./graphics/character/${
      selectedCharacter.textContent === "male-player" ? "boy" : "girl"
    }.glb`,
    null,
    scene
  ).then(({ meshes }) => {
    let mesh = meshes[0];
    setLocalPlayer(mesh);
    //setPlayer(mesh);

    mesh.position = spawnPosition;
    //mesh.scaling.scaleInPlace(0.05);
    mesh.scaling.x *= -1;
    mesh.rotation = spawnRotation;
    mesh.ellipsoidOffset = new Vector3(0, 1, 0);

    var animating = true;

    // Set up camera arm to make it easier to reasonable rotations for mouse movement.
    const cameraMesh = new Mesh("cameraArm", scene, mesh);
    cameraMesh.position.y = cameraOffset.y;
    camera.position = new Vector3(cameraOffset.x, 0, cameraOffset.z);
    camera.rotation = new Vector3(0, 0, 0);
    camera.parent = cameraMesh;

    // Bind in our pointer input, handles camera and player rotation.
    pointerInputBinding = pointerInput.bind(null, engine, camera); // Allow us to cleanup when we change rooms.
    scene.onPointerObservable.add(
      pointerInputBinding,
      PointerEventTypes.POINTERDOWN |
        PointerEventTypes.POINTERUP |
        PointerEventTypes.POINTERMOVE
    );

    const walkAnim = scene.getAnimationGroupByName("WalkingForward");
    const walkBackAnim = scene.getAnimationGroupByName("WalkingBackward");
    const idleAnim = scene.getAnimationGroupByName("Idle");
    //const sambaAnim = scene.getAnimationGroupByName("Samba");

    //Rendering loop (executed for everyframe)
    beforeRenderObservable = () => {
      var keydown = false;

      const delta = engine.getDeltaTime() / 1000;

      mesh.moveWithCollisions(
        new Vector3(
          scene.gravity.x * (delta * 16.667),
          scene.gravity.y * (delta * 16.667),
          scene.gravity.z * (delta * 16.667)
        )
      );

      //Manage the movements of the character (e.g. position, direction)
      if (inputMap["w"]) {
        mesh.moveWithCollisions(mesh.forward.scaleInPlace(meshSpeed * delta));
        keydown = true;
      }

      if (inputMap["s"]) {
        mesh.moveWithCollisions(
          mesh.forward.scaleInPlace(-(meshSpeedBackwards * delta))
        );
        keydown = true;
      }

      if (inputMap["a"]) {
        mesh.moveWithCollisions(mesh.right.scaleInPlace(-(meshSpeed * delta)));
        keydown = true;
      }

      if (inputMap["d"]) {
        mesh.moveWithCollisions(mesh.right.scaleInPlace(meshSpeed * delta));
        keydown = true;
      }

      // Dance
      if (inputMap["t"]) {
        keydown = true;
      }

      //Manage animations to be played
      if (keydown) {
        getGameRoom()?.send(PLAYER_MOVE, {
          position: mesh.position,
          rotation: mesh.rotation,
          direction: inputMap["w"] ? "WalkingForward" : "WalkingBackward",
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
            // sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
          } else {
            //Walk
            walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
          }
        }
      } else {
        if (animating) {
          getGameRoom()?.send(PLAYER_STOP);

          //Default animation is idle when no key is down
          idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);

          //Stop all animations besides Idle Anim when no key is down
          // sambaAnim.stop();
          walkAnim.stop();
          walkBackAnim.stop();

          //Ensure animation are played only once per rendering loop
          animating = false;
        }
      }
    };
    scene.onBeforeRenderObservable.add(beforeRenderObservable);
  });
};

// Set up the player, and input.
// Follow singleton method for camera and local player.
export function SetupPlayer() {
  const scene = getScene();
  let camera = getCamera();

  if (!camera) {
    camera = new UniversalCamera("playerCamera", new Vector3(-14, 4, 0), scene);

    camera.rotation = new Vector3(0, 1.57079, 0);

    camera.ellipsoid = new Vector3(0.25, 0.5, 0.25);
    camera.checkCollisions = true;
  }

  scene.activeCamera = camera;
  scene.activeCamera.detachControl(document.getElementById("canvas"));

  setCamera(camera);
}
