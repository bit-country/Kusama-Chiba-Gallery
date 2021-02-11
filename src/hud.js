import { Texture } from "@babylonjs/core";
import { getActivePiece, getScene } from "./state";

export function SetShowNFTDetails(visible) {
  const NFTDetailsIcon = document.querySelector("#root .hud .nft-details-item");

  if (visible) {
    NFTDetailsIcon.classList.remove("hidden");
  } else {
    NFTDetailsIcon.classList.add("hidden");
  }
}

export function SetupHUD() {
  const menu = document.querySelector("#root .hud .menu");
  const menuOverlay = document.querySelector("#root .hud .menu-overlay");

  menu.onclick = () => {
    menuOverlay.classList.toggle("hidden");
  }

  const loginMenuItem = document.querySelector("#root .hud .menu-overlay #login-menu-item");
  const loginTopItem = document.querySelector("#root .hud .login-item");
  const loginOverlay = document.querySelector("#root .hud .login-overlay");
  const loginButton = document.querySelector("#root .hud .login-overlay button[name='login']");
  const loginCancelButton = document.querySelector("#root .hud .login-overlay button[name='cancel']");

  const registerMenuItem = document.querySelector("#root .hud .menu-overlay #register-menu-item");
  const registerOverlay = document.querySelector("#root .hud .register-overlay");
  const registerButton = document.querySelector("#root .hud .register-overlay button[name='register']");
  const registerCancelButton = document.querySelector("#root .hud .register-overlay button[name='cancel']");

  const mintMenuItem = document.querySelector("#root .hud .menu-overlay #mint-menu-item");
  const mintOverlay = document.querySelector("#root .hud .mint-overlay");
  const mintButton = document.querySelector("#root .hud .mint-overlay button[name='mint']");
  const mintCancelButton = document.querySelector("#root .hud .mint-overlay button[name='cancel']");

  const detailsOverlay = document.querySelector("#root .hud .details-overlay");
  const detailsCloseButton = document.querySelector("#root .hud .details-overlay button[name='close']");

  loginMenuItem.onclick = () => {
    loginOverlay.classList.toggle("hidden");
    menuOverlay.classList.toggle("hidden");
  }
  loginTopItem.onclick = () => {
    loginOverlay.classList.toggle("hidden");
    menuOverlay.classList.add("hidden");
  }

  loginCancelButton.onclick = () => {
    loginOverlay.classList.toggle("hidden");
  }

  registerMenuItem.onclick = () => {
    registerOverlay.classList.toggle("hidden");
    menuOverlay.classList.toggle("hidden");
  }

  registerCancelButton.onclick = () => {
    registerOverlay.classList.toggle("hidden");
  }

  mintMenuItem.onclick = () => {
    mintOverlay.classList.toggle("hidden");
    menuOverlay.classList.toggle("hidden");
  }

  mintButton.onclick = () => {
    const piece = getActivePiece();

    if (!piece) {
      return;
    }

    if (piece.art) {
      return;
    }

    const imageInput = document.querySelector("#root .hud > .mint-overlay input[name='image']");

    if (imageInput.files.length < 1) {
      return;
    }

    const uploadedImage = URL.createObjectURL(imageInput.files[0]);

    piece.art = uploadedImage;
    piece.slotMaterial.diffuseTexture = new Texture(uploadedImage, getScene());

    mintOverlay.classList.toggle("hidden");
  }

  mintCancelButton.onclick = () => {
    mintOverlay.classList.toggle("hidden");
  }

  function keylistener(event) {
    const piece = getActivePiece();
    
    if (event.key == "e" && piece) {
      if (piece.art && detailsOverlay.classList.contains("hidden")) {
        detailsOverlay.classList.remove("hidden");
      } else if (mintOverlay.classList.contains("hidden")) {
        mintOverlay.classList.remove("hidden");
      }
    }
  }

  window.addEventListener("keypress", keylistener);

  detailsCloseButton.onclick = () => {
    detailsOverlay.classList.toggle("hidden");
  }
}