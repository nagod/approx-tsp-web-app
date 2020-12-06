import React from "react"
import Config from "../App/Config"
import './Stylesheets/Canvas.css'

export default class Canvas extends React.Component{


    // use lifecycle method to assign property canvas, cant add Event Listener if DOM is not loaded yet
    constructor(){
        super()
        //this.setupEventListeners = this.setupEventListeners.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.drawCircleAt = this.drawCircleAt.bind(this)
    }

    // Lifecycle functions

    componentDidMount(){
        console.log("CanvasComponentDidMount")
        this.setupCanvas()
        this.setupEventListeners()
    }
    
    // Setting up

    setupCanvas(){
        this.canvas = document.getElementById("mainCanvas")
        this.ctx = this.canvas.getContext("2d")
    }

    setupEventListeners(){
        console.log(this.canvas)
        this.canvas.addEventListener("mousedown", this.handleMouseDown)
        this.canvas.addEventListener("mousemove", this.handleMouseMove)
        this.canvas.addEventListener("mouseup", this.handleMouseUp)
    }

    // Functions

    getMousePosition(event, canvas) {
        var rect = canvas.getBoundingClientRect()
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        }
    }

    drawCircleAt(xPos, yPos, radius){
        this.ctx.beginPath()
        this.ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI)
        this.ctx.stroke()
    }

    // Events

    handleMouseDown(event){
        var mousePos = this.getMousePosition(event, this.canvas)
        this.drawCircleAt(mousePos.x, mousePos.y, Config.circleRadius)
    }

    handleMouseUp(event){
        var mousePos = this.getMousePosition(event, this.canvas)
        console.log("recognized mouse up event at", mousePos)
    }

    handleMouseMove(event){
        var mousePos = this.getMousePosition(event, this.canvas)
        //console.log("regognized mouse move event to", mousePos)
    }

    // Rendering

    render(){
        return (
            <canvas id="mainCanvas" className="mainCanvas" width="500" height="500"></canvas>
        )
    }
}