import { Texture, VideoTexture } from "@babylonjs/core";
import API from "../Integration/API";
import { getActiveNavigator, getActivePiece, getGalleryScene, getGameRoom, getLobbyScene, getScene, setScene, setSelectedCharacter, setUsername } from "../Model/state";
import { ChangeScene, GoToGallery, GoToLobby } from "../Utility/sceneChanger";
import * as GUI from "babylonjs-gui";
import { InitialSetup } from "./room";

const canvasElement = document.getElementById("canvas");


// Menu section
const menu = document.querySelector("#root .hud .menu");
const menuOverlay = document.querySelector("#root .hud .menu-overlay");

menu.onclick = () => {
  menuOverlay.classList.toggle("hidden");
};


// Login section
const loginMenuItem = document.querySelector("#root .hud .menu-overlay #login-menu-item");
const loginTopItem = document.querySelector("#root .hud .login-item");
const loginOverlay = document.querySelector("#root .hud .login-overlay");
const loginButton = document.querySelector("#root .hud .login-overlay button[name='login']");
const loginCancelButton = document.querySelector("#root .hud .login-overlay button[name='cancel']");

loginMenuItem.onclick = () => {
  loginOverlay.classList.toggle("hidden");
  menuOverlay.classList.toggle("hidden");
};
loginTopItem.onclick = () => {
  loginOverlay.classList.toggle("hidden");
  menuOverlay.classList.add("hidden");
};

loginCancelButton.onclick = () => {
  loginOverlay.classList.toggle("hidden");
  canvasElement.requestPointerLock();
  canvasElement.focus();
};


// Register section
const registerMenuItem = document.querySelector("#root .hud .menu-overlay #register-menu-item");
const registerOverlay = document.querySelector("#root .hud .register-overlay");
const registerButton = document.querySelector("#root .hud .register-overlay button[name='register']");
const registerCancelButton = document.querySelector("#root .hud .register-overlay button[name='cancel']");

registerMenuItem.onclick = () => {
  registerOverlay.classList.toggle("hidden");
  menuOverlay.classList.toggle("hidden");
};

registerCancelButton.onclick = () => {
  registerOverlay.classList.toggle("hidden");
  canvasElement.requestPointerLock();
  canvasElement.focus();
};


// Currently we have no API to use.
// // Mint section
// const mintMenuItem = document.querySelector("#root .hud .menu-overlay #mint-menu-item");
// const mintOverlay = document.querySelector("#root .hud .mint-overlay");
// const mintButton = document.querySelector("#root .hud .mint-overlay button[name='mint']");
// const mintCancelButton = document.querySelector("#root .hud .mint-overlay button[name='cancel']");

// mintMenuItem.onclick = () => {
//   mintOverlay.classList.toggle("hidden");
//   menuOverlay.classList.toggle("hidden");
// };

// mintButton.onclick = () => {
//   const piece = getActivePiece();
  
//   // Check that we are next to a piece.
//   if (!piece) {
//     return;
//   }

//   // If it already has an art piece, this isn't right
//   if (piece.art) {
//     return;
//   }

//   const imageInput = document.querySelector(
//     "#root .hud > .mint-overlay input[name='image']"
//   );
//   const ownerName = "Example";
//   const artistName = "Yourself";
//   const pieceNameInput = document.querySelector(
//     "#root .hud > .mint-overlay input[name='name']"
//   );

//   if (!pieceNameInput || pieceNameInput.value.length < 1) {
//     return;
//   }

//   if (imageInput.files.length < 1) {
//     return;
//   }

//   const uploadedMedia = URL.createObjectURL(imageInput.files[0]);
//   if (imageInput.files[0].type.includes("image")) {
//     piece.slotMaterial.diffuseTexture = new Texture(
//       uploadedMedia,
//       getScene()
//     );

//     if (piece.emissive) {
//       piece.slotMaterial.emissiveTexture = new Texture(
//         uploadedMedia,
//         getScene()
//       );
//       piece.slotMaterial.emissiveColor = new Color3(1, 1, 1);
//     }
//   } else if (imageInput.files[0].type.includes("video")) {
//     piece.slotMaterial.diffuseTexture = new VideoTexture(
//       "VideoPiece",
//       uploadedMedia,
//       getScene()
//     );

//     if (piece.emissive) {
//       piece.slotMaterial.emissiveTexture = new VideoTexture(
//         "VideoPiece",
//         uploadedMedia,
//         getScene()
//       );
//       piece.slotMaterial.emissiveColor = new Color3(1, 1, 1);
//     }
//   }

//   piece.art = uploadedMedia;
//   piece.name = pieceNameInput.value;
//   piece.artist = artistName;
//   piece.owner = ownerName;

//   mintOverlay.classList.toggle("hidden");
// };

// mintCancelButton.onclick = () => {
//   mintOverlay.classList.toggle("hidden");
//   canvasElement.requestPointerLock();
//   canvasElement.focus();
// };

// Details section
const detailsOverlay = document.querySelector("#root .hud .details-overlay");
const detailsImg = document.querySelector("#root .hud .details-overlay img.nft-image");
const detailsAddress = document.querySelector("#root .hud .details-overlay .content .list-group .item[name='address'] span.value");
const detailsName = document.querySelector("#root .hud .details-overlay .content .list-group .item[name='name'] span.value");
const detailsStandard = document.querySelector("#root .hud .details-overlay .content .list-group .item[name='standard'] span.value");
const detailsCollection = document.querySelector("#root .hud .details-overlay .content .list-group .item[name='collection'] span.value");
const detailsDescription = document.querySelector("#root .hud .details-overlay .content .list-group .item[name='description'] span.value");
const detailsCloseButton = document.querySelector("#root .hud .details-overlay button[name='close']");

