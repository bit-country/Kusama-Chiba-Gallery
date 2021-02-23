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
  setPlayer 
} from "../Model/state";
import { PLAYER_MOVE, PLAYER_STOP } from "../../common/MessageTypes";
import { pointerInput } from "./inputManager";

let meshSpeed = 0.1;
let meshSpeedBackwards = 0.1;
let meshRotationSpeed = 0.1;

const cameraOffset = new Vector3(5, 24, -30);

export const importCharacter = () => {
  // Keyboard events
  var inputMap = {};
  

  const engine = getEngine();
  const scene = getScene();
  const camera = getCamera();

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

  SceneLoader.ImportMeshAsync(
    null,
    `./graphics/character/HVGirl.glb`,
    null,
    scene
  ).then(({ meshes }) => {
    let mesh = meshes[0];
    setLocalPlayer(mesh);
    setPlayer(mesh);

    mesh.position = new Vector3(-14, 3.1, 0);
    mesh.scaling.scaleInPlace(0.05);
    mesh.scaling.x *= -1;
    mesh.rotation = new Vector3(0, -1.57079, 0);
    mesh.ellipsoidOffset = new Vector3(0, 1, 0);
    
    var animating = true;

    // Set up camera arm to make it easier to reasonable rotations for mouse movement.
    const cameraMesh = new Mesh("cameraArm", scene, mesh);
    cameraMesh.position.y = cameraOffset.y;
    camera.position = new Vector3(cameraOffset.x, 0, cameraOffset.z);
    camera.rotation = new Vector3(0, 0, 0);
    camera.parent = cameraMesh;

    // Bind in our pointer input, handles camera and player rotation.
    scene.onPointerObservable.add(pointerInput.bind(null, engine, camera), PointerEventTypes.POINTERDOWN | PointerEventTypes.POINTERUP | PointerEventTypes.POINTERMOVE);
    
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

      if (inputMap["s"]) {
        mesh.moveWithCollisions(mesh.forward.scaleInPlace(-meshSpeedBackwards));
        keydown = true;
      }

      if (inputMap["a"]) {
        mesh.moveWithCollisions(mesh.right.scaleInPlace(-meshSpeed));
        keydown = true;
      }

      if (inputMap["d"]) {
        mesh.moveWithCollisions(mesh.right.scaleInPlace(meshSpeed));
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
        getGameRoom()?.send(PLAYER_STOP);
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
};

// Set up the player, and input.
// Follow singleton method for camera and local player.
export function SetupPlayer() {
  const scene = getScene();
  let camera = getCamera();

  if (!camera) {
    camera = new UniversalCamera(
      "playerCamera",
      new Vector3(-14, 4, 0),
      scene
    );

    camera.rotation = new Vector3(0, 1.57079, 0);
  
    camera.ellipsoid = new Vector3(0.25, 0.5, 0.25);
    camera.checkCollisions = true;
  }

  scene.activeCamera = camera;
  scene.activeCamera.detachControl(document.getElementById("canvas"));

  setCamera(camera);
}
