//
// ViewController of main module.
// Inhibits all views and notifies the presenter of any event.
//

import React from "react";
import Canvas from "../View/Canvas";
import { Button, Slider, Input } from '@material-ui/core';
import MainPresenter from "../Presenter/MainPresenter";
import "./Stylesheets/MainViewController.css"
import Config from "../App/Config";

export default class MainViewController extends React.Component {
    constructor() {
        super();
        this.presenter = new MainPresenter(this); // Presenter takes care of app logic
        // Bind this to function so that "this" refers to this object
        this.handleReadDataButtonClicked = this.handleReadDataButtonClicked.bind(this);
        this.handleTriangulateButtonClicked = this.handleTriangulateButtonClicked.bind(this)
        this.handleMSTButtonClicked = this.handleMSTButtonClicked.bind(this)
        this.setupViewController = this.setupViewController.bind(this)
        this.scaleCanvasWithVertex = this.scaleCanvasWithVertex.bind(this)
        this.handleEdgesButtonClicked = this.handleEdgesButtonClicked.bind(this)
        this.handleDFSButtonClicked = this.handleDFSButtonClicked.bind(this)
        this.handleSkippingButtonClicked = this.handleSkippingButtonClicked.bind(this)
        this.handleSaveGraphButtonClicked = this.handleSaveGraphButtonClicked.bind(this)
        this.handleShortestTourButtonClicked = this.handleShortestTourButtonClicked.bind(this)
        this.handleInitialTourButtonClicked = this.handleInitialTourButtonClicked.bind(this)
        this.handleLoadSampleButtonClicked = this.handleLoadSampleButtonClicked.bind(this)
    }

    // Lifecycle

    componentDidMount() {
        this.setupViewController()
    }


    setupViewController() {
    }

    handleSliderChanged(event, value) {
        //let slider = document.getElementById("animationSpeedSlider")

        Config.baseRateSpeed = (500 - value)
        //slider.value = event.target.value
    }

    // Handling events

    handleReadDataButtonClicked() {
        this.presenter.handleReadDataButtonClicked()
    }
    handleSkippingButtonClicked() {
        this.presenter.handleSkippingButtonClicked()
    }

    handleTriangulateButtonClicked() {
        this.presenter.handleTriangulateButtonClicked()
    }

    handleMSTButtonClicked() {
        this.presenter.handleMSTButtonClicked()
    }
    handleEdgesButtonClicked() {
        this.presenter.handleEdgesButtonClicked()
    }
    handleDFSButtonClicked() {
        this.presenter.handleDFSButtonClicked()
    }

    handleShortestTourButtonClicked() {
        this.presenter.handleShortestTourButtonClicked()
    }

    handleInitialTourButtonClicked() {
        this.presenter.handleInitialTourButtonClicked()
    }

    // Changing the View Functions
    scaleCanvasWithVertex(maxX, maxY) {
        let canvas = document.getElementById("mainCanvas")
        let ctx = canvas.getContext("2d");
        let rect = canvas.getBoundingClientRect();
        let width = rect.width - 70
        let height = rect.height - 70
        let factor = 0
        console.log("Width: ", width, "Height: , ", height)
        if ((width / maxX) < (height / maxY)) {
            factor = width / maxX
        } else {
            factor = height / maxY
        }
        factor = Math.ceil(factor)
        ctx.scale(factor, factor)
        console.log("Scaled by factor: ", factor)
        /*let canvasView = document.getElementById("canvasView")
        canvasView.scalingFactor *= factor
        */
    }

    handleSaveGraphButtonClicked() {
        this.presenter.handleSaveGraphButtonClicked()
    }

    handleLoadSampleButtonClicked = async (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = (e.target.result)
            this.presenter.passData(text)
        };
        reader.readAsText(e.target.files[0])
    }

    render() {
        return (
            <div className="mainDiv">
                <div className="canvasDiv">

                    <Canvas viewController={this} id="canvasView" />

                </div>
                <div className="buttonDiv">

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleTriangulateButtonClicked()}>Triangulieren</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleMSTButtonClicked()}>Calc MST</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleEdgesButtonClicked()}>Print Tours</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleDFSButtonClicked()}>DFS ALgo</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleReadDataButtonClicked()}>Read Data</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleSkippingButtonClicked()}>Skipping</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleShortestTourButtonClicked()}>Shortest</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleInitialTourButtonClicked()}>EulerTour</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleSaveGraphButtonClicked()}>Save 10X Reiniger</Button>
                    <Slider defaultValue={50} min={20} max={1000} aria-labelledby="continuous-slider" onChange={(event, value) => this.handleSliderChanged(event, value)} />
                    {/*<input type="range" min="10" max="500" value="100" className="slider" id="animationSpeedSlider"
                        onChange={this.handleSliderChanged}></input>*/}
                    <div>
                        <label htmlFor="file" className="File-label">"LOAD"</label>
                        <input className="File-input" type="file" id="file" onChange={(e) => this.handleLoadSampleButtonClicked(e)}></input>
                    </div>
                </div>
            </div >
        );
    }
}
