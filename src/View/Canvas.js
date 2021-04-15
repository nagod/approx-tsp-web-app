import React from "react";
import Config from "../App/Config";
import MathExtension from "../Extensions/MathExtension";
import "./Stylesheets/Canvas.css";

// Should implement notify function to be observer

export default class Canvas extends React.Component {
    // use lifecycle method to assign property canvas, cant add Event Listener if DOM is not loaded yet
    constructor(props) {
        super();
        this.viewController = props.viewController;
        this.scalingFactor = 1
        this.setupEventListeners = this.setupEventListeners.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.drawCircleAt = this.drawCircleAt.bind(this);
        this.drawTriangleCircumCircle = this.drawTriangleCircumCircle.bind(this)
        this.highlightConvexHull = this.highlightConvexHull.bind(this);
        this.renderingLoop = this.renderingLoop.bind(this)
        this.handleCircleButtonClicked = this.handleCircleButtonClicked.bind(this)
        this.showTriangles = false
        this.drawEdge = this.drawEdge.bind(this)
        this.drawEdgeWithIndex = this.drawEdgeWithIndex.bind(this)
        this.highlightFinalTours = this.highlightFinalTours.bind(this)
        this.subscribe = this.subscribe.bind(this)
        this.unsubscribe = this.unsubscribe.bind(this)
        this.clearCanvas = this.clearCanvas.bind(this)

    }

    // Lifecycle functions
    componentDidMount() {
        this.setupCanvas();
        this.setupEventListeners();
        this.subscribe();
        window.requestAnimationFrame(this.renderingLoop)
    }

    componentWillUnmount() {
    }

