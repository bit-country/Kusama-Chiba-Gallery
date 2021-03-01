import { getEngine, getGameRoom } from "../Model/state";
import { PLAYER_CHAT } from "../../common/MessageTypes";

export const ChatSetup = () => {
  const chatInput = document.querySelector("#chatInput");

  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      getGameRoom().send(PLAYER_CHAT, { content: e.target.value });
      e.target.value = "";

      getEngine().getInputElement().requestPointerLock();
      getEngine().getInputElement().focus();
    }
  });
};
