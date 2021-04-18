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
                drawElement.setAttribute("fill", "#cccccc")
                eraseElement.setAttribute("fill", "#4B6FFF")
                this.props.action("erase")

            } else if (e.currentTarget.id === "draw") {
                drawElement.setAttribute("fill", "#4B6FFF")
                eraseElement.setAttribute("fill", "#cccccc")
                this.props.action("draw")
            }
        }


        return (
            <div className="icons">
                <svg
                    className="eraser"
                    id="erase"
                    viewBox="0 0 24 24"
                    fill="#cccccc"
                    height="2em"
                    width="2em"
                    onClick={handle}
                    cursor="pointer"
                >
                    <path d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 01-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0M4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53-4.95-4.95-4.95 4.95z" />
                </svg>

                <svg
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
            </div>
        )
    }
}