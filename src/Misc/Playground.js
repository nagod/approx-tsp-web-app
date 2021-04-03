let array1 = [1, 2, 3, 4, 5, 6, 7, 8]
let array2 = [11, 66, 1552, 156324, 112]
let array3 = [1, 2, 11, 66, 1552, 156324, 112, 3, 4, 5, 6, 7, 8]

array1.splice(2, 0, [...array2])
array1.flat()
console.log("expect output: ", array3)
console.log(" Got: ", array1)