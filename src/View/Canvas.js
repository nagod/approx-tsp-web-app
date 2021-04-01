import React from "react";
import Config from "../App/Config";
import MathExtension from "../Extensions/MathExtension";
import Edge from "../Model/Edge";
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

    }

    // Lifecycle functions
    componentDidMount() {
        this.setupCanvas();
        this.setupEventListeners();
        window.requestAnimationFrame(this.renderingLoop)
    }

    componentWillUnmount() {
    }

    // Setting up
    setupCanvas() {
        this.canvas = document.getElementById("mainCanvas");
        this.ctx = this.canvas.getContext("2d");
        //this.ctx.scale(19, 19)
        //this.scalingFactor *= Math.ceil(11)
    }

    setupEventListeners() {
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        //this.canvas.addEventListener("mousemove", this.handleMouseMove);
        //this.canvas.addEventListener("mouseup", this.handleMouseUp);
        this.canvas.addEventListener("contextmenu", this.handleRightMouseDown);
    }

    // Rendering the animation frames

    renderingLoop(timeStamp) {
        // Update game objects in the loop
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

        //this.viewController.presenter.graph.addVertexFromData(this.viewController.presenter.graph.vertices.length + 1, mousePos.x, mousePos.y)
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
        //alert("Right click is working")
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
        this.ctx.font = "24px Helvetica Bold";
        this.ctx.fillText(vertex.id, vertex.xPos - 4, vertex.yPos + 4)
        //this.ctx.fillStyle = vertex.color
        //this.ctx.fill()
        this.ctx.lineWidth = 1 / this.scalingFactor
        this.ctx.strokeStyle = Config.defaultVertexBorderColor
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawCircleAt(xPos, yPos, radius = Config.circleRadius, color = Config.defaultVertexColor) {
        this.ctx.beginPath();
        radius /= this.scalingFactor
        this.ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI);
        //this.ctx.fillStyle = color
        //this.ctx.fill()
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
        let halfway = { xPos: (edge.vertexOne.xPos + edge.vertexTwo.xPos) / 2, yPos: (edge.vertexOne.yPos + edge.vertexTwo.yPos) / 2 }
        this.drawIndexAtPosition(new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(edge.length), halfway)
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
