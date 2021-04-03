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
        this.handleDFSButtonClicked = this.handleDFSButtonClicked.bind(this)
        this.handleSkippingButtonClicked = this.handleSkippingButtonClicked.bind(this)
        this.handleShortestTourButtonClicked = this.handleShortestTourButtonClicked.bind(this)
        this.handleInitialTourButtonClicked = this.handleInitialTourButtonClicked.bind(this)
    }

    handleTriangulateButtonClicked() {
        this.graph.sHullTriangulation(this.graph.vertices)
    }
    handleEdgesButtonClicked() {
        console.log(this.graph.edges)
        this.graph.edges.forEach(element => {
            element.color = "lightblue"
        });
        //this.canvas.highlightFinalTours()
    }

    handleMSTButtonClicked() {
        this.graph.kruskal()
    }
    scaleCanvasWithVertex(maxX, maxY) {
        this.viewController.scaleCanvasWithVertex(maxX, maxY)
    }

    handleDFSButtonClicked() {
        this.graph.dfs()
    }

    handleShortestTourButtonClicked() {
        this.graph.highlightTour(this.graph.shortestTour, "orange")
    }

    handleInitialTourButtonClicked() {
        this.graph.highlightTour(this.graph.initialTour, "blue")
    }

    handleSkippingButtonClicked() {
        this.graph.calculateSkippingTour(this.graph.tour)
    }
    // TODO: Make dropdown, rename function and accept string to select example value
    //Read Data
    handleReadDataButtonClicked() {
        const data = FileService.getExampleByKey("example03");
        this.graph.makeGraphFromData(data);
    }

}
