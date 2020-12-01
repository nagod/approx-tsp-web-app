import React from "react"

export default class Button extends React.Component{

    // Generic Button

    render(){
        return (
            <button onClick={() => this.props.handleButtonClicked()}>{this.props.label}</button>
        )
    }
}