const BASE_URL = "http://cervin.everdreamsoft.com/api/v1"
import positions from "../Data/positions";
import positionsLobby from "../Data/positionsLobby"
import { setNFTCollections } from "../Model/state";

export default new (class API {
  async getPositionsGallery() {
    return positions; 
  }

  async getPositionsLobby() {
    return positionsLobby; 
  }

  async getPieces(maxPieces = 10) {
    try {
      const response = await fetch(`${BASE_URL}/collections`);
      
      if (!response.ok) {
        throw new Error();
      }
      
      const transactions = await response.json();
      
      const validTransactions = transactions.data;
      
      let current = 0, index = 0, pieces = [];
      while (current < maxPieces) {
        const collection = await fetch(`${BASE_URL}/collections/${validTransactions[index++].id}`);
        
        if (!collection.ok) {
          throw new Error();
        }
        
        const collectionData = await collection.json();
        const collectionAssets = Object.entries(collectionData.data.assets).map(item => item[1]);

        for (let piece of collectionAssets) {
          if (++current > maxPieces) {
            break;
          }

          pieces.push({ 
            name: piece.name, 
            image: piece.imgUrl, 
            address: piece.assetId, 
            standard: piece.contracts[0].standard,
            collection: {
              name: collectionData.data.collection.name,
              description: collectionData.data.collection.description,
              id: collectionData.data.collection.id
            }
          });
        }
      }

      return pieces;
    } catch (error) {

    }    
  }

  async getCollections() {
    try {
      const response = await fetch(`${BASE_URL}/collections`);
      
      if (!response.ok) {
        throw new Error();
      }
      
      const collections = await response.json();

      setNFTCollections(collections.data);

      return collections.data;
    } catch (error) {

    }
  }

  async getCollectionPieces(id, maxPieces = 9) {
    try {      
      const collection = await fetch(`${BASE_URL}/collections/${id}`);
      
      if (!collection.ok) {
        throw new Error();
      }
      
      const collectionData = await collection.json();
      const collectionAssets = Object.entries(collectionData.data.assets).map(item => item[1]);
      
      let current = 0, pieces = [];
      for (let piece of collectionAssets) {
        if (++current > maxPieces) {
          break;
        }

        pieces.push({ 
          name: piece.name, 
          image: piece.imgUrl, 
          address: piece.assetId, 
          standard: piece.contracts[0].standard,
          collection: {
            name: collectionData.data.collection.name,
            description: collectionData.data.collection.description,
            id: collectionData.data.collection.id
          }
        });
      }

      return pieces;
    } catch (error) {

    }    
  }
})();