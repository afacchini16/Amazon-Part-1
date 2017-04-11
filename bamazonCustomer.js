var inquirer = require('inquirer');
var mysql = require('mysql');
var productAndIdArray = [];
var quantityRemaining = 0;
var numOfItems;

var connection = mysql.createConnection({
host: "localhost",
port: 3306,

user:"root",
password: "",

database: "Bamazon"
});

connection.connect(function(error){
    if (error) {
        console.log("ERROR: " + error);
    }
});

function showItems() {
    connection.query("SELECT * FROM products", function(error, results){
        if (error) throw error;
       
        else {
        for (i = 0; i < results.length; i++){
            console.log("Item id: " + results[i].item_id);
            console.log("Product Name: " + results[i].product_name);
            console.log("Price: $" + results[i].price + "\n");

            productAndIdArray.push(results[i].item_id.toString() + ": " + results[i].product_name); 
            // for (i = 0; i < results[i].price.length; i++){
            //     price = []
            // }     
                  
         }
        askQuestions(productAndIdArray);
        }
    });
}

function addCommas(results){
    // console.log(results[i].price.toString());
    var priceArray = results[i].price.toString().split("");
    // console.log(priceArray);
    // console.log(priceArray[2]);

    if (priceArray.length > 3){
    for (i = priceArray.length; i >= 0; i - 3){
        // console.log(priceArray[i]);
        }   
    }
}

function askQuestions(productAndIdArray){
    // console.log(productAndIdArray);
    inquirer.prompt([
        {
            name: "productToBuy",
            message: "Which product would you like to buy?",
            type: "list",
            choices: productAndIdArray
        },
        {
            name: "quantity",
            message: "How many would you like to purchase?"
        }
    ]).then(function(answer){
            var productId = answer.productToBuy.split(":");
            productId = productId[0];

            var quantityToPurchase = answer.quantity;
            // console.log("Quantity: " + quantityToPurchase);
            quantityRemaining = retrieveNumOfItemsLeft(productId);
            console.log("Remaining: " + quantityRemaining);
            console.log(typeof(quantityRemaining));
            updateQuantity(quantityToPurchase, productId, quantityRemaining);
        
    });
}

function retrieveNumOfItemsLeft(productId){
    console.log("typeof productId: " + typeof(parseInt(productId)));
    // var numOfItems;
    connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", [parseInt(productId)]
    , function(error, result){
        if (error) {
            console.log("ERROR: " + error);
        }
        
                // console.log("Num left: " + JSON.stringify(result[0].stock_quantity));
                // console.log("Num left: " + (result[0].stock_quantity));   
        numOfItems = result[0].stock_quantity;
        console.log("numOfItems: " + numOfItems);  
        
    });
    console.log("numOfItems before return : " + numOfItems);
    return numOfItems;
}

function updateQuantity(quantityToPurchase, productId, quantityRemaining){
    console.log("Product ID: " + productId);
    console.log("Quantity to purcahse: " + quantityToPurchase);
    console.log("Quantity remaining: " + quantityRemaining);
    var subtractedQuantity = quantityRemaining - quantityToPurchase;
    console.log("typeof(subtractedQuantity): " + typeof(subtractedQuantity) + ", subtractedQuantity: " + subtractedQuantity);
    console.log(quantityRemaining);
    console.log(quantityToPurchase);
    connection.query("UPDATE products SET ? WHERE ?", 
    [{
        stock_quantity: parseInt(subtractedQuantity)
    },
    {
        item_id: parseInt(productId)
    }]
    ,function(error, result){
        if (error){
            console.log("ERROR: " + error);
        }
        else {
            console.log("else statement in updateQuantity()");
        console.log(result);
        }
    });
}

showItems();

// inquirer.prompt([
//     {
//         name: ""

//     }
// ])