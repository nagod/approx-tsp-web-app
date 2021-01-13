import Config from '../App/Config'

export default class Vertex {
    constructor(id, xPos, yPos) {
        this.id = id;
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = Config.defaultVertexColor
        this.triangles = [];
        this.getXPos = this.getXPos.bind(this);
        this.getYPos = this.getYPos.bind(this);
        this.getTriangles = this.getTriangles.bind(this);
        this.hasTriangles = this.hasTriangles.bind(this);
        this.removeTriangle = this.removeTriangle.bind(this)
        this.removeAllTriangles = this.removeAllTriangles.bind(this);
    }

    getXPos() {
        return this.xPos;
    }

    getYPos() {
        return this.yPos;
    }

    getTriangles() {
        return this.triangles;
    }

    hasTriangles() {
        return this.triangles.length === 0 ? false : true;
    }

    removeTriangle(triangle) {
        this.triangles = this.triangles.filter(element => element !== triangle)
    }

    // Check if throwing a string is the right thing to do here
    randomTriangle() {
        if (!this.hasTriangles()) {
            throw new Error({
                message: "Vertex has no adjacent triangles",
            });
        }
        return this.triangles[
            Math.floor(Math.random() * this.triangles.length)
        ];
    }

    removeAllTriangles() {
        this.triangles = [];
    }
}
