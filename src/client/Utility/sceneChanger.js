import { SetupPlayer } from "../Gallery/gameplay";
import { setScene } from "../Model/state";

export function ChangeScene(scene) {
  setScene(scene);
  SetupPlayer();
}