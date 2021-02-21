const BASE_URL = "http://cervin.everdreamsoft.com/api/v1"
import positions from "../positions.json";
import pieces from "../pieces.json";

export default new (class API {
  maxPieces = 10;

  async getPositions() {
    try {
      // const response = await fetch(`${BASE_URL}/getPositions`);

      // if (!response.ok) {
      //   throw new Error();
      // }
  
      // const body = await response.json();

      return positions; //body;
    } catch (error) {

    }    
  }

  async getPieces() {
    try {
      const response = await fetch(`${BASE_URL}/events`);
      
      if (!response.ok) {
        throw new Error();
      }
      
      const transactions = await response.json();
      
      const validTransactions = transactions.data.filter(transaction => transaction.validity == "valid");
      
      let current = 0, index = 0, pieces = [];
      while (current < this.maxPieces) {
        const collection = await fetch(`${BASE_URL}/collections/${validTransactions[index++].orbs[0].collection.id}`);
        
        if (!collection.ok) {
          throw new Error();
        }
        
        const collectionData = await collection.json();
        const collectionAssets = Object.entries(collectionData.data.assets).map(item => item[1]);

        for (let piece of collectionAssets) {
          if (++current >= this.maxPieces) {
            break;
          }

          pieces.push({ name: piece.name, image: piece.imgUrl });
        }
      }

      return pieces;
    } catch (error) {

    }    
  }
})();