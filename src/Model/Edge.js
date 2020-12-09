export default class Edge {
  constructor(u, v) {
    this.u = u;
    this.v = v;
    this.lenth = this.calculateLength(this.u, this.v);
  }
  // edit
  calculateLength(u, v) {
    return Math.sqrt(u + v);
  }

  getU() {
    return this.u;
  }

  getV() {
    return this.v;
  }

  getLength() {
    return this.length;
  }
}
