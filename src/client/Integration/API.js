const BASE_URL = "http://localhost:3000"
import positions from "../positions.json";
import pieces from "../pieces.json";

export default new (class API {
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
      // const response = await fetch(`${BASE_URL}/getPieces`);

      // if (!response.ok) {
      //   throw new Error();
      // }
  
      // const body = await response.json();

      // return body;

      return pieces;
    } catch (error) {

    }    
  }
})();