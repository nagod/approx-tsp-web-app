//
// Presenter for main module
// Takes care of module logic and communication between Model, Views and
// Services i.e. reading files, fetching data and so on.
//

import Graph from "../Model/Graph";
import FileService from "../Services/FileService";

export default class MainPresenter {
  constructor(viewController) {
    this.graph = null;
    this.viewController = viewController;
    this.handleTurnRedButtonClicked = this.handleTurnRedButtonClicked.bind(
      this
    );
    this.handleTurnBlueButtonClicked = this.handleTurnBlueButtonClicked.bind(
      this
    );
    this.handleReadDataButtonClicked = this.handleReadDataButtonClicked.bind(
      this
    );
  }

  handleTurnRedButtonClicked() {
    this.viewController.turnViewRed();
  }

  handleTurnBlueButtonClicked() {
    this.viewController.turnViewBlue();
  }

  //Read Data
  handleReadDataButtonClicked() {
    const file = "../Ressources/Examples/Beispiel1(7).txt";
    const data = FileService.readFileAsText(file);
    console.log(typeof data);
  }
}
