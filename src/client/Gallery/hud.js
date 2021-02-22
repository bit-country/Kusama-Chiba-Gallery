import { Texture, VideoTexture } from "@babylonjs/core";
import API from "../Integration/API";
import { getActivePiece, getGalleryScene, getLobbyScene, getScene, setScene } from "../Model/state";
import { ChangeScene } from "../Utility/sceneChanger";

export function SetShowNFTDetails(visible) {
  const NFTDetailsIcon = document.querySelector("#root .hud .nft-details-item");

  if (visible) {
    NFTDetailsIcon.classList.remove("hidden");
  } else {
    NFTDetailsIcon.classList.add("hidden");
  }
}

export function SetShowNavigator(visible) {
  const navigatorIcon = document.querySelector("#root .hud .navigator-item");

  if (visible) {
    navigatorIcon.classList.remove("hidden");  
  } else {
    navigatorIcon.classList.add("hidden");
  }
}

export function SetupHUD() {
  // Menu section
  const menu = document.querySelector("#root .hud .menu");
  const menuOverlay = document.querySelector("#root .hud .menu-overlay");

  menu.onclick = () => {
    menuOverlay.classList.toggle("hidden");
  }


  // Login section
  const loginMenuItem = document.querySelector("#root .hud .menu-overlay #login-menu-item");
  const loginTopItem = document.querySelector("#root .hud .login-item");
  const loginOverlay = document.querySelector("#root .hud .login-overlay");
  const loginButton = document.querySelector("#root .hud .login-overlay button[name='login']");
  const loginCancelButton = document.querySelector("#root .hud .login-overlay button[name='cancel']");

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


  // Register section
  const registerMenuItem = document.querySelector("#root .hud .menu-overlay #register-menu-item");
  const registerOverlay = document.querySelector("#root .hud .register-overlay");
  const registerButton = document.querySelector("#root .hud .register-overlay button[name='register']");
  const registerCancelButton = document.querySelector("#root .hud .register-overlay button[name='cancel']");

  registerMenuItem.onclick = () => {
    registerOverlay.classList.toggle("hidden");
    menuOverlay.classList.toggle("hidden");
  }

  registerCancelButton.onclick = () => {
    registerOverlay.classList.toggle("hidden");
  }


  // Mint section
  const mintMenuItem = document.querySelector("#root .hud .menu-overlay #mint-menu-item");
  const mintOverlay = document.querySelector("#root .hud .mint-overlay");
  const mintButton = document.querySelector("#root .hud .mint-overlay button[name='mint']");
  const mintCancelButton = document.querySelector("#root .hud .mint-overlay button[name='cancel']");

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
    const ownerName = "Example";
    const artistName = "Yourself";
    const pieceNameInput = document.querySelector("#root .hud > .mint-overlay input[name='name']");

    if (!pieceNameInput || pieceNameInput.value.length < 1) {
      return;
    }

    if (imageInput.files.length < 1) {
      return;
    }

    const uploadedMedia = URL.createObjectURL(imageInput.files[0]);
    if (imageInput.files[0].type.includes("image")) {
      piece.slotMaterial.diffuseTexture = new Texture(uploadedMedia, getScene());
      
      if (piece.emissive) {
        piece.slotMaterial.emissiveTexture = new Texture(uploadedMedia, getScene());
        piece.slotMaterial.emissiveColor = new Color3(1, 1, 1);
      }
    } else if (imageInput.files[0].type.includes("video")) {
      piece.slotMaterial.diffuseTexture = new VideoTexture("VideoPiece", uploadedMedia, getScene());

      if (piece.emissive) {
        piece.slotMaterial.emissiveTexture = new VideoTexture("VideoPiece", uploadedMedia, getScene());
        piece.slotMaterial.emissiveColor = new Color3(1, 1, 1);
      }
    }

    piece.art = uploadedMedia;
    piece.name = pieceNameInput.value;
    piece.artist = artistName;
    piece.owner = ownerName;

    mintOverlay.classList.toggle("hidden");
  }

  mintCancelButton.onclick = () => {
    mintOverlay.classList.toggle("hidden");
  }


  // Details section
  const detailsOverlay = document.querySelector("#root .hud .details-overlay");
  const detailsImg = document.querySelector("#root .hud .details-overlay img.nft-image");
  const detailsOwner = document.querySelector("#root .hud .details-overlay .ui.list .item[name='owner'] span.value");
  const detailsArtist = document.querySelector("#root .hud .details-overlay .ui.list .item[name='artist'] span.value");
  const detailsName = document.querySelector("#root .hud .details-overlay .ui.list .item[name='name'] span.value");
  const detailsCloseButton = document.querySelector("#root .hud .details-overlay button[name='close']");

  const setDetailsOverVisibility = visible => {
    if (visible) {
      detailsOverlay.classList.remove("hidden");

      const piece = getActivePiece();

      // TODO Allow for videos?
      detailsImg.src = piece.art;
      detailsArtist.textContent = piece.artist;
      detailsOwner.textContent = piece.owner;
      detailsName.textContent = piece.name;
    } else {
      detailsOverlay.classList.add("hidden");
    }
  }

  detailsCloseButton.onclick = () => {
    detailsOverlay.classList.toggle("hidden");
  }


  const navigatorOverlay = document.querySelector("#root .hud .navigator-overlay");
  const galleriesContainer = document.querySelector("#root .hud #galleries-container");
  const navigatorCloseButton = document.querySelector("#root .hud .navigator-overlay button[name='close']");

  navigatorCloseButton.onclick = () => {
    navigatorOverlay.classList.add("hidden");
  }

  // Keybinding listener - handles opening menus on interaction
  function keylistener(event) {
    const piece = getActivePiece();
    const navigatorIsHidden = navigatorOverlay.classList.contains("hidden");

    if (event.key == "e") {
      if (navigatorIsHidden) {
        navigatorOverlay.classList.remove("hidden");

        API.getCollections().then(collections => {
          let child;
          while (child = galleriesContainer.firstChild) {
            galleriesContainer.removeChild(child);
          }

          if (!collections || collections.length < 1) {
            return;
          }

          for (let collection of collections) {
            const itemContainer = document.createElement("div");
            itemContainer.className = "item p-1 col-xl-3 col-lg-4 col-md-6 col-12";

            const item = document.createElement("div");
            item.className = "card h-100";
            itemContainer.appendChild(item);

            const itemImage = document.createElement("img");
            itemImage.className = "card-img-top";
            itemImage.src = collection.image;
            item.appendChild(itemImage);

            const itemBody = document.createElement("div");
            itemBody.className = "card-body";
            item.appendChild(itemBody);

            const itemTitle = document.createElement("div");
            itemTitle.className = "card-title";
            itemTitle.textContent = collection.name;
            itemBody.appendChild(itemTitle);

            const itemText = document.createElement("div");
            itemText.className = "card-text";
            itemText.textContent = collection.description;
            itemBody.appendChild(itemText);

            const itemButton = document.createElement("button");
            itemButton.className = "btn btn-outline-primary";
            itemButton.textContent = "View ";
            itemButton.onclick = () => {
              // TODO navigate to gallery
            }

            const itemButtonIcon = document.createElement("i");
            itemButtonIcon.className = "bi bi-arrow-right-circle";
            itemButton.appendChild(itemButtonIcon)

            item.appendChild(itemButton);

            galleriesContainer.appendChild(itemContainer);
          }
        });  
      } else if (piece && piece.art && detailsOverlay.classList.contains("hidden")) {
        setDetailsOverVisibility(true);
      } else if (piece && mintOverlay.classList.contains("hidden")) {
        mintOverlay.classList.remove("hidden");
      }
    }

    if (event.key == "l") {
      ChangeScene(getLobbyScene());
    }

    if (event.key == "k") {
      ChangeScene(getGalleryScene());
    }
  }

  window.addEventListener("keypress", keylistener);
}