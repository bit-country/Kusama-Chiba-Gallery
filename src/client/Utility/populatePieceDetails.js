export default function populatePieceDetails(piece, apiData) {
  piece.address = apiData.address;
  piece.name = apiData.name;
  piece.standard = apiData.standard;
  piece.collectionName = apiData.collection.name;
  piece.description = apiData.collection.description;
}