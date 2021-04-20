//
// Presenter for main module
// Takes care of module logic and communication between Model, Views and
// Services i.e. reading files, fetching data and so on.
//

import Graph from "../Model/Graph";
import FileService from "../Services/FileService";
import Config from "../App/Config";
import Observable from "../Architecture/Observable";


export default class MainPresenter extends Observable {
    constructor(viewController) {
        super();
        this.graph = new Graph(this);
        this.viewController = viewController;
        this.handleMSTButtonClicked = this.handleMSTButtonClicked.bind(this)
        this.scaleCanvasWithVertex = this.scaleCanvasWithVertex.bind(this)
        this.handleEdgesButtonClicked = this.handleEdgesButtonClicked.bind(this)
        this.handleDFSButtonClicked = this.handleDFSButtonClicked.bind(this)
        this.handleSkippingButtonClicked = this.handleSkippingButtonClicked.bind(this)
        this.handleShortestTourButtonClicked = this.handleShortestTourButtonClicked.bind(this)
        this.handleInitialTourButtonClicked = this.handleInitialTourButtonClicked.bind(this)
        this.handleSaveGraphButtonClicked = this.handleSaveGraphButtonClicked.bind(this)
        this.handleSaveAsJPEGButtonClicked = this.handleSaveAsJPEGButtonClicked.bind(this)
        this.passData = this.passData.bind(this)
        this.openFile = this.openFile.bind(this)
        this.handleClearGraphGButtonClicked = this.handleClearGraphGButtonClicked.bind(this)
        this.handleIconClicked = this.handleIconClicked.bind(this)
        this.animationDidStart = this.animationDidStart.bind(this)
        this.animationDidStop = this.animationDidStop.bind(this)
    }
    handleSaveAsJPEGButtonClicked() {
        FileService.saveAsJPEG(this.viewController.state.canvas)
    }
    handleIconClicked() {
        this.notify("editMode", this.viewController.state.editMode)
    }

    animationDidStart() {
        console.log("did start first")
        this.viewController.isInteractable = false
    }

    animationDidStop() {
        this.viewController.isInteractable = true
    }

    handleClearGraphGButtonClicked() {
        this.notify("clear", true)
        try {
            this.graph.vertices = [];
            this.graph.edges = [];
            this.graph.triangles = []
            this.graph.mst = []
            this.graph.shortestTour = []
            this.graph.initialTour = []
            this.graph.tour = null
            this.graph.idCounter = 1
        } catch (e) { console.log(e.stack) }

    }

    handleSaveGraphButtonClicked() {
        FileService.saveToJSON(this.graph.vertices)
    }

    openFile(data) {
        this.handleClearGraphGButtonClicked()
        let filename = data.split("(")[0]
        const example = FileService.getExampleByKey(filename);
        this.graph.makeGraphFromData(example);

    }
    // recives date from MainviewController ( Examples .txt)
    passData(text, filetype = null) {
        this.handleClearGraphGButtonClicked()
        let data = null
        // // wir müssen wissen ob datei json oder .txt ist 
        // if (filetype !== null && filetype === "txt") {
        //     data = FileService.textToJason(text)
        // } else if (filetype !== null && filetype === "json") {
        //     data = JSON.parse(text)
        // }


        // HIER GEHT NUR JSON OBJECT  FORMAT NICHTS ANDEREN !!!!!
        data = JSON.parse(text)
        this.graph.makeGraphFromData(data);
    }

    handleTriangulateButtonClicked() {
        this.graph.sHullTriangulation(this.graph.vertices)
    }

    handleEdgesButtonClicked() {
        this.graph.resetEdgesColors()
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
        FileService.saveToJSON(this.graph.shortestTour, this.graph.tourLength(this.graph.shortestTour, true))
    }

    handleInitialTourButtonClicked() {
        this.graph.highlightTour(this.graph.initialTour, "blue")
    }

    handleSkippingButtonClicked() {
        this.graph.calculateSkippingTour(this.graph.tour)
    }
}
