import { getScene, getContainer, setPlayer } from "../../client/Model/state.js";
import { SceneLoader, Vector3, AssetContainer } from "@babylonjs/core";

export default class Player {
  constructor(player) {
    const { username, x, y, z, sessionId } = player;
    this.username = username;
    this.x = x;
    this.y = y;
    this.z = z;
    this.isSelfPlayer = false;
    this.id = sessionId;

    SceneLoader.ImportMeshAsync(
      null,
      `./graphics/character/HVGirl.glb`,
      null,
      getScene()
    ).then(({ meshes, animationGroups }) => {
      debugger;
      this.animationGroups = animationGroups;
      const container = getContainer();
      meshes[0].scaling.scaleInPlace(0.05);
      let cloned = meshes[0].clone(sessionId);
      cloned.position = new Vector3(x, y, z);
      cloned.name = sessionId;
      container.meshes.push(cloned);
      const ttt = container.meshes.find((x) => x === cloned);
      debugger;
      this.mesh = cloned;
      //   const walkAnim = getScene().getAnimationGroupByName("Walking");
      this.playerSessionId = sessionId;
      // getScene().beginAnimation(cloned, walkAnim.from, walkAnim.to, false);
      //   getScene().beginAnimation(cloned2, walkAnim.from, walkAnim.to, false);
      container.addAllToScene();
      setPlayer(this);
      //  walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
    });
  }
}
