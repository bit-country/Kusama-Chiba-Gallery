const BASE_URL = "https://localhost:44336"

export default class API {
  async display() {
    try {
      const response = await fetch(`${BASE_URL}/display`);

      if (!response.ok) {
        throw new Error();
      }
  
      const body = await response.json();

      debugger;
    } catch (error) {

    }    
  }

  async nft(collectionId, tokenId) {
    try {
      const response = await fetch(`${BASE_URL}/nft/${collectionId}/${tokenId}`);

      if (!response.ok) {
        throw new Error();
      }
  
      const body = await response.json();

      debugger;
    } catch (error) {

    }
  }

  async walletCollections(address) {
    try {
      const response = await fetch(`${BASE_URL}/wallet/collections/${address}`);

      if (!response.ok) {
        throw new Error();
      }
  
      const body = await response.json();

      debugger;
    } catch (error) {

    }
  }

  async walletOwnedNFTs(address) {
    try {
      const response = await fetch(`${BASE_URL}/wallet/owned_nfts/${address}`);

      if (!response.ok) {
        throw new Error();
      }
  
      const body = await response.json();

      debugger;
    } catch (error) {

    }
  }

  async walletCreatedNFTs(address) {
    try {
      const response = await fetch(`${BASE_URL}/wallet/created_nfts/${address}`);

      if (!response.ok) {
        throw new Error();
      }
  
      const body = await response.json();

      debugger;
    } catch (error) {

    }
  }

  async walletAppreciation(address) {
    try {
      const response = await fetch(`${BASE_URL}/wallet/appreciation/${address}`);

      if (!response.ok) {
        throw new Error();
      }
  
      const body = await response.json();

      debugger;
    } catch (error) {

    }
  }

  async offers(address) {
    try {
      const response = await fetch(`${BASE_URL}/offers/${address}`);

      if (!response.ok) {
        throw new Error();
      }
  
      const body = await response.json();

      debugger;
    } catch (error) {

    }
  }

  async report(status) {
    try {
      const response = await fetch(`${BASE_URL}/report?status=${status}`);

      if (!response.ok) {
        throw new Error();
      }
  
      const body = await response.json();

      debugger;
    } catch (error) {

    }
  }
}