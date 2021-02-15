import * as BABYLON from "@babylonjs/core";
//import 'babylonjs-materials'
import { setCamera } from "../state";
class BABYLONRenderer {
  constructor(engine, scene) {
    this.engine = engine;
    this.engine.enableOfflineSupport = false;
    this.scene = scene;
    this.scene.collisionsEnabled = true;
    this.scene.detachControl(); // we're doing our own camera!

    this.camera = new BABYLON.TargetCamera(
      "camera",
      new BABYLON.Vector3(1, 2, 0),
      this.scene
    );
    // this.camera.fov = 1.0;
    // this.camera.minZ = 0.1;
    setCamera(this.camera);
    // const light = new BABYLON.HemisphericLight(
    //   "h",
    //   new BABYLON.Vector3(0, 1, 0.5),
    //   this.scene
    // );
    // light.intensity = 1.0;

    // const plane = BABYLON.MeshBuilder.CreatePlane(
    //   "ground",
    //   { size: 30 },
    //   this.scene
    // );
    // // plane.rotation.x = Math.PI * 0.5;
    // plane.position.y = -1;

    this.scene.executeWhenReady(() => {
      console.log("SCENE READY");
    });

    // needed for certain shaders, though none in this simple demo
    // this.engine.runRenderLoop(() => {});
  }

  // drawHitscan(message, color) {
  //   // shows a red ray for a few frames.. should maybe make a tube or something more visible
  //   const { sourceId, x, y, z, tx, ty, tz } = message;
  //   const rayhelper = new BABYLON.RayHelper(
  //     new BABYLON.Ray(
  //       new BABYLON.Vector3(x, y, z),
  //       new BABYLON.Vector3(tx, ty, tz)
  //     )
  //   );

  //   rayhelper.show(this.scene, color);

  //   setTimeout(() => {
  //     rayhelper.dispose();
  //   }, 128);
  // }

  update(delta) {
    this.scene.render();
  }
}

export default BABYLONRenderer;
