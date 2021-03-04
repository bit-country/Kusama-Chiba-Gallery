import { AssetContainer, AssetsManager, Mesh, SceneLoader, Vector3 } from "@babylonjs/core";
import { getGalleryScene, getLobbyScene, setPlayerStruct } from "../Model/state";
import { cameraOffset } from "./gameplay";

export default function SetupCharacterLoadTasks(scene, assetManager) {
  return new Promise(resolve => {
    Promise.all([
      new Promise(resolve => {
        const boyTask = assetManager.addMeshTask("boy", "", "", "./assets/character/boy.glb");
        boyTask.onSuccess = task => {
          const {
            loadedMeshes: meshes,
            loadedAnimationGroups: animationGroups
          } = task;
      
          const container = new AssetContainer(scene);
      
          container.meshes = meshes;
          container.animationGroups = animationGroups;
      
          let mesh = meshes[0];
          
          mesh.scaling.scaleInPlace(1.5);
          mesh.scaling.x *= -1;
          mesh.ellipsoidOffset = new Vector3(0, 1, 0);
          
          setPlayerStruct(scene, "boy", { mesh, animations: animationGroups, container });
      
          container.removeAllFromScene();

          resolve();
        };
      }),
      new Promise(resolve => {
        const girlTask = assetManager.addMeshTask("boy", "", "", "./assets/character/girl.glb");
        girlTask.onSuccess = task => {
          const {
            loadedMeshes: meshes,
            loadedAnimationGroups: animationGroups
          } = task;
      
          const container = new AssetContainer(scene);
      
          container.meshes = meshes;
          container.animationGroups = animationGroups;
      
          let mesh = meshes[0];
          
          mesh.scaling.scaleInPlace(1.5);
          mesh.scaling.x *= -1;
          mesh.ellipsoidOffset = new Vector3(0, 1, 0);
          
          setPlayerStruct(scene, "girl", { mesh, animations: animationGroups, container });
      
          container.removeAllFromScene();

          resolve();
        };
      })
    ]).then(resolve);
  });
}
