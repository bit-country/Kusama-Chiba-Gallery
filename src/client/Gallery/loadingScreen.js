export default class LoadingScreen {
  constructor() {
    this.loadingScreen = document.querySelector("#root .hud .loading-screen");
  }
  displayLoadingUI() {
    this.loadingScreen.classList.remove("invisible");
  }

  hideLoadingUI() {
    this.loadingScreen.classList.add("invisible");
    this.loadingScreen.remove();
  }
}