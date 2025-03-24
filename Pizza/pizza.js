class Pizza{
    constructor(name, preis, isVeggie){
        this.name = name;
        this.preis = preis;
        this.isVeggie = isVeggie;
}

}


let arr = []
arr.push(new Pizza("Salami", 8.5, false));
arr.push( new Pizza("Gemuse", 10.9, true));
arr.push(new Pizza("Margherita", 9.7, true));
arr.push(new Pizza("Funghi", 10.7, true));
arr.push(new Pizza("Prosciutto", 6.6, false));
arr.push(new Pizza("Quattro Formaggi", 6.7, true));


//compare function mit Name
function compare_price(pizza_a, pizza_b){
    return pizza_a.price - pizza_b.price
}
console.log("Pizzas: ", arr);

//umdrehen 
console.log("Pizza reversed:  ", arr);
pizzas.reverse();

//Array nach Preis sortieren
//arr.sort(pizza_a,pizza_b) => {
// return pizza_a.price - pizza_a.price;
//});
pizzas.sort(compare);
console.log("Pizza sorted price ", arr);


pizzas.sort((pizza_a, pizza_b) => pizza_a.name.localCompare(pizza_b.name));
console.log("Pizza sorted name ", pizzas);

let veg = pizzas.filter((pizza) => pizza.isVeggie);
console.log("Veggie Pizzas: ", veg);