    // Setting up
    setupCanvas() {
        this.canvas = document.getElementById("mainCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.viewController.setState({ canvas: this.canvas })
        this.viewController.setState({ context: this.ctx })
    }

    setupEventListeners() {
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        //this.canvas.addEventListener("mousemove", this.handleMouseMove);
        //this.canvas.addEventListener("mouseup", this.handleMouseUp);
        this.canvas.addEventListener("contextmenu", this.handleRightMouseDown);
    }


    // Observer patterns

    subscribe() {
        this.viewController.presenter.graph.subscribe(this)
        this.viewController.presenter.subscribe(this)
    }

    unsubscribe() {
        this.viewController.presenter.graph.unsubscribe(this)
        this.viewController.unsubscribe(this)
    }

    notify(identifier, data) {
        console.log("received notification with data: ", data)
        switch (identifier) {
            case "scalingNotification":
                this.handleScalingNotification(data)
                break
            case "clear":
                this.clearCanvas()
                break
            case "editMode":
                console.log(data)
                break
            default:
                console.log("Could not identify notification identifier with data", data)
                break
        }
    }


    handleScalingNotification(data) {
        console.log("Got notification with scaling factor!", data)
        // do something
        // Now you got the new scaling factor or something else in data, update the scaling respectively
        let scaleBack = 1 / this.scalingFactor
        this.ctx.scale(scaleBack, scaleBack)
        let canvas = document.getElementById("mainCanvas")
        let rect = canvas.getBoundingClientRect();
        let width = rect.width - 70
        let height = rect.height - 70
        let factor = 0
        let maxX = data[0]
        let maxY = data[1]
        console.log("Width: ", width, "Height: , ", height)
        if ((width / maxX) < (height / maxY)) {
            factor = width / maxX
        } else {
            factor = height / maxY
        }
        factor = Math.ceil(factor)
        this.fontSize = this.fontSize / factor
        this.scalingFactor = factor
        this.ctx.scale(factor, factor)

    }

    clearCanvas() {
        this.canvas = document.getElementById("mainCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.clearRect(0, 0, Config.defaultCanvasWidth, Config.defaultCanvasHeight);
    }

    // Rendering the animation frames
    renderingLoop(timeStamp) {
        // Update game objects in the loop
        this.draw();
        window.requestAnimationFrame(this.renderingLoop);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        if (this.viewController.presenter.graph.vertices.length > 0) {
            this.drawGraph(this.viewController.presenter.graph)
        }
    }


    // Events

    handleMouseDown(event) {
        let mousePos = this.getMousePosition(event);
        let mode = this.viewController.state.editMode

        for (let vertex of this.viewController.presenter.graph.vertices) {
            if (this.isIntersect(mousePos, vertex)) {
                if (mode === "erase") {
                    this.viewController.presenter.graph.deleteVertex(vertex)
                }
                console.log("recognized one click")
                this.currentVertex = vertex
                this.canvas.addEventListener("mousemove", this.handleMouseMove);
                this.canvas.addEventListener("mouseup", this.handleMouseUp)

                return
            }
        }

        //this.viewController.presenter.graph.addVertexFromData(this.viewController.presenter.graph.vertices.length + 1, mousePos.x, mousePos.y)
        //@TODO
        this.viewController.presenter.graph.addVertex(this.viewController.presenter.graph.vertices.length + 1, mousePos.x, mousePos.y)

    }

    handleMouseUp(event) {
        this.canvas.removeEventListener("mousemove", this.handleMouseMove)
        this.canvas.removeEventListener("mouseup", this.handleMouseUp)
    }

    handleMouseMove(event) {
        let mousePos = this.getMousePosition(event)
        this.currentVertex.xPos = mousePos.x
        this.currentVertex.yPos = mousePos.y
    }

    handleRightMouseDown(event) {
        alert("Right click is working")
    }

    // Functions
    getMousePosition(event, canvas = this.canvas) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) / this.scalingFactor,
            y: (event.clientY - rect.top) / this.scalingFactor
        };
    }

    // Collision detection
    isIntersect(point, vertex) {
        return Math.sqrt((point.x - vertex.xPos) ** 2 + (point.y - vertex.yPos) ** 2) < Config.circleRadius / this.scalingFactor;
    }


    // Drawing

    drawGraph(graph) {
        graph.vertices.forEach(vertex => this.drawVertex(vertex))

        graph.edges.forEach((edge, index) => this.drawEdgeWithIndex(edge, index))
        if (this.showTriangles) {
            graph.triangles.forEach(triangle => this.drawTriangleCircumCircle(triangle))
        }
        //graph.orthogonale.forEach(orthogonale => this.drawEdge(new Edge(orthogonale[0], { xPos: orthogonale[0].xPos + orthogonale[1].xPos, yPos: orthogonale[0].yPos + orthogonale[1].yPos })))
        //this.drawCircleAt(graph.circle[0].xPos, graph.circle[0].yPos, graph.circle[1])
    }

    drawVertex(vertex) {
        let radius = Config.circleRadius / this.scalingFactor
        this.ctx.beginPath();
        this.ctx.arc(vertex.xPos, vertex.yPos, radius, 0, 2 * Math.PI);
        this.ctx.font = "12px Helvetica Bold";
        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.fillText(vertex.id, vertex.xPos, vertex.yPos)
        this.ctx.lineWidth = 1 / this.scalingFactor
        this.ctx.strokeStyle = Config.defaultVertexBorderColor
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawCircleAt(xPos, yPos, radius = Config.circleRadius, color = Config.defaultVertexColor) {
        this.ctx.beginPath();
        radius /= this.scalingFactor
        this.ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI);
        this.ctx.lineWidth = 3 / this.scalingFactor
        this.ctx.strokeStyle = Config.defaultVertexBorderColor
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawEdge(edge) {
        this.drawEdgeBetweenPoints(edge.vertexOne.xPos, edge.vertexOne.yPos, edge.vertexTwo.xPos, edge.vertexTwo.yPos, edge.color)
    }

    drawEdgeWithIndex(edge, index) {
        this.drawEdgeBetweenPoints(edge.vertexOne.xPos, edge.vertexOne.yPos, edge.vertexTwo.xPos, edge.vertexTwo.yPos, edge.color)
        if (this.viewController.state.distanceToggle) {
            let halfway = { xPos: (edge.vertexOne.xPos + edge.vertexTwo.xPos) / 2, yPos: (edge.vertexOne.yPos + edge.vertexTwo.yPos) / 2 }
            this.drawIndexAtPosition(new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(edge.length), halfway)
        }

    }

    drawIndexAtPosition(index, position) {
        // Do something at postition
        this.ctx.font = "12px Helvetica"
        this.ctx.fillText(index, position.xPos, position.yPos)
    }

    drawEdgeBetweenPoints(x1Pos, y1Pos, x2Pos, y2Pos, color = Config.defaultEdgeColor) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineTo(x1Pos, y1Pos);
        this.ctx.lineTo(x2Pos, y2Pos);
        this.ctx.lineWidth = 1 / this.scalingFactor
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawTriangleCircumCircle(triangle) {
        let circumCircleCenter = MathExtension.circumCircleCenter(triangle.vertexOne, triangle.vertexTwo, triangle.vertexThree)
        this.drawCircleAt(circumCircleCenter.xPos, circumCircleCenter.yPos, circumCircleCenter.radius)
    }


    // Obsolete function? 
    handleCircleButtonClicked() {
        this.showTriangles = !this.showTriangles
    }


    highlightTour(tour, color) {
        for (let i = 0; i < tour.length; i++) {
            if (i === tour.length - 1) {
                let nodeA1 = tour[i]
                let nodeA2 = tour[0]
                try {
                    let edge = this.viewController.presenter.graph.edgeWithEndpointsById(nodeA1, nodeA2)
                    edge.color = color
                } catch {
                    let v1 = this.viewController.presenter.graph.getVertexWithID(nodeA1.id)
                    let v2 = this.viewController.presenter.graph.getVertexWithID(nodeA2.id)
                    this.viewController.presenter.graph.addEdge(v1, v2, color)
                }
            } else {
                let nodeA1 = tour[i]
                let nodeA2 = tour[i + 1]
                try {
                    let edge = this.viewController.presenter.graph.edgeWithEndpointsById(nodeA1, nodeA2)
                    edge.color = color
                } catch {
                    let v1 = this.viewController.presenter.graph.getVertexWithID(nodeA1.id)
                    let v2 = this.viewController.presenter.graph.getVertexWithID(nodeA2.id)
                    this.viewController.presenter.graph.addEdge(v1, v2, color)
                }
            }
        }
    }

    highlightFinalTours() {
        this.highlightTour(this.viewController.presenter.graph.shortestTour, "green")
        this.highlightTour(this.viewController.presenter.graph.initialTour, "blue")
    }


    highlightConvexHull() {
        try {
            this.viewController.presenter.graph.notify("hello")
            const set = this.viewController.presenter.graph.calculateConvexHull()
            set.forEach(vertex => {
                this.drawCircleAt(vertex.xPos, vertex.yPos, Config.circleRadius, "red")
            })
            // TESTING Code for Edges
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
                    width={Config.defaultCanvasWidth}
                    height={Config.defaultCanvasHeight}
                ></canvas>
            </div>
        );
    }
}
