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
  getGalleryScene,
  getGameRoom,
  getLobbyScene,
  getLocalPlayer,
  getPlayerStruct,
  getScene,
  getSelectedCharacter,
  setCamera,
  setLocalPlayer,
  setPlayerStruct,
} from "../Model/state";
import { PLAYER_MOVE, PLAYER_STOP } from "../../common/MessageTypes";
import { pointerInput } from "./cameraInputManager";

// Configuration values
let meshSpeed = 6;
let meshSpeedBackwards = 6;
let meshRotationSpeed = 6;

export const cameraOffset = new Vector3(0.25, 0.9, -1.5);

// Keyboard events
let inputMap = {};


// Important to cleanup all of the meshes and animations
// ensures that characters stay animated and we don't end up
// with "detached" characters (no client input associated)
let pointerInputBinding = null,
beforeRenderObservable = null;
export function characterCleanup() {
  const scene = getScene();

  scene.onPointerObservable.removeCallback(pointerInputBinding);
  scene.onBeforeRenderObservable.removeCallback(beforeRenderObservable);

  getPlayerStruct(scene, getSelectedCharacter() == "male-player" ? "boy" : "girl").container.removeAllFromScene();
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

  const playerStruct = getPlayerStruct(scene, character == "male-player" ? "boy" : "girl");

  playerStruct.container.addAllToScene();
  
  setLocalPlayer(playerStruct.mesh);
  const mesh = playerStruct.mesh;
  
  camera.position = new Vector3(cameraOffset.x, 0, cameraOffset.z);
  camera.rotation = new Vector3(0, 0, 0);
  
  // Reset positioning and rotation for parenting.
  camera.parent.position = new Vector3(0, cameraOffset.y, 0);
  camera.parent.rotation = new Vector3(0, 0, 0);
  camera.parent.parent = mesh;

  mesh.position = spawnPosition;
  mesh.rotation = spawnRotation;

  const idleAnim = playerStruct.animations.find(anim => anim.name == "Idle");
  const walkAnim = playerStruct.animations.find(anim => anim.name == "WalkingForward");
  const walkBackAnim = playerStruct.animations.find(anim => anim.name == "WalkingBackward");

  var animating = true;

  // Bind in our pointer input, handles camera and player rotation.
  pointerInputBinding = pointerInput.bind(null, engine, camera); // Allow us to cleanup when we change rooms.
  scene.onPointerObservable.add(
    pointerInputBinding,
    PointerEventTypes.POINTERDOWN |
      PointerEventTypes.POINTERUP |
      PointerEventTypes.POINTERMOVE
  );

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
    if (inputMap["w"] || inputMap["ArrowUp"]) {
      mesh.moveWithCollisions(mesh.forward.scaleInPlace(meshSpeed * delta));
      keydown = true;
    }

    if (inputMap["s"]|| inputMap["ArrowDown"]) {
      mesh.moveWithCollisions(
        mesh.forward.scaleInPlace(-(meshSpeedBackwards * delta))
      );
      keydown = true;
    }

    if (inputMap["a"]|| inputMap["ArrowLeft"]) {
      mesh.moveWithCollisions(mesh.right.scaleInPlace(-(meshSpeed * delta)));
      keydown = true;
    }
    
    if (inputMap["d"]|| inputMap["ArrowRight"]) {
      mesh.moveWithCollisions(mesh.right.scaleInPlace(meshSpeed * delta));
      keydown = true;
    }

    if (inputMap["Enter"]) {
      const chatInput = document.querySelector("#chatInput");
      document.exitPointerLock();
      inputMap["Enter"] = false;

      chatInput.focus();
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
};

// Set up the player, and input.
// Follow singleton method for camera and local player.
export function SetupPlayerCamera() {
  const scene = getScene();
  let camera = getCamera();

  if (!camera) {
    camera = new UniversalCamera("playerCamera", new Vector3(0, 0, 0), scene);

    camera.ellipsoid = new Vector3(0.25, 0.5, 0.25);
    camera.checkCollisions = true;

    // Set up camera arm to make it easier to reason about rotations for mouse movement.
    const cameraMesh = new Mesh("cameraArm", scene);
    cameraMesh.position = new Vector3(-14, 4, 0);
    cameraMesh.rotation = new Vector3(0, 1.57079, 0);

    camera.parent = cameraMesh;
  }

  scene.activeCamera = camera;
  scene.activeCamera.detachControl(document.getElementById("canvas"));

  setCamera(camera);
}
