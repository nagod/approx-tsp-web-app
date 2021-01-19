//
// ViewController of main module.
// Inhibits all views and notifies the presenter of any event.
//

import React from "react";
import Canvas from "../View/Canvas";
import Button from "../View/Button";
import MainPresenter from "../Presenter/MainPresenter";
import "./Stylesheets/MainViewController.css"

export default class MainViewController extends React.Component {
    constructor() {
        super();
        this.presenter = new MainPresenter(this); // Presenter takes care of app logic

        // Bind this to function so that "this" refers to this object
        this.handleReadDataButtonClicked = this.handleReadDataButtonClicked.bind(this);
        this.handleTriangulateButtonClicked = this.handleTriangulateButtonClicked.bind(this)
    }

    // Handling events

    handleReadDataButtonClicked() {
        this.presenter.handleReadDataButtonClicked();
    }

    handleTriangulateButtonClicked() {
        this.presenter.handleTriangulateButtonClicked()
    }

    // Changing the View Functions


    render() {
        return (
            <div className="mainDiv">
                <div className="canvasDiv">

                    <Canvas viewController={this} />

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
                </div>
            </div>
        );
    }
}
