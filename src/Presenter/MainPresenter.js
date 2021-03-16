//
// Presenter for main module
// Takes care of module logic and communication between Model, Views and
// Services i.e. reading files, fetching data and so on.
//

import Graph from "../Model/Graph";
import FileService from "../Services/FileService";
export default class MainPresenter {
    constructor(viewController) {
        this.graph = new Graph(this);
        this.viewController = viewController;
        this.handleReadDataButtonClicked = this.handleReadDataButtonClicked.bind(this);
        this.handleMSTButtonClicked = this.handleMSTButtonClicked.bind(this)
        this.scaleCanvasWithVertex = this.scaleCanvasWithVertex.bind(this)
        this.handleEdgesButtonClicked = this.handleEdgesButtonClicked.bind(this)
    }

    handleTriangulateButtonClicked() {
        this.graph.sHullTriangulation(this.graph.vertices)
    }
    handleEdgesButtonClicked() {
        console.log(this.graph.edges)
    }

    handleMSTButtonClicked() {
        this.graph.kruskal()
    }
    scaleCanvasWithVertex(maxX, maxY) {
        this.viewController.scaleCanvasWithVertex(maxX, maxY)
    }
    // TODO: Make dropdown, rename function and accept string to select example value
    //Read Data
    handleReadDataButtonClicked() {
        const data = FileService.getExampleByKey("example03");
        this.graph.makeGraphFromData(data);
    }

}
