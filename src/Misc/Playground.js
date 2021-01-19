let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

for (let number of numbers) {

    if (number % 2 === 0) {
        numbers.push(number + 11)
    } else {
        let index = numbers.indexOf(element => element === number)
        numbers = numbers.filter(element => element !== number)
        numbers = numbers.filter(element => element !== numbers[index + 1])


    }

}


let log = []
if (log) {
    console.log("Log")
}

console.log(numbers)

console.log("13, 15, 17, 19")