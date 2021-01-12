export default class Vertex {
    constructor(id, xPos, yPos) {
        this.id = id;
        this.xPos = xPos;
        this.yPos = yPos;
        this.adjacentEdges = [];
        this.getXPos = this.getXPos.bind(this);
        this.getYPos = this.getYPos.bind(this);
        this.getAdjacentEdges = this.getAdjacentEdges.bind(this);
        this.hasAdjacentEdges = this.hasAdjacentEdges.bind(this);
        this.removeAllEdges = this.removeAllEdges.bind(this);
    }

    getXPos() {
        return this.xPos;
    }

    getYPos() {
        return this.yPos;
    }

    getAdjacentEdges() {
        return this.adjacentEdges;
    }

    hasAdjacentEdges() {
        return this.adjacentEdges.length === 0 ? false : true;
    }

    // Check if throwing a string is the right thing to do here
    randomAdjacentEdge() {
        if (!this.hasAdjacentEdges()) {
            throw new Error({
                message: "Vertex has no adjacent edges",
            });
        }
        return this.adjacentEdges[
            Math.floor(Math.random() * this.adjacentEdges.length)
        ];
    }

    removeAllEdges() {
        this.adjacentEdges = [];
    }
}
