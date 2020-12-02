class Vertex {

    constructor(xPos, yPos){
        
        this.xPos = xPos
        this.yPos = yPos
        this.incidentEdges = []
        this.getXPos = this.getXPos.bind(this)
        this.getYPos = this.getYPos.bind(this)
        this.getIncidentEdges = this.getIncidentEdges.bind(this)
        this.hasIncidentEdges = this.hasIncidentEdges.bind(this)
        this.removeAllEdges = this.removeAllEdges.bind(this)
    }

    getXPos(){
        return this.xPos
    }

    getYPos(){
        return this.yPos
    }

    getIncidentEdges(){
        return this.incidentEdges
    }

    hasIncidentEdges(){
        return this.incidentEdges.length == 0 ? false : true
    }

    // Check if throwing a string is the right thing to do here
    randomIncidentEdge(){
        if (!this.hasIncidentEdges()){
            throw "Vertex has no incident edges"
        }
            return this.incidentEdges[Math.floor(Math.random()*items.length)]
    }

    removeAllEdges() {
        this.incidentEdges = []
    }

}