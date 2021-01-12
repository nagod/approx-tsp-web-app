//TODO look up how to export this properly so that it extends the global object math
export default class MathExtension {

    static euclideanDistance2D = function (x, y = { xPos: 0, yPos: 0 }) {
        return Math.sqrt(
            Math.pow(x.xPos - y.xPos, 2) + Math.pow(x.yPos - y.yPos, 2)
        );
    }

    static angle(x, y) {
        let scalar = this.dotProduct2D(this.normalize(x), this.normalize(y))
        return Math.acos(scalar) * 180 / Math.PI
    }

    static dotProduct2D(x, y) {
        return x.xPos * y.xPos + x.yPos * y.yPos;
    }

    static normalize(x) {
        let length = this.euclideanDistance2D(x);
        if (length === 0) {
            return x;
        } else {
            return {
                xPos: x.xPos / length,
                yPos: x.yPos / length,
            };
        }
    }

    // Returns true if point is on the left side of the vector xy
    static isLeft(point, x, y) {
        let a = { xPos: y.xPos - x.xPos, yPos: y.yPos - x.yPos }
        let b = { xPos: point.xPos - x.xPos, yPos: point.yPos - x.yPos }
        if ((a.xPos * b.yPos - a.yPos * b.xPos) > 0) {
            return true
        }
        return false
    }

    // https://calculator.swiftutors.com/circumcircle-of-a-triangle-calculator.html
    static circumCircleRadius(x1, x2, x3) {
        let a = this.euclideanDistance2D(x1, x2)
        let b = this.euclideanDistance2D(x1, x3)
        let c = this.euclideanDistance2D(x2, x3)
        let s = (a + b + c) / 2
        let result = (a * b * c) / (4 * Math.sqrt(s * (s - a) * (s - b) * (s - c)))
        return result
    }

    // Returns the polar angle of any vertex with p0 set as origin and vextor representing the x axis direction
    static calculatePolarAngle(p0, vertex, vector = { xPos: 1, yPos: 0 }) {
        let point = {
            xPos: vertex.xPos - p0.xPos,
            yPos: vertex.yPos - p0.yPos,
        };
        // p0 will from now on be represented by the x axis vector (1, 0)
        // normalized the point because acos only accepts [-1, 1] as domain
        let normalizedVector = this.normalize(vector)
        let normalizedPoint = this.normalize(point);
        let dotProduct = this.dotProduct2D(normalizedVector, normalizedPoint);
        let result = Math.acos(dotProduct);

        return result;
    }


}