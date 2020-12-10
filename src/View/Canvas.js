import React from "react";
import Config from "../App/Config";
import "./Stylesheets/Canvas.css";

export default class Canvas extends React.Component {
    // use lifecycle method to assign property canvas, cant add Event Listener if DOM is not loaded yet
    constructor(props) {
        super();
        this.viewController = props.viewController;
        this.setupEventListeners = this.setupEventListeners.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.drawCircleAt = this.drawCircleAt.bind(this);
        this.printGraph = this.printGraph.bind(this);
        this.highlightConvexHull = this.highlightConvexHull.bind(this);
    }
    // Lifecycle functions
    componentDidMount() {
        this.setupCanvas();
        this.setupEventListeners();
    }

    // Setting up
    setupCanvas() {
        this.canvas = document.getElementById("mainCanvas");
        this.ctx = this.canvas.getContext("2d");
    }

    setupEventListeners() {
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvas.addEventListener("mousemove", this.handleMouseMove);
        this.canvas.addEventListener("mouseup", this.handleMouseUp);
        this.canvas.addEventListener("contextmenu", this.handleLeftMouseDown);
    }

    // Events

    handleMouseDown(event) {
        var mousePos = this.getMousePosition(event, this.canvas);
        this.viewController.presenter.graph.addVertexFromData(this.viewController.presenter.graph.vertices.length + 1, mousePos.x, mousePos.y)
        // delete draw
        this.drawCircleAt(mousePos.x, mousePos.y, Config.circleRadius);
    }

    handleMouseUp(event) {
        //var mousePos = this.getMousePosition(event, this.canvas);
        //console.log("recognized mouse up event at", mousePos);
    }

    handleMouseMove(event) {
        // var mousePos = this.getMousePosition(event, this.canvas);
        // console.log("regognized mouse move event to", mousePos);
    }

    handleLeftMouseDown(event) {
        alert("Left click is working")
    }

    // Functions
    getMousePosition(event, canvas) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    drawCircleAt(xPos, yPos, radius, color) {
        this.ctx.beginPath();
        this.ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = color
        this.ctx.fill()
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawEdgeBetweenPoints(x1Pos, y1Pos, x2Pos, y2Pos, color = Config.edegeDefaultColor) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineTo(x1Pos, y1Pos);
        this.ctx.lineTo(x2Pos, y2Pos);
        this.ctx.stroke();
        this.ctx.closePath();

    }
    drawEdgeBetweenVertices(edge, color = Config.edegeDefaultColor) {
        this.drawEdgeBetweenPoints(edge.vertexOne.xPos, edge.vertexOne.yPos, edge.vertexTwo.xPos, edge.vertexTwo.yPos)
    }

    printGraph() {
        try {
            this.viewController.presenter.graph.vertices.forEach(vertex => {
                this.drawCircleAt(vertex.xPos, vertex.yPos, Config.circleRadius, Config.standardColor)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    highlightConvexHull() {
        try {
            const set = this.viewController.presenter.graph.calculateConvexHull()
            set.forEach(vertex => {
                this.drawCircleAt(vertex.xPos, vertex.yPos, Config.circleRadius, "red")
            })
            //TESTING Code for Edges
            this.viewController.presenter.graph.connectConvexHull();
            this.viewController.presenter.graph.edges.forEach(element => {
                this.drawEdgeBetweenVertices(element)
            });
        } catch (error) {
            console.log(error.message)
        }
    }

    // Rendering

    render() {
        return (
            <div className="div">
                <canvas
                    id="mainCanvas"
                    className="mainCanvas"
                    width="500"
                    height="500"
                ></canvas>
                <button onClick={() => this.printGraph()}>Draw Graph</button>
                <button onClick={() => this.highlightConvexHull()}>Compute Convexhull</button>
            </div>
        );
    }
}
