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
        this.openFile = this.openFile.bind(this)

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
    openFile(data) {
        this.presenter.openFile(data)
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
    handleSkippingButtonClicked() {
        this.presenter.handleSkippingButtonClicked()
    }

    handleTriangulateButtonClicked() {
        Console.log("Triangulation gedrückt")
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
                            <div className="innerButtonDiv">
                                <Button
                                    style={{ maxWidth: '186px', minWidth: '186px', maxHeight: '45px', minHeight: '45px' }}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => this.handleTriangulateButtonClicked()}>Algorithmus GO</Button>
                                <ExampleDropDown action={(data) => this.presenter.openFile(data)} />
                            </div>
                            <div className="innerButtonDiv">
                                <Button
                                    style={{ maxWidth: '186px', minWidth: '186px', maxHeight: '45px', minHeight: '45px' }}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => this.toggleDrawer()}>Advanced {'>'}</Button>
                                <Button
                                    style={{ maxWidth: '186px', minWidth: '186px', maxHeight: '45px', minHeight: '45px' }}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => this.handleClearGraphGButtonClicked()}>Clear Graph</Button>
                            </div>
                            {/*

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
                            */}
                            <div className="sliderDiv">
                                <svg
                                    className="eraser"
                                    id="erase"
                                    viewBox="0 0 24 24"
                                    fill="#767878"
                                    height="1.8em"
                                    width="1.7em"
                                    cursor="pointer"
                                >
                                    <path fill="currentColor" d="M19.31,5.6C18.09,5.56 16.88,6.5 16.5,8C16,10 16,10 15,11C13,13 10,14 4,15C3,15.16 2.5,15.5 2,16C4,16 6,16 4.5,17.5L3,19H6L8,17C10,18 11.33,18 13.33,17L14,19H17L16,16C16,16 17,12 18,11C19,10 19,11 20,11C21,11 22,10 22,8.5C22,8 22,7 20.5,6C20.15,5.76 19.74,5.62 19.31,5.6M9,6A6,6 0 0,0 3,12C3,12.6 3.13,13.08 3.23,13.6C9.15,12.62 12.29,11.59 13.93,9.94L14.43,9.44C13.44,7.34 11.32,6 9,6Z" />                                </svg>

                                <Slider defaultValue={50} min={20} max={1000} aria-labelledby="continuous-slider" onChange={(event, value) => this.handleSliderChanged(event, value)} />
                                <svg
                                    className="eraser"
                                    id="erase"
                                    viewBox="0 0 24 24"
                                    fill="#767878"
                                    height="1.8em"
                                    width="1.7em"
                                    cursor="pointer"
                                >
                                    <path fill="currentColor" d="M18.05,21L15.32,16.26C15.32,14.53 14.25,13.42 12.95,13.42C12.05,13.42 11.27,13.92 10.87,14.66C11.2,14.47 11.59,14.37 12,14.37C13.3,14.37 14.36,15.43 14.36,16.73C14.36,18.04 13.31,19.11 12,19.11H15.3V21H6.79C6.55,21 6.3,20.91 6.12,20.72C5.75,20.35 5.75,19.75 6.12,19.38V19.38L6.62,18.88C6.28,18.73 6,18.5 5.72,18.26C5.5,18.76 5,19.11 4.42,19.11C3.64,19.11 3,18.47 3,17.68C3,16.9 3.64,16.26 4.42,16.26L4.89,16.34V14.37C4.89,11.75 7,9.63 9.63,9.63H9.65C11.77,9.64 13.42,10.47 13.42,9.16C13.42,8.23 13.62,7.86 13.96,7.34C13.23,7 12.4,6.79 11.53,6.79C11,6.79 10.58,6.37 10.58,5.84C10.58,5.41 10.86,5.05 11.25,4.93L10.58,4.89C10.06,4.89 9.63,4.47 9.63,3.95C9.63,3.42 10.06,3 10.58,3H11.53C13.63,3 15.47,4.15 16.46,5.85L16.74,5.84C17.45,5.84 18.11,6.07 18.65,6.45L19.1,6.83C21.27,8.78 21,10.1 21,10.11C21,11.39 19.94,12.44 18.65,12.44L18.16,12.39V12.47C18.16,13.58 17.68,14.57 16.93,15.27L20.24,21H18.05M18.16,7.74C17.63,7.74 17.21,8.16 17.21,8.68C17.21,9.21 17.63,9.63 18.16,9.63C18.68,9.63 19.11,9.21 19.11,8.68C19.11,8.16 18.68,7.74 18.16,7.74Z" />
                                </svg>
                            </div>

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
