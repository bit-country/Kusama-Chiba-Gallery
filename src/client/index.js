import "@babel/polyfill";
import SetupEngine from "./Gallery/engine";
import SetupLobby from "./Gallery/lobby";
import { SetupPlayer } from "./Gallery/gameplay";
import { SetupHUD } from "./Gallery/hud";
import SetupGallery from "./Gallery/gallery";
import { getGalleryScene, getLobbyScene, setScene } from "./Model/state";
import { ChangeScene } from "./Utility/sceneChanger";
import { EnterRoom } from "./Gallery/room";

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

SetupLobby();
SetupGallery();
SetupHUD();

ChangeScene(getGalleryScene());
EnterRoom("lobby", "Daniel");
