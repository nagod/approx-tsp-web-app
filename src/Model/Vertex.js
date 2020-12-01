class Vertex {

    constructor(xPos, yPos){
        
        this.xPos = xPos
        this.yPos = yPos
        this.incidentEdges = []

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


}