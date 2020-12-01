//
// ViewController of main module. Inhibits all views and notifies the presenter of any event.
//





import React from "react"
import Button from "../View/Button"
import MainPresenter from "../Presenter/MainPresenter"

export default class MainViewController extends React.Component {

    constructor(){

        super()
        this.presenter = new MainPresenter(this) // Presenter takes care of app logic

        // Bind this to function so that "this" refers to this object
        this.handleTurnRedButtonClicked = this.handleTurnRedButtonClicked.bind(this)
        this.handleTurnBlueButtonClicked = this.handleTurnBlueButtonClicked.bind(this)
    }

    // Handling events

    handleTurnRedButtonClicked(){
        this.presenter.handleTurnRedButtonClicked()
    }

    handleTurnBlueButtonClicked(){
        this.presenter.handleTurnBlueButtonClicked()
    }


    // Changing the View Functions

    turnViewRed(){
        document.getElementById("blackText").style.color = "red"
    }

    turnViewBlue(){
        document.getElementById("blackText").style.color = "blue"
    }

    render() {

        return(
            <div>
                <Button label="Turn Red" handleButtonClicked={this.handleTurnRedButtonClicked}/>
                <Button label="Turn Blue" handleButtonClicked={this.handleTurnBlueButtonClicked} />
                <h1 id="blackText">black text</h1>
            </div>
        )
    }

}