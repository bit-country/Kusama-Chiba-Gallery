let state = {
  pieces: [],
  camera: null,
  engine: null,
  scene: null,
  activePiece: null,
  building: null,
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

export function getPieces() {
  return state.pieces;
}

export function addPiecePosition(pieceInfo) {
  state.pieces.push(pieceInfo);
}

export function getActivePiece() {
  return state.activePiece;
}

export function setActivePiece(piece) {
  state.activePiece = piece;
}

export function getCamera() {
  return state.camera;
}

export function setCamera(camera) {
  state.camera = camera;
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

export function SetupState() {}

export function getGameRoom() {
  return state.gameRoom;
}

export function setGameRoom(room) {
  state.gameRoom = room;
}
