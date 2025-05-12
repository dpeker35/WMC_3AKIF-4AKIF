function isPrime(num) {
    console.log("Now checking inside isPrime:", num); // <-- Add this line here
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}
