import { Divider } from "@material-ui/core"
import "./Stylesheets/Console.css"
import React from "react"


export default class Console extends React.Component {

    // Generic Button

    static log = (message) => {
        let paragraph = document.getElementById("console")
        let oldMessage = paragraph.innerHTML
        oldMessage += "<br>" + message
        paragraph.innerHTML = oldMessage
        let div = document.getElementById("consoleId")
        div.scrollTop = div.scrollHeight;
    }

    render() {
        return (
            <div className="consoleDiv" id="consoleId">
                <p id="console" className="consoleParagraph">Welcome to the program.</p>
            </div>
        )
    }
}