import { getScene } from "../../client/Model/state.js";
import { SceneLoader, Vector3 } from "@babylonjs/core";

export default class Player {
  constructor(player) {
    const { username, x, y, z, sessionId } = player;
    this.username = username;
    this.x = x;
    this.y = y;
    this.z = z;
    SceneLoader.ImportMeshAsync(
      null,
      `./graphics/character/HVGirl.glb`,
      null,
      getScene()
    ).then(({ meshes }) => {
      let mesh = meshes[0];
      mesh.scaling.scaleInPlace(0.05);
      mesh.position = new Vector3(x, y, z);
      mesh.name = sessionId;
      this.mesh = mesh;
      this.playerSessionId = sessionId;
    });
  }
}