// Shows the "eye" icon to indicate that you can view a piece
export function SetShowNFTDetails(visible) {
  const NFTDetailsIcon = document.querySelector("#root .hud .nft-details-item");

  if (visible) {
    NFTDetailsIcon.classList.remove("hidden");
  } else {
    NFTDetailsIcon.classList.add("hidden");
  }
}

export function SetDetailsOverVisibility(visible) {
  if (visible) {
    detailsOverlay.classList.remove("hidden");

    const piece = getActivePiece();

    // TODO Allow for videos?
    detailsImg.src = piece.art;
    detailsAddress.textContent = piece.address;
    detailsName.textContent = piece.name;
    detailsStandard.textContent = piece.standard;
    detailsCollection.textContent = piece.collectionName;
    detailsDescription.textContent = piece.description;
  } else {
    detailsOverlay.classList.add("hidden");
  }
}

detailsCloseButton.onclick = () => {
  detailsOverlay.classList.toggle("hidden");
  canvasElement.requestPointerLock();
  canvasElement.focus();
}

// Show the details modal
export function showActivePiece() {
  const piece = getActivePiece();

  if (!piece) {
    return;
  }

  document.exitPointerLock();

  if (piece.art && detailsOverlay.classList.contains("hidden")) {
    SetDetailsOverVisibility(true);
  } else if (mintOverlay.classList.contains("hidden")) {
    mintOverlay.classList.remove("hidden");
  }
}

// Navigator section
const navigatorOverlay = document.querySelector("#root .hud .navigator-overlay");
const galleriesContainer = document.querySelector("#root .hud #galleries-container");
const navigatorGoToLobbyButton = document.querySelector("#root .hud .navigator-overlay button#go-to-lobby")
const navigatorCloseButton = document.querySelector("#root .hud .navigator-overlay button[name='close']");

navigatorCloseButton.onclick = () => {
  navigatorOverlay.classList.add("hidden");
  canvasElement.requestPointerLock();
  canvasElement.focus();
}

navigatorGoToLobbyButton.onclick = () => {
  navigatorOverlay.classList.add("hidden");

  GoToLobby();

  canvasElement.requestPointerLock();
  canvasElement.focus();
}

// Shows the "door" icon to indicate that you can navigate to another area
export function SetShowNavigator(visible) {
  const navigatorIcon = document.querySelector("#root .hud .navigator-item");

  if (visible) {
    navigatorIcon.classList.remove("hidden");  
  } else {
    navigatorIcon.classList.add("hidden");
  }
}

// Show the navigator modal and setup content
export function ShowNavigator() {
  const navigator = getActiveNavigator();

  if (!navigator || !navigatorOverlay.classList.contains("hidden")) {
    return;
  }

  navigatorOverlay.classList.remove("hidden");

  document.exitPointerLock();

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
        GoToGallery(collection.id);

        navigatorOverlay.classList.add("hidden");
      }

      const itemButtonIcon = document.createElement("i");
      itemButtonIcon.className = "bi bi-arrow-right-circle";
      itemButton.appendChild(itemButtonIcon)

      item.appendChild(itemButton);

      galleriesContainer.appendChild(itemContainer);
    }
  });  
}

export function ShowTutorial() {
  const tutorial = document.querySelector("#root .hud .tutorial");

  tutorial.classList.remove("invisible", "fading");

  window.setTimeout(() => {
    tutorial.classList.add("fading");

    window.setTimeout(() => {
      tutorial.classList.add("invisible");
    }, 1000);
  }, 5000);
}

// Shows the initial entry setup HUD (username and character selection)
const initialSetupHUD = () => {
  const genderSelection = document.querySelectorAll(".genderSelection");
  const btnEnterGallery = document.querySelector("#btnEnterGallery");

  btnEnterGallery.addEventListener("click", function (event) {
    event.preventDefault();

    const iptUsername = document.querySelector("#iptUsername").value;

    let selectedCharacter = document.querySelector("#selectedCharacter")
      .innerHTML;
    
    const toHide = document.querySelector("#characterSelection");
    toHide.style.visibility = "hidden";

    InitialSetup(iptUsername, selectedCharacter);
    setUsername(iptUsername || "Guest");
    setSelectedCharacter(selectedCharacter);

    ShowTutorial();
  });

  for (const btn of genderSelection) {
    btn.addEventListener("click", function (event) {
      let selectedCharacter = document.querySelector("#selectedCharacter");
      selectedCharacter.innerHTML = event.target.value;

      if (event.target.className.includes("genderSelected")) {
        event.target.className = event.target.className.replace(
          "genderSelected",
          ""
        );
      } else {
        event.target.className += " genderSelected";
      }

      if (event.target.innerText === "Female") {
        const male = document.querySelector(".genderSelection-male");
        male.className = male.className.replace("genderSelected", "");
      } else {
        const female = document.querySelector(".genderSelection-female");
        female.className = female.className.replace("genderSelected", "");
      }
    });
  }
};


// Initialise HUD
export function SetupHUD() {
  initialSetupHUD();
}
