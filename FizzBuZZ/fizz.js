//schleife von 1 bis 100

for(let i=1; i<=100; i++) {

    let output = "";

    //Wenn durch 3 teilbar
    if(i % 3 === 0) output += "Fizz";

    //Wenn durch 5 teilbar
    if(i % 5 === 0) output += "Buzz";


    //wenn durch 7 teilbar
    if (i % 7 === 0) output += "Whizz";

    //wenn durch 11 teilbar
  if (i % 11 === 0) output += "Bang";


    //wenn nicht durch 3 oder 5 teilbar
    console.log(output || i);
}
