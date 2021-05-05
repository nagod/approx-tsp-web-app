import sum from '../Misc/Playground'
import Graph from '../Model/Graph'
import MathExtension from "../Extensions/MathExtension"

const graph = new Graph()
it("calculates right turned normal vector", () => {
    expect(graph.orthogonalVector({ xPos: 3, yPos: 7 })).toEqual({ xPos: 7, yPos: -3 })
    expect(graph.orthogonalVector({ xPos: -4, yPos: 5 })).toEqual({ xPos: 5, yPos: 4 })
    expect(graph.orthogonalVector({ xPos: -2, yPos: -12 })).toEqual({ xPos: -12, yPos: 2 })
    expect(graph.orthogonalVector({ xPos: 7, yPos: 1 })).toEqual({ xPos: 1, yPos: -7 })
});

it("calculates the dot product of two vectors", () => {
    expect(MathExtension.dotProduct2D({ xPos: 3, yPos: 7 }, { xPos: 7, yPos: -3 })).toEqual(0)
    expect(MathExtension.dotProduct2D({ xPos: -4, yPos: 5 }, { xPos: 5, yPos: 4 })).toEqual(0)
    expect(MathExtension.dotProduct2D({ xPos: -2, yPos: -12 }, { xPos: -12, yPos: 2 })).toEqual(0)
    expect(MathExtension.dotProduct2D({ xPos: 7, yPos: 1 }, { xPos: 1, yPos: -7 })).toEqual(0)
})

it("calculates polar angles", () => {
    expect(graph.calculatePolarAngle({ xPos: 0, yPos: 0 }, { xPos: 3, yPos: 4 })).toBeCloseTo(0.927)
    expect(graph.calculatePolarAngle({ xPos: 1, yPos: 2 }, { xPos: 6, yPos: 6 }, { xPos: -4, yPos: 7 })).toBeCloseTo(1.415)
    expect(graph.calculatePolarAngle({ xPos: -1, yPos: -2 }, { xPos: -6, yPos: -6 }, { xPos: 4, yPos: -7 })).toBeCloseTo(1.415)

})

it("tells tells you if a point is left from a vector", () => {
    expect(graph.isLeft({ xPos: 7, yPos: 7 }, { xPos: 0, yPos: 0 }, { xPos: 8, yPos: 7 })).toEqual(true)
    expect(graph.isLeft({ xPos: 0, yPos: 0 }, { xPos: -1, yPos: 1 }, { xPos: -1, yPos: 7 })).toEqual(false)

})

it("tells you the angle between to vectors in degree", () => {
    expect(MathExtension.angle({ xPos: 2, yPos: 5 }, { xPos: 9, yPos: 1 })).toBeCloseTo(61.858)

})