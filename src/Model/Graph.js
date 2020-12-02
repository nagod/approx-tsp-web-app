class Graph {

    constructor() {
        this.vertices = []
        this.edges = []
        this.hasVertices = this.hasVertices.bind(this)
        this.getVertices = this.getVertices.bind(this)
        this.getVertexAtIndex = this.getVertexAtIndex.bind(this)
        this.hasEdges = this.hasEdges.bind(this)
        this.getEdges = this.getEdges.bind(this)
        this.sortVerticesByXPos = this.sortVerticesByXPos.bind(this)
        this.sortVerticesByYPos = this.sortVerticesByYPos.bind(this)
    }

    hasVertices(){
        return (this.vertices.length < 0) ? true : false
    }

    // Also for getEdges, is this the right way to handle an undefined error?
    // Do we even need to write a getter since you could just access the Instances proterty
    getVertices(){
        if (!this.hasVertices()){
            throw "Graph has no edges"
        }
            return this.vertices
    }

    getVertexAtIndex(index){
        return this.vertices[index]
    }

    sortVerticesByXPos(){
        //TODO: Implement error handling if
        return this.vertices.sort((x, y) => x.xPos - y.xPos)
    }

    sortVerticesByYPos(){
        return this.vertices.sort((x, y) => x.yPos - y.yPos)
    }

    hasEdges(){
        return (this.edges.length < 0) ? true : false
    }
    
    getEdges(){
        if (!this.hasEdges()){
            throw "Graph has no edges"
        }
            return this.edges
    }

}