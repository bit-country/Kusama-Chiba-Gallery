import { getGameRoom, getScene } from "../../client/state.js";
import {
  SceneLoader,
  Vector3,
  AssetsManager,
  ArcRotateCamera,
  ActionManager,
  ExecuteCodeAction,
  HemisphericLight,
  AnimationGroup,
  ShadowGenerator,
  DirectionalLight,
} from "@babylonjs/core";
import { PLAYER_MOVEMENT } from "../MessageTypes.js";
let meshSpeed = 0.1;
let meshSpeedBackwards = 0.1;
let meshRotationSpeed = 0.1;
export default class Player {
  constructor(player, currentSessionId) {
    this.camera = null;
    const scene = getScene();
    const { name, x, y, z, sessionId } = player;
    this.username = name;
    this.x = x;
    this.y = y;
    this.z = z;
    var inputMap = {};
    if (currentSessionId === player.sessionId) {
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
      this.camera = camera;

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

    var light = new DirectionalLight("dir01", new Vector3(-1, -2, -1), scene);
    light.position = new Vector3(20, 40, 20);
    light.intensity = 1.0;
    var shadowGenerator = new ShadowGenerator(1024, light);
    // Assets manager
    // var assetsManager = new AssetsManager(scene);

    // var meshTask = assetsManager.addMeshTask(
    //   "dragon task",
    //   "",
    //   "",
    //   "./graphics/character/HVGirl.glb"
    // );
    // const addNewDragon = function (mesh, x) {
    //   var newInstance = mesh.clone();
    //   newInstance.position = new Vector3(x, 0, 0);
    // };

    // meshTask.onSuccess = function (task) {
    //   const mesh = task.loadedMeshes[0];
    //   var newInstance = mesh.clone();
    //   newInstance.position = new Vector3(1, 2, 1);
    //   newInstance.rotation = new Vector3(2.5,3,10);
    //   camera.target = newInstance;
    //   addNewDragon(mesh, 0);
    //   addNewDragon(mesh, -10);
    //   addNewDragon(mesh, 10);

    //   mesh.setEnabled(false);
    // };

    // assetsManager.onTaskError = function (task) {
    //   console.log("error while loading " + task.name);
    // };

    // assetsManager.onFinish = function (tasks) {
    //   engine.runRenderLoop(function () {
    //     scene.render();
    //   });
    // };
    // assetsManager.load();

    const s = SceneLoader.ImportMesh(
      null,
      `./graphics/character/HVGirl.glb`,
      null,
      scene,
      (meshes, a, skeletons) => {
        debugger;
        let player = meshes[0];
        let animating = true;
        player.scaling.scaleInPlace(0.05);
        // player.position = new Vector3(x, y, z);
        player.position = new Vector3(4, 0, 1);

        player.name = sessionId;
        this.playerMesh = player;
        this.playerSessionId = sessionId;

        let player2 = player.clone("player2");
        player2.position = new Vector3(1, 7, 1);
        player2.skeleton = skeletons[0].clone("clonedSkeleton");

        // shadowGenerator.getShadowMap().renderList.push(mesh);
        //this.camera.target = mesh;
        scene.render();
        // if (currentSessionId === player.sessionId) {
        //   this.camera.target = mesh;

        //   const walkAnim = scene.getAnimationGroupByName("Walking");
        //   const walkBackAnim = scene.getAnimationGroupByName("WalkingBack");
        //   const idleAnim = scene.getAnimationGroupByName("Idle");
        //   const sambaAnim = scene.getAnimationGroupByName("Samba");

        //   // window.animationGroup1 = animationGroup1;
        //   //Rendering loop (executed for everyframe)
        //   scene.onBeforeRenderObservable.add(() => {
        //     var keydown = false;
        //     //Manage the movements of the character (e.g. position, direction)
        //     if (inputMap["w"]) {
        //       mesh.moveWithCollisions(mesh.forward.scaleInPlace(meshSpeed));
        //       keydown = true;
        //     }
        //     if (inputMap["s"]) {
        //       mesh.moveWithCollisions(
        //         mesh.forward.scaleInPlace(-meshSpeedBackwards)
        //       );
        //       keydown = true;
        //     }
        //     if (inputMap["a"]) {
        //       mesh.rotate(Vector3.Up(), -meshRotationSpeed);
        //       keydown = true;
        //     }
        //     if (inputMap["d"]) {
        //       mesh.rotate(Vector3.Up(), meshRotationSpeed);
        //       keydown = true;
        //     }
        //     if (inputMap["t"]) {
        //       keydown = true;
        //     }

        //     //Manage animations to be played
        //     if (keydown) {
        //       console.log(mesh.rotation);

        //       getGameRoom().send(PLAYER_MOVEMENT, {
        //         position: mesh.position,
        //         rotation: {
        //           left: inputMap["a"],
        //           right: inputMap["d"],
        //           // forward: inputMap["w"],
        //           // backward: inputMap["s"],
        //         },
        //       });

        //       if (!animating) {
        //         animating = true;
        //         if (inputMap["s"]) {
        //           //Walk backwards
        //           walkBackAnim.start(
        //             true,
        //             1.0,
        //             walkBackAnim.from,
        //             walkBackAnim.to,
        //             false
        //           );
        //         } else if (inputMap["t"]) {
        //           //Samba!
        //           sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
        //         } else {
        //           //Walk
        //           walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
        //         }
        //       }
        //     } else {
        //       if (animating) {
        //         //Default animation is idle when no key is down
        //         idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);

        //         //Stop all animations besides Idle Anim when no key is down
        //         sambaAnim.stop();
        //         walkAnim.stop();
        //         walkBackAnim.stop();

        //         //Ensure animation are played only once per rendering loop
        //         animating = false;
        //       }
        //     }
        //   });
        // }
      },
      null,
      (err) => {
        debugger;
      }
    );
    s.loadAsync();
  }
}
