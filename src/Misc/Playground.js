let array = [1, 2, 3, 4]

for (let n of array) {
    if (n > 1 && n < 3) {
        array.push(Math.pow(n, 2))
    }
    console.log(n)
}