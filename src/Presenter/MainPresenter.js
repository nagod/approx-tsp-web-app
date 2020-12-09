//
// Presenter for main module
// Takes care of module logic and communication between Model, Views and
// Services i.e. reading files, fetching data and so on.
//

import Graph from "../Model/Graph";
import FileService from "../Services/FileService";
//const ex = require("../Resources/Examples/Examples");
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
    const data = FileService.getExampleByKey("example01");
    this.graph = Graph.makeGraphFromVertices(data);
  }
}
