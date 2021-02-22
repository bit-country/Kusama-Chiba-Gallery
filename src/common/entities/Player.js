import { getScene, getContainer, setPlayer } from "../../client/Model/state.js";
import { SceneLoader, Vector3, AssetContainer } from "@babylonjs/core";

export default class Player {
  constructor(player) {
    const { username, x, y, z, sessionId } = player;
    this.username = username;
    this.isSelfPlayer = false;
    this.id = sessionId;
    const scene = getScene();
    SceneLoader.ImportMeshAsync(
      null,
      `./graphics/character/HVGirl.glb`,
      null,
      scene
    ).then(({ meshes, animationGroups }) => {
      let player = meshes[0];
      player.ellipsoidOffset = new Vector3(0, 1, 0);
      player.moveWithCollisions(scene.gravity);
      player.checkCollisions = true;
      animationGroups.map((x) => (this[x.name] = x));
      player.scaling.scaleInPlace(0.05);
      player.position = new Vector3(x, y, z);
      this.mesh = player;
      setPlayer(this);
    });
  }
}
