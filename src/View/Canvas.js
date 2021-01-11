import React from "react";
import Config from "../App/Config";
import Edge from "../Model/Edge";
import "./Stylesheets/Canvas.css";

// Should implement notify function to be observer

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
        this.renderingLoop = this.renderingLoop.bind(this)
    }
    // Lifecycle functions
    componentDidMount() {
        this.setupCanvas();
        this.setupEventListeners();
        this.subscribe()
        window.requestAnimationFrame(this.renderingLoop)
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    // Setting up
    setupCanvas() {
        this.canvas = document.getElementById("mainCanvas");
        this.ctx = this.canvas.getContext("2d");
    }

    setupEventListeners() {
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        //this.canvas.addEventListener("mousemove", this.handleMouseMove);
        //this.canvas.addEventListener("mouseup", this.handleMouseUp);
        this.canvas.addEventListener("contextmenu", this.handleRightMouseDown);
    }

    subscribe() {
        this.viewController.presenter.graph.subscribe(this)
    }

    unsubscribe() {
        this.viewController.presenter.graph.unsubscribe(this)
    }

    // Rendering the animation frames

    renderingLoop(timeStamp) {
        // Update game objects in the loop
        //update();
        this.draw();

        window.requestAnimationFrame(this.renderingLoop);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawGraph(this.viewController.presenter.graph)
    }


    // Events

    handleMouseDown(event) {
        let mousePos = this.getMousePosition(event);

        for (let vertex of this.viewController.presenter.graph.vertices) {
            if (this.isIntersect(mousePos, vertex)) {
                console.log("recognized one click")
                this.currentVertex = vertex
                this.canvas.addEventListener("mousemove", this.handleMouseMove);
                this.canvas.addEventListener("mouseup", this.handleMouseUp)

                return
            }
        }

        this.viewController.presenter.graph.addVertexFromData(this.viewController.presenter.graph.vertices.length + 1, mousePos.x, mousePos.y)

    }

    handleMouseUp(event) {
        this.canvas.removeEventListener("mousemove", this.handleMouseMove)
        this.canvas.removeEventListener("mouseup", this.handleMouseUp)
        //var mousePos = this.getMousePosition(event, this.canvas);
        //console.log("recognized mouse up event at", mousePos);
    }

    handleMouseMove(event) {
        let mousePos = this.getMousePosition(event)
        this.currentVertex.xPos = mousePos.x
        this.currentVertex.yPos = mousePos.y
        // var mousePos = this.getMousePosition(event, this.canvas);
        // console.log("regognized mouse move event to", mousePos);
    }

    handleRightMouseDown(event) {
        alert("Right click is working")
    }

    // Notifications

    notify(identifier, data) {
        //console.log("received notification with data: ", data)
        switch (identifier) {
            case "vertexAddedNotification":
                this.handleVertexAddedNotification(data)
                break
            case "vertexDeletedNotification":
                this.handleVertexDeletedNotification(data)
                break
            case "edgeAddedNotification":
                this.handleEdgeAddedNotification(data)
                break
            case "edgeDeletedNotification":
                this.handleEdgeDeletedNotification(data)
                break
            default:
                console.log("Could not identify notification identifier with data", data)
                break
        }
    }

    handleVertexAddedNotification(data) {
        // do something
        //console.log("received new vertex added notification")
        //this.drawCircleAt(data.xPos, data.yPos)
    }

    handleVertexDeletedNotification(data) {
        // do something
        //console.log("received new vertex deleted notification")
    }

    handleEdgeAddedNotification(data) {
        // do something
        //console.log("received new edge added notification")
    }

    handleEdgeDeletedNotification(data) {
        // do something
        //console.log("received new edge deleted notification")
    }

    // Functions
    getMousePosition(event, canvas = this.canvas) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    // Collision detection

    isIntersect(point, vertex) {
        return Math.sqrt((point.x - vertex.xPos) ** 2 + (point.y - vertex.yPos) ** 2) < Config.circleRadius;
    }


    // Drawing

    drawGraph(graph) {
        graph.vertices.forEach(vertex => this.drawVertex(vertex))
        graph.edges.forEach(edge => this.drawEdge(edge))
        //graph.orthogonale.forEach(orthogonale => this.drawEdge(new Edge(orthogonale[0], { xPos: orthogonale[0].xPos + orthogonale[1].xPos, yPos: orthogonale[0].yPos + orthogonale[1].yPos })))
        //this.drawCircleAt(graph.circle[0].xPos, graph.circle[0].yPos, graph.circle[1])
    }

    drawVertex(vertex, color = Config.defaultVertexColor) {
        this.ctx.beginPath();
        this.ctx.arc(vertex.xPos, vertex.yPos, Config.circleRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = color
        this.ctx.fill()
        this.ctx.strokeStyle = Config.defaultVertexBorderColor
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawCircleAt(xPos, yPos, radius = Config.circleRadius, color = Config.defaultVertexColor) {
        this.ctx.beginPath();
        this.ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = color
        //this.ctx.fill()
        this.ctx.strokeStyle = Config.defaultVertexBorderColor
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawEdge(edge, color = Config.defaultEdgeColor) {
        this.drawEdgeBetweenPoints(edge.vertexOne.xPos, edge.vertexOne.yPos, edge.vertexTwo.xPos, edge.vertexTwo.yPos, color)
    }

    drawEdgeBetweenPoints(x1Pos, y1Pos, x2Pos, y2Pos, color = Config.defaultEdgeColor) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineTo(x1Pos, y1Pos);
        this.ctx.lineTo(x2Pos, y2Pos);
        this.ctx.lineWidth = 3
        this.ctx.stroke();
        this.ctx.closePath();

    }

    printGraph() {
        try {
            this.viewController.presenter.graph.vertices.forEach(vertex => {
                this.drawCircleAt(vertex.xPos, vertex.yPos)
            })
        } catch (error) {
            console.log(error.message)
        }
    }


    // obsolete function? 

    highlightConvexHull() {
        try {
            this.viewController.presenter.graph.notify("hello")
            const set = this.viewController.presenter.graph.calculateConvexHull()
            set.forEach(vertex => {
                this.drawCircleAt(vertex.xPos, vertex.yPos, Config.circleRadius, "red")
            })
            //TESTING Code for Edges
            // Comment: Please try to push only clean code
            this.viewController.presenter.graph.connectConvexHull();
            this.viewController.presenter.graph.edges.forEach(element => {
                this.drawEdge(element)
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
                    width="1200"
                    height="750"
                ></canvas>
                <button onClick={() => this.printGraph()}>Draw Graph</button>
                <button onClick={() => this.highlightConvexHull()}>Compute Convexhull</button>
            </div>
        );
    }
}
