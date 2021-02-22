import "@babel/polyfill";
import SetupEngine from "./Gallery/engine";
import SetupGallery from "./Gallery/gallery";
import { SetupPlayer } from "./Gallery/gameplay";
import { JoinOrCreateRoom } from "./Gallery/gameRoom";
import { SetupHUD } from "./Gallery/hud";
import SetupLobby from "./Gallery/lobby";
import { getGalleryScene, getLobbyScene, setScene } from "./Model/state";
import { ChangeScene } from "./Utility/sceneChanger";

// Basic form validation check, stop default behaviour.
const forms = document.getElementsByTagName("form");

Array.prototype.forEach.call(forms, form => {
  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!event.target.checkValidity()) {
      event.stopPropagation();

      event.target.classList.add("was-validated");
    }
  })
})

const result = document.getElementById("canvas");

SetupEngine(result);

SetupGallery();
SetupLobby();
SetupHUD();

ChangeScene(getGalleryScene());
JoinOrCreateRoom();
