var products = {};
var errorCount = 5; //Limit to number of times ajaxGet() is run

/* Makes a GET request to the server */
function ajaxGet(url, successCallback, errorCallback) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", url);

		
	xhttp.onload = function(){
		if(xhttp.status == 200){
			successCallback(xhttp.responseText);
		}
		if(xhttp.status == 500 || xhttp.status == 404){
			console.log("error in load");
			errorCallback(xhttp.statusText)
		}
	}
		
	xhttp.onerror = function(){
		console.log("just error");
		errorCallback(xhttp.statusText);
	}
		
	xhttp.send();
}

/* Updates the database via a POST request to the server */
function ajaxPost(url, successCallback, errorCallback) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader('content-type', 'application/json');

		
	xhttp.onload = function(){
		if(xhttp.status == 200){
			successCallback(xhttp.responseText);
		}
		if(xhttp.status == 500 || xhttp.status == 404){
			console.log("error in load");
			errorCallback(xhttp.statusText)
		}
	}
		
	xhttp.onerror = function(){
		console.log("just error");
		errorCallback(xhttp.statusText);
	}
		

	var totalCost = 0;
	for(var key in cart) {
		totalCost += computeNetPrice(key, cart[key]);
	}

	// Updates the orders document
	var data = {
		cart: cart,
		total: totalCost
	};

	xhttp.send(JSON.stringify(data));
}

function initialize(response){
	if(response){
		for (var product in products) delete products[product];
		console.log(products);
		products = JSON.parse(response);
		console.log(products);	
		createProductElements(); //in cart.js
		setClickListeners(); //in cart.js
	}

}

function handleError(error){
	var timeoutHandler = function(){
		if(errorCount > 0){
			console.log("Before, count is " + errorCount);
			ajaxGet("http://localhost:5000/products", initialize, handleError);
			errorCount -= 1;		
			console.log("After, count is " + errorCount);			
		}
	}
	setTimeout(timeoutHandler, 1000);
}


ajaxGet("http://localhost:5000/products", initialize, handleError);
