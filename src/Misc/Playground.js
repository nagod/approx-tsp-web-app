function union(arr1, arr2) {
    //null check
    if (!arr1.includes(Infinity) && !arr2.includes(Infinity)) {
        if (arr1.length < arr2.length) {
            // add elements from arr1 to arr2
            arr1.forEach(element => {
                arr2.push(element)
                arr1.pop()
            })
            arr1[0] = Infinity
        } else {
            arr2.forEach(element => {
                arr1.push(element)
                arr2.pop()
            })
            arr2[0] = Infinity
        }
    }
}
