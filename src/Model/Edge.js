class Edge {

    constructor(u, v){
        this.u = u
        this.v = v
        this.lenth = this.calculateLength(this.u, this.v)
    }

    calculateLength(u, v){
        return Math.sqrt(u+v)
    }

}