const BASE_URL = "http://localhost:3000"

export default new (class API {
  async getPositions() {
    try {
      const response = await fetch(`${BASE_URL}/getPositions`);

      if (!response.ok) {
        throw new Error();
      }
  
      const body = await response.json();

      return body;
    } catch (error) {

    }    
  }

  async getPieces() {
    try {
      const response = await fetch(`${BASE_URL}/getPieces`);

      if (!response.ok) {
        throw new Error();
      }
  
      const body = await response.json();

      return body;
    } catch (error) {

    }    
  }
})();