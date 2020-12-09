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
        this.graph = new Graph();
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
        this.getGraph = this.getGraph.bind(this);
        this.drawGraph = this.drawGraph.bind(this);
        this.printGraph = this.printGraph.bind(this)
    }

    handleTurnRedButtonClicked() {
        this.viewController.turnViewRed();
    }

    handleTurnBlueButtonClicked() {
        this.viewController.turnViewBlue();
    }

    getGraph() {
        return this.graph;
    }

    printGraph() {
        console.log(this.graph)
    }


    // TODO: Make dropdown, rename function and accept string to select example value
    //Read Data
    handleReadDataButtonClicked() {
        const data = FileService.getExampleByKey("example03");
        this.graph.makeGraphFromData(data);
    }

    drawGraph() {
        this.viewController.drawGraph();
    }
}
