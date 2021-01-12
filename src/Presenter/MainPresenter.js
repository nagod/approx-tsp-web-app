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
        this.handleReadDataButtonClicked = this.handleReadDataButtonClicked.bind(this);
    }

    handleTriangulateButtonClicked() {
        this.graph.sHullTriangulation(this.graph.vertices)
    }

    // TODO: Make dropdown, rename function and accept string to select example value
    //Read Data
    handleReadDataButtonClicked() {
        const data = FileService.getExampleByKey("example03");
        this.graph.makeGraphFromData(data);
    }

}
