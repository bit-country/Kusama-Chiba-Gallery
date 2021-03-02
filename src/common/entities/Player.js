import { getScene, setPlayer } from "../../client/Model/state.js";
import { SceneLoader, Vector3, MeshBuilder } from "@babylonjs/core";
import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
} from "@babylonjs/gui";

const showUsername = (mesh, username) => {
  var container = new Rectangle();
  container.height = 0.15;
  container.width = 0.6;
  container.cornerRadius = 20;
  container.color = "white";
  container.thickness = 0;
  container.background = "#00000066";

  var plane = MeshBuilder.CreatePlane("plane", {}, getScene());
  plane.parent = mesh;
  plane.position.y = 1;

  var advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);

  var label = new TextBlock();
  label.text = username ?? "Guest";
  label.fontSize = "68px";
  container.addControl(label);

  advancedTexture.addControl(container);
};

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
      `./assets/character/${character === "male-player" ? "boy" : "girl"}.glb`,
      null,
      scene
    ).then(({ meshes, animationGroups }) => {
      let player = meshes[0];
      showUsername(player, this.name);
      player.position = new Vector3(x, y, z);
      player.scaling.scaleInPlace(1.5);
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
