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
    this.handleTurnRedButtonClicked = this.handleTurnRedButtonClicked.bind(
      this
    );
    this.handleTurnBlueButtonClicked = this.handleTurnBlueButtonClicked.bind(
      this
    );
    this.handleReadDataButtonClicked = this.handleReadDataButtonClicked.bind(
      this
    );
    this.drawGraph = this.drawGraph.bind(this);
    this.printGraph = this.printGraph.bind(this)
  }

  // Handling events

  handleTurnRedButtonClicked() {
    this.presenter.handleTurnRedButtonClicked();
  }

  handleTurnBlueButtonClicked() {
    this.presenter.handleTurnBlueButtonClicked();
  }

  handleReadDataButtonClicked() {
    this.presenter.handleReadDataButtonClicked();
  }

  // Changing the View Functions

  turnViewRed() {
    document.getElementById("blackText").style.color = "red";
  }

  turnViewBlue() {
    document.getElementById("blackText").style.color = "blue";
  }

  drawGraph() {
  }

  printGraph() {
    //this.presenter.printGraph()
    console.log(this.presenter.getGraph());
  }



  render() {
    return (
      <div>
        <Button
          label="Turn Red"
          handleButtonClicked={this.handleTurnRedButtonClicked}
        />
        <Button
          label="Turn Blue"
          handleButtonClicked={this.handleTurnBlueButtonClicked}
        />
        <Button
          label="Read Data"
          handleButtonClicked={this.handleReadDataButtonClicked}
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
