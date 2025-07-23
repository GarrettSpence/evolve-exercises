// Question 1
function findEvenDivisibleNumbers(num1, num2) {
    const lowest = Math.min(num1, num2);
    const highest = Math.max(num1, num2);
    
    const result = [];
    
    // from 2 to highest
    // can increment by 2 because only looking at even numbers
    for (let i = 2; i <= highest; i += 2) {
        // Check if the even number is divisible by the lowest value
        if (i % lowest === 0) {
            result.push(i);
        }
    }
    
    // optional: print result arr
    // console.log(result.join(', '));
    
    return result;
}
