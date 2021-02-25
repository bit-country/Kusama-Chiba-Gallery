import { getScene, setPlayer } from "../../client/Model/state.js";
import { SceneLoader, Vector3 } from "@babylonjs/core";

export default class Player {
  constructor(player) {
    const { name, x, y, z, sessionId } = player;

    this.name = name;
    this.isSelfPlayer = false;
    this.id = sessionId;

    const scene = getScene();

    SceneLoader.ImportMeshAsync(
      null,
      //  `./graphics/character/characters_f.obj`,
      `./graphics/character/HVGirl.glb`,
      null,
      scene
    ).then(({ meshes, animationGroups }) => {
      let player = meshes[0];
      // player.forEach((mesh, i) => {
      //   meshes[i + 1] = mesh;
      // });
      // meshes[1].parent = meshes[0];
      // meshes[2].parent = meshes[1];
      // meshes[3].parent = meshes[2];
      // meshes[4].parent = meshes[3];
      // player.scaling.scaleInPlace(0.1);
      // player.position = new Vector3(3, y, 3);
      player.scaling.scaleInPlace(0.05);
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
