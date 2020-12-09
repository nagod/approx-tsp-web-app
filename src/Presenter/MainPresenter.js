//
// Presenter for main module
// Takes care of module logic and communication between Model, Views and
// Services i.e. reading files, fetching data and so on.
//

import Graph from "../Model/Graph";
import Vertex from "../Model/Vertex";
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
    const input = require("../Resources/Examples/data.json");
    let graph = new Graph();
    input.forEach((data) => {
      let id = data[0];
      let xPos = data[1];
      let yPos = data[2];
      let vertex = new Vertex(id, xPos, yPos);
      console.log(vertex[0]);
      //graph.makeGraphFromVertices(vertex);
    });
  }
}
