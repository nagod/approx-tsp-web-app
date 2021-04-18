//
// ViewController of main module.
// Inhibits all views and notifies the presenter of any event.
//

import React, { Component } from "react";
import Canvas from "../View/Canvas";
import Console from "../View/Console"
import ExampleDropDown from "../View/ExampleDropDown"
import { Button, Slider, FormControlLabel, Switch, Drawer } from '@material-ui/core';
import MainPresenter from "../Presenter/MainPresenter";
import Icons from "../View/Icons"
import "./Stylesheets/MainViewController.css"
import Config from "../App/Config";

export default class MainViewController extends Component {
    constructor() {
        super();
        this.presenter = new MainPresenter(this); // Presenter takes care of app logic
        this.state = {
            distanceToggle: false,
            canvas: {},
            /**
             *   default mode  "draw " (ADD NODE) === when pencil icon is clicked.
             *                "erase" (delte Node) == when erase icon is clicked.
             */
            editMode: "draw",
            drawerOpen: false

        };
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
        this.handleShowDistnance = this.handleShowDistnance.bind(this)
        this.handleSaveAsJPEGButtonClicked = this.handleSaveAsJPEGButtonClicked.bind(this)
        this.handleClearGraphGButtonClicked = this.handleClearGraphGButtonClicked.bind(this)
        this.setEditMode = this.setEditMode.bind(this)
        this.handleIconClicked = this.handleIconClicked.bind(this)

    }

    toggleDrawer(event) {
        let currentState = this.state.drawerOpen
        this.setState({ drawerOpen: !currentState })
    };

    setEditMode(dataFromIcons) {
        this.setState({ editMode: dataFromIcons })
        this.handleIconClicked()
    }
    handleIconClicked() {
        this.presenter.handleIconClicked()
    }

    // Lifecycle

    componentDidMount() {
        this.setupViewController()
    }


    setupViewController() {
    }

    handleSliderChanged(event, value) {
        Config.baseRateSpeed = (500 - value)
    }

    // Handling events
    handleSaveAsJPEGButtonClicked() {
        this.presenter.handleSaveAsJPEGButtonClicked()
    }
    handleReadDataButtonClicked() {
        this.presenter.handleReadDataButtonClicked()
    }
    handleSkippingButtonClicked() {
        this.presenter.handleSkippingButtonClicked()
    }

    handleTriangulateButtonClicked() {
        Console.log("Triangulation gedrückt der nUtten")
        this.presenter.handleTriangulateButtonClicked()
    }

    handleMSTButtonClicked() {
        Console.log("MST Button Clicked")
        this.presenter.handleMSTButtonClicked()
    }
    handleEdgesButtonClicked() {
        this.presenter.handleEdgesButtonClicked()
    }
    handleDFSButtonClicked() {
        Console.log("DFS Button Clicked")
        this.presenter.handleDFSButtonClicked()
    }

    handleShortestTourButtonClicked() {
        this.presenter.handleShortestTourButtonClicked()
    }

    handleInitialTourButtonClicked() {
        this.presenter.handleInitialTourButtonClicked()
    }
    handleShowDistnance(e) {
        this.setState({ distanceToggle: e.target.checked })
    }
    handleClearGraphGButtonClicked() {
        this.presenter.handleClearGraphGButtonClicked()
    }

    handleSaveGraphButtonClicked() {
        this.presenter.handleSaveGraphButtonClicked()
    }

    // Changing the View Functions
    scaleCanvasWithVertex(maxX, maxY) {
        let canvas = document.getElementById("mainCanvas")
        let ctx = canvas.getContext("2d");
        let rect = canvas.getBoundingClientRect();
        let width = rect.width - 70
        let height = rect.height - 70
        let factor = 0
        if ((width / maxX) < (height / maxY)) {
            factor = width / maxX
        } else {
            factor = height / maxY
        }
        factor = Math.ceil(factor)
        ctx.scale(factor, factor)
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
            <div className="mainBody">
                <Drawer variant="persistent" anchor={"right"} open={this.state.drawerOpen}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleReadDataButtonClicked()}>Load Example</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleShortestTourButtonClicked()}>Highlight Shortest</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleInitialTourButtonClicked()}>Highlight Initial</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleEdgesButtonClicked()}>Kanten cleanen</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleSaveGraphButtonClicked()}>Save as JSON</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleSaveAsJPEGButtonClicked()}>Save as JPEG</Button>
                    <div className="fileUploadDiv">
                        <label htmlFor="file" className="File-label">Upload File</label>
                        <input className="File-input" type="file" id="file" onChange={(e) => this.handleLoadSampleButtonClicked(e)}></input>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.toggleDrawer()}>Close</Button>
                </Drawer >
                <div className="screenSizeWarningDiv">
                    <div className="innerScreenSizeWarningDiv">
                        <h1 className="warningHeader">WARNING</h1>
                        <h3 className="warningDescription">Screen size too small!
                        <br></br>Please expand your window or <br></br>switch to a device with a bigger screen.</h3>
                    </div>
                </div>

                <div className="header"> <h1 className="headerLabel">-- Leaf Skipping Algorithm --</h1></div>
                <div className="padding-right">
                    <div className="canvasToolBar">
                        <ExampleDropDown />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.distanceToggle}
                                    onChange={(e) => this.handleShowDistnance(e)}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="Distance"
                        />
                        <Icons action={this.setEditMode} />
                    </div>
                    <div className="mainDiv">
                        <div className="buttonDiv">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.handleTriangulateButtonClicked()}>Triangulieren</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.handleMSTButtonClicked()}>MST Berechnen</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.handleDFSButtonClicked()}>DFS Algorithmus</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.handleSkippingButtonClicked()}>Leaf Skipping</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.handleClearGraphGButtonClicked()}>Clear Graph</Button>
                            <Slider defaultValue={50} min={20} max={1000} aria-labelledby="continuous-slider" onChange={(event, value) => this.handleSliderChanged(event, value)} />

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.toggleDrawer()}>Advanced {'>'}</Button>
                            <Console></Console>
                        </div>
                        <div className="canvasDiv">
                            <Canvas viewController={this} id="canvasView" />
                        </div>
                    </div >
                </div>
                <div className="footer">
                    Created by Deniz Dogan and Timo Kilb © 2021. All rights reserved.
                </div>
            </div >
        );
    }
}
