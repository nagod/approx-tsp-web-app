//
// ViewController of main module.
// Inhibits all views and notifies the presenter of any event.
//

import React from "react";
import Canvas from "../View/Canvas";
import Button from "../View/Button";
import MainPresenter from "../Presenter/MainPresenter";

export default class MainViewController extends React.Component {
    constructor() {
        super();
        this.presenter = new MainPresenter(this); // Presenter takes care of app logic

        // Bind this to function so that "this" refers to this object
        this.handleReadDataButtonClicked = this.handleReadDataButtonClicked.bind(this);
        this.handleTriangulateButtonClicked = this.handleTriangulateButtonClicked.bind(this)
        this.printGraph = this.printGraph.bind(this)
    }

    // Handling events

    handleReadDataButtonClicked() {
        this.presenter.handleReadDataButtonClicked();
    }

    handleTriangulateButtonClicked() {
        this.presenter.handleTriangulateButtonClicked()
    }

    // Changing the View Functions

    turnViewRed() {
        document.getElementById("blackText").style.color = "red";
    }

    turnViewBlue() {
        document.getElementById("blackText").style.color = "blue";
    }
    printGraph() {
        //this.presenter.printGraph()
        console.log(this.presenter.getGraph());
    }

    render() {
        return (
            <div>
                <Button
                    label="Read Data"
                    handleButtonClicked={this.handleReadDataButtonClicked}
                />
                <Button
                    label="Triangulate"
                    handleButtonClicked={this.handleTriangulateButtonClicked}
                />
                <Button
                    label="Print Data"
                    handleButtonClicked={this.printGraph}
                />
                <Canvas viewController={this} />
                <h1 id="blackText">after canvas</h1>
            </div>
        );
    }
}
