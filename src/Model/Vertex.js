export default class Vertex {
    constructor(id, xPos, yPos) {
        this.id = id;
        this.xPos = xPos;
        this.yPos = yPos;
        this.incidentEdges = [];
        this.getXPos = this.getXPos.bind(this);
        this.getYPos = this.getYPos.bind(this);
        this.getIncidentEdges = this.getIncidentEdges.bind(this);
        this.hasIncidentEdges = this.hasIncidentEdges.bind(this);
        this.removeAllEdges = this.removeAllEdges.bind(this);
    }

    getXPos() {
        return this.xPos;
    }

    getYPos() {
        return this.yPos;
    }

    getIncidentEdges() {
        return this.incidentEdges;
    }

    hasIncidentEdges() {
        return this.incidentEdges.length === 0 ? false : true;
    }

    // Check if throwing a string is the right thing to do here
    randomIncidentEdge() {
        if (!this.hasIncidentEdges()) {
            throw new Error({
                message: "Vertex has no incident edges",
            });
        }
        return this.incidentEdges[
            Math.floor(Math.random() * this.incidentEdges.length)
        ];
    }

    removeAllEdges() {
        this.incidentEdges = [];
    }
}
