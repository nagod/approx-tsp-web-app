import React from "react"
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
                eraseElement.setAttribute("fill", "#4B6FFF")
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
                    height="1.8em"
                    width="1.7em"
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
                    height="1.7em"
                    width="1.9em"
                    onClick={handle}
                    cursor="pointer"
                >
                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
            </div >
        )
    }
}
/**
 *
 *       <svg
                    className="pencil"
                    id="draw"
                    fill="#4B6FFF"
                    viewBox="0 0 16 16"
                    height="2em"
                    width="2em"
                    onClick={handle}
                    cursor="pointer"
                >
                    <path
                        fillRule="evenodd"
                        d="M12.146.146a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-10 10a.5.5 0 01-.168.11l-5 2a.5.5 0 01-.65-.65l2-5a.5.5 0 01.11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 01.5.5v.5h.5a.5.5 0 01.5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 015 12.5V12h-.5a.5.5 0 01-.5-.5V11h-.5a.5.5 0 01-.468-.325z"
                    />
                </svg>
 */