// Refactor to categorise below state.
// Consider using class if it simplifies the idea.
let state = {
  piecesGallery: [],
  piecesLobby: [],
  cameraGallery: null,
  cameraLobby: null,
  playerGallery: null,
  playerLobby: null,
  playerStructGallery: {},
  playerStructLobby: {},
  players: [],
  engine: null,
  scene: null,
  lobby: null,
  gallery: null,
  activePiece: null,
  activeNavigator: null,
  building: null,
  lobbyMesh: null,
  galleryContainer: null,
  lobbyContainer: null,
  gallerySlotMesh: null,
  lobbySlotMesh: null,
  sections: {
    bottomRightWing: [],
    bottomLeftWing: [],
    topRightWing: [],
    topLeftWing: [],
    topFrontWing: [],
    topBackWing: [],
    bottomFloor: [],
    roof: [],
  },
  gameRoom: null,
  collections: [],
  assets: null,
  username: "Guest",
  selectedCharacter: null,
};

export function getSections() {
  return state.sections;
}

export function getBuildingMeshes() {
  return state.building;
}

export function setBuildingMeshes(building) {
  state.building = building;
}

export function getLobbyMesh() {
  return state.lobbyMesh;
}

export function setLobbyMesh(mesh) {
  state.lobbyMesh = mesh;
}

export function getPieces(scene) {
  if (!scene) {
    if (state.scene == state.gallery) {
      return state.piecesGallery;
    } else {
      return state.piecesLobby;
    }
  }

  if (scene == state.gallery) {
    return state.piecesGallery;
  } else {
    return state.piecesLobby;
  }
}

export function clearPieces(scene) {
  if (!scene) {
    if (state.scene == state.gallery) {
      state.piecesGallery = [];
    } else {
      state.piecesLobby = [];
    }
  }

  if (scene == state.gallery) {
    state.piecesGallery = [];
  } else {
    state.piecesLobby = [];
  }
}

export function addPiecePosition(scene, pieceInfo) {
  if (scene == state.gallery) {
    state.piecesGallery.push(pieceInfo);
  } else {
    state.piecesLobby.push(pieceInfo);
  }
}

export function getActivePiece() {
  return state.activePiece;
}

export function setActivePiece(piece) {
  state.activePiece = piece;
}

export function getCamera() {
  return state.scene == state.gallery ? state.cameraGallery : state.cameraLobby;
}

export function setCamera(camera) {
  if (state.scene == state.gallery) {
    state.cameraGallery = camera;
  } else {
    state.cameraLobby = camera;
  }
}

export function getLocalPlayer() {
  return state.scene == state.gallery ? state.playerGallery : state.playerLobby;
}

export function setLocalPlayer(player) {
  if (state.scene == state.gallery) {
    state.playerGallery = player;
  } else {
    state.playerLobby = player;
  }
}

export function getPlayers() {
  return state.players;
}

export function getPlayer(sessionId) {
  return state.players.find((x) => x.id === sessionId);
}

export function setPlayer(player) {
  // update the duplicated obj
  const playerIndex = state.players.findIndex((x) => x.id === player.id);
  if (playerIndex !== -1) {
    state.players.splice(playerIndex, 1, player);
  } else state.players.push(player);
}
export function removePlayer(sessionId) {
  const playerIndex = state.players.findIndex((x) => x.id === sessionId);
  state.players[playerIndex].mesh.dispose();

  state.players.splice(playerIndex, 1);
}

export function getEngine() {
  return state.engine;
}

export function setEngine(engine) {
  state.engine = engine;
}

export function getScene() {
  return state.scene;
}

export function setScene(scene) {
  state.scene = scene;
}

export function getLobbyScene() {
  return state.lobby;
}

export function setLobbyScene(lobby) {
  state.lobby = lobby;
}

export function getGalleryScene() {
  return state.gallery;
}

export function setGalleryScene(gallery) {
  state.gallery = gallery;
}

export function getGameRoom() {
  return state.gameRoom;
}

export function setGameRoom(room) {
  state.gameRoom = room;
}

export function setNFTCollections(collections) {
  state.collections = collections;
}

export function getNFTCollections() {
  return state.collections;
}

export function setNFTAssets(assets) {
  state.assets = assets;
}

export function getNFTAssets() {
  return state.assets;
}

export function getActiveNavigator() {
  return state.activeNavigator;
}

export function setActiveNavigator(status) {
  state.activeNavigator = status;
}

export function getContainer() {
  return state.scene == state.gallery
    ? state.galleryContainer
    : state.lobbyContainer;
}

export function setContainer(container) {
  if (state.scene == state.gallery) {
    state.galleryContainer = container;
  } else {
    state.lobbyContainer = container;
  }
}

export function setUsername(username) {
  state.username = username;
}

export function getUsername() {
  return state.username;
}

export function setSelectedCharacter(character) {
  state.selectedCharacter = character;
}

export function getSelectedCharacter() {
  return state.selectedCharacter;
}

export function getSlotMesh(scene) {
  return scene == getGalleryScene()
    ? state.gallerySlotMesh
    : state.lobbySlotMesh;
}

export function setSlotMesh(scene, mesh) {
  if (scene == getGalleryScene()) {
    state.gallerySlotMesh = mesh;
  } else {
    state.lobbySlotMesh = mesh;
  }
}

export function getPlayerStruct(scene, character) {
  return scene == getGalleryScene() ? state.playerStructGallery[character] : state.playerStructLobby[character];
}

export function setPlayerStruct(scene, character, playerStruct) {
  if (scene == getGalleryScene()) {
    state.playerStructGallery[character] = playerStruct;
  } else {
    state.playerStructLobby[character] = playerStruct;
  }
}
