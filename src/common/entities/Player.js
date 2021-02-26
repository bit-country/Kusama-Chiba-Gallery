import { getScene, getContainer, setPlayer } from "../../client/Model/state.js";
import { SceneLoader, Vector3, AssetContainer } from "@babylonjs/core";

export default class Player {
  constructor(player) {
    const { name, x, y, z, sessionId, character } = player;

    this.name = name;
    this.character = character;
    this.isSelfPlayer = false;
    this.id = sessionId;

    const scene = getScene();

    SceneLoader.ImportMeshAsync(
      null,
      `./graphics/character/${character === "male-player" ? "boy" : "girl"}.glb`,
      null,
      scene
    ).then(({ meshes, animationGroups }) => {
      let player = meshes[0];

      player.position = new Vector3(x, y, z);
      player.ellipsoidOffset = new Vector3(0, 1, 0);
      player.checkCollisions = true;
      player.rotation = new Vector3(0, -1.57079, 0);

      player.moveWithCollisions(scene.gravity);

      animationGroups.map((x) => (this[x.name] = x));

      this.mesh = player;

      setPlayer(this);
    });
  }
}
