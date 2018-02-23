var errorCountCompare = 5;	// Limit to number of times ajaxGet() is run for compare
var backStore;	// temporary variable used to hold most recent product information

/* Success case for AJAX request during checkout */
function compare(response) {
	backStore = JSON.parse(response);	// pulls data from back store for verification for quantity only
	console.log("Backstore products");
	console.log(backStore);	
	console.log("Begin comparing");
	checkStock();
}

/* Error case for AJAX request during checkout */
function compareError(error){
	var timeoutHandlerCompare = function(){
		if(errorCountCompare > 0){
			console.log("Before, count is " + errorCountCompare);
			ajaxGet("http://localhost:5000/products", compare, compareError);
			errorCountCompare -= 1;		
			console.log("After, count is " + errorCountCompare);			
		}
	}
	setTimeout(timeoutHandlerCompare, 1000);
}

/* Checks to see if products are available in stock and prices are the most updated */
function checkStock() {
	var productStockError = {};
	var stockFlag = false;
	var productPriceError = [];
	var priceFlag = false;
	var post = true;

	/* Checks if products are available in stock */
	function checkProduct(productName, cartQuantity) {
		var storeQuantity = backStore[productName].quantity
		if(cartQuantity <= storeQuantity) {
			console.log("AVAILABLE. CART QTY: " + cartQuantity + ", STORE QTY: " + storeQuantity);
		} else {
			console.log("UNAVAILABLE. CART QTY: " + cartQuantity + ", STORE QTY: " + storeQuantity);
			productStockError[productName] = storeQuantity;
			stockFlag = true;
			post = false;
		}

	}

	/* Checks is the prices are the most updated */
	function checkPrice(productName, cartPrice) {
		var storePrice = backStore[productName].price;
		if(cartPrice == storePrice) {
			console.log("PRICE MATCHES. CART PRICE: " + cartPrice + ", STORE PRICE: " + storePrice);
		} else {
			console.log("PRICE DOESN'T MATCH. CART PRICE: " + cartPrice + ", STORE PRICE: " + storePrice);
			productPriceError.push(productName);
			priceFlag = true;
			post = false;
		}
	}

	/* Performs checks */
	for(var key in cart) {
		checkProduct(key, cart[key]);
		checkPrice(key, products[key].price);
	}

	/* POST request to update backstore products if successful checkout */ 
	if(post == true) {
		ajaxPost("http://localhost:5000/checkout");
	}

	/* Updates cart quantity to the available amount in stock */
	if(stockFlag == true) {
		var result = "The following product(s) is/are unavailable and have been updated accordingly: \n";
		for(var prod in productStockError) {
			result = result + prod + "\n";
		}
		alert(result);

		for(var key in productStockError) {
			cart[key] = productStockError[key];
			if(productStockError[key] == 0) {
				delete cart[key];
			}
		}
		console.log("UPDATED CART: ");
		console.log(cart);
	}

	/* Updates out-of-date prices */
	if(priceFlag == true) {
		var result = "The following product(s) prices have changed: \n";
		for(var i = 0; i < productPriceError.length; i++) {
			result = result + productPriceError[i] + "\n"
		}
		alert(result);
		ajaxGet("http://localhost:5000/products", compare, compareError);	//update prices
		products = backStore;
		// console.log("UPDATED PRICE: ");
		// console.log(products);
		alertTotalPrice();
	}

	console.log("DONE");
	showCart();
	updateTotalPrice();
}

/* Alerts the total amount due */
function alertTotalPrice() {
	var totalCost = 0;
	for(var key in cart) {
		//console.log("KEY: " + key);
		totalCost += computeNetPrice(key, cart[key]);
	}
	alert("The total amount due is $" + totalCost);
}