//
// ViewController of main module.
// Inhibits all views and notifies the presenter of any event.
//

import React from "react";
import Canvas from "../View/Canvas";
import Button from "../View/Button";
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
    }

    // Lifecycle

    componentDidMount() {
        this.setupViewController()
    }


    setupViewController() {
    }

    handleSliderChanged(event) {
        let slider = document.getElementById("animationSpeedSlider")
        Config.baseRateSpeed = (500 - event.target.value)
        slider.value = event.target.value
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


    render() {
        return (
            <div className="mainDiv">
                <div className="canvasDiv">

                    <Canvas viewController={this} id="canvasView" />

                </div>
                <div className="buttonDiv">

                    <Button
                        label="Read Data"
                        handleButtonClicked={this.handleReadDataButtonClicked}
                    />
                    <Button
                        label="Triangulate"
                        handleButtonClicked={this.handleTriangulateButtonClicked}
                    />
                    <Button
                        label="Calc MST"
                        handleButtonClicked={this.handleMSTButtonClicked}
                    />
                    <Button
                        label="Print Tours"
                        handleButtonClicked={this.handleEdgesButtonClicked}
                    />
                    <Button
                        label="DFS ALgo"
                        handleButtonClicked={this.handleDFSButtonClicked}
                    />
                    <Button
                        label="Skipping"
                        handleButtonClicked={this.handleSkippingButtonClicked}
                    />
                    <Button
                        label="Highlight shortest"
                        handleButtonClicked={this.handleShortestTourButtonClicked}
                    />
                    <Button
                        label="Highlight initial"
                        handleButtonClicked={this.handleInitialTourButtonClicked}
                    />
                    <Button
                        label="Save Graph"
                        handleButtonClicked={this.handleSaveGraphButtonClicked}
                    />
                    <input type="range" min="10" max="500" value="100" className="slider" id="animationSpeedSlider"
                        onChange={this.handleSliderChanged}></input>
                </div>
            </div>
        );
    }
}
