import React from "react"
import './Stylesheets/Icons.css'
export default class Icons extends React.Component {

    constructor() {
        super();
        this.state = {
            active: "draw"
        }
    }
    render() {
        const handle = (e) => {
            let drawElement = document.getElementById("draw")
            let eraseElement = document.getElementById("erase")

            if (e.currentTarget.id === "erase") {
                drawElement.setAttribute("fill", "#767878")
                console.log(eraseElement.getAttribute("fill"), "to")
                eraseElement.setAttribute("fill", "#4B6FFF")
                console.log(eraseElement.getAttribute("fill"))
                this.props.action("erase")

            } else if (e.currentTarget.id === "draw") {
                drawElement.setAttribute("fill", "#4B6FFF")
                eraseElement.setAttribute("fill", "#767878")
                this.props.action("draw")
            }

        }

        return (
            <div className="icons">
                <svg
                    className="eraser"
                    id="erase"
                    viewBox="0 0 24 24"
                    fill="#767878"
                    height="28px"
                    width="28px"
                    onClick={handle}
                    cursor="pointer"
                >
                    <path d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 01-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0M4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53-4.95-4.95-4.95 4.95z" />
                </svg>

                <svg
                    className="pencil"
                    id="draw"
                    fill="#4B6FFF"
                    viewBox="0 0 24 24"
                    height="28px"
                    width="28px"
                    onClick={handle}
                    cursor="pointer"
                >
                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
            </div >
        )
    }
}