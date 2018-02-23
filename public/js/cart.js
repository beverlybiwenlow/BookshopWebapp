//var cart = [];
var cart = {};
var productList = document.getElementById('productList');


function createProductElements(){
	productList.innerHTML = "";
	for(var key in products){
		var name = products[key].name;
		var price = products[key].price
		var listItem = document.createElement('li');
		listItem.className = 'product';
		var containerDiv = document.createElement('div');
		var imagesDiv = document.createElement('div');
		var labelDiv = document.createElement('div');
		labelDiv.textContent = name;
		var addButton = document.createElement('button');
		addButton.textContent = 'Add';
		addButton.className = 'addButton ' + name;

		if(products[key].quantity == 0){
			addButton.style.visibility = "hidden";
		}

		var removeButton = document.createElement('button');
		removeButton.textContent = 'Remove';
		removeButton.className = 'removeButton ' + name;
		removeButton.style.visibility = "hidden";
		
		var priceSpan = document.createElement('span');
		priceSpan.textContent = '$' + price;
	
		var productImage = document.createElement('img');
		productImage.src = products[key].imageUrl;
		var cartImage = document.createElement('img');
		cartImage.src= 'images/cart.png';
		cartImage.id = 'cart';
	
		imagesDiv.appendChild(productImage);
		imagesDiv.appendChild(cartImage);	
		imagesDiv.appendChild(addButton);
		imagesDiv.appendChild(removeButton);
		imagesDiv.appendChild(priceSpan);
	
		containerDiv.appendChild(imagesDiv);
		containerDiv.appendChild(labelDiv);
		
		listItem.appendChild(containerDiv);
		productList.appendChild(listItem);	

		//addComputeFunction(key);
	}
}


function setClickListeners(){

	/* Setting click listeners for add buttons */
	var addButtons = document.getElementsByClassName("addButton");
	for (var i = 0 ; i < addButtons.length; i++) {
		addButtons[i].addEventListener('click' , function() {
			addToCart(this.className.split(' ')[1]);
		}) ; 
	}


	/* Setting click listeners for remove buttons */
	var removeButtons = document.getElementsByClassName("removeButton");
	for (var i = 0 ; i < removeButtons.length; i++) {
		removeButtons[i].addEventListener('click' , function() {
			removeFromCart(this.className.split(' ')[1]);
		}) ; 
	}
}


/* Adds a given product to user's cart */
function addToCart(productName){
	console.log("adding to cart " + productName);
	console.log("Max avail: " + products[productName].quantity);
	console.log("Before adding: " + cart[productName]);						
	var isFound = false;
	for (var key in cart){
			if(key == productName){
				if(products[productName].quantity > 0){
					cart[key] = cart[key] + 1;
					isFound = true;
				} else{ 
					isFound = true;
				}	
			}
	}
	if(!isFound){
		cart[productName] = 1;		
	}

	console.log("After adding: " + cart[productName]);						

	if(cart[productName] == products[productName].quantity){
		hideAddButton(productName);
	}

	//console.log(cart);
	showRemoveButton(productName);
	showCart();
	updateTotalPrice();
	resetTimer();
}


/* Removes a given product from user's cart */
function removeFromCart(productName){
	console.log("Max avail: " + products[productName].quantity);
	console.log("Before removing, in cart: " + cart[productName]);	
	var isFound = false;
	for (var key in cart){
			if(key == productName){
				if(cart[key] > 1){
					cart[key] = cart[key] - 1;
					isFound = true;
				} else{
					delete cart[key];
					hideRemoveButton(productName)					
					isFound = true;
				}	
			}
	}
	if(!isFound){
		alert("There is none of this product in your cart!");
	} 

	console.log("After removing, in cart: " + cart[productName]);	
	
	//console.log(cart);

	showAddButton(productName);
	showCart();
	updateTotalPrice();
	resetTimer();
}


function hideAddButton(productName) {
	var addButton = document.getElementsByClassName("addButton " + productName)[0];
	addButton.style.visibility = "hidden";
	alert(productName + " is now out of stock!");
}


function hideRemoveButton(productName){
	var removeButton = document.getElementsByClassName("removeButton " + productName)[0];
	removeButton.style.visibility = "hidden";
	alert("You now have no more of " + productName + "!");
}


function showAddButton(productName) {
	var addButton = document.getElementsByClassName("addButton " + productName)[0];
	setVisibilityOfButton(addButton);
}


function showRemoveButton(productName){
	var removeButton = document.getElementsByClassName("removeButton " + productName)[0];
	setVisibilityOfButton(removeButton);
}


function setVisibilityOfButton(button){
	var listItemAncestor = button.closest(".product");
	button.style.visibility = "visible";
	var productNameFromButton = button.className.split(' ')[1];

	//Check if button has add or remove functionality
	if (button.className.split(' ')[0] == "addButton"){
		var otherButton = button.parentNode.childNodes[3];
	} else{
		var otherButton = button.parentNode.childNodes[2];		
	}

	var otherButtonType = otherButton.className.split(' ')[0];

	// Both buttons are hidden regardless of functionality
	listItemAncestor.onmouseleave = function(){
		button.style.visibility = "hidden";
		otherButton.style.visibility = "hidden";
	}

	// Buttons are shown depending on what type it is (Add or Remove)
	// and also based on how many items are in the cart
	listItemAncestor.onmouseenter = function(){
		button.style.visibility = "visible";
		if(otherButtonType == "addButton" && cart[productNameFromButton] < products[productNameFromButton].quantity){
			otherButton.style.visibility = "visible";
		} 
		else if(otherButtonType == "removeButton" && cart[productNameFromButton] > 0){
			otherButton.style.visibility = "visible";
		}		
	}
}


function computeNetPrice(productName, quantity) {
	var cost = products[productName].price;
	return cost * quantity;
}


function updateTotalPrice() {
	var totalCostButton = document.getElementById("cartButton");

	var totalCost = 0;
	for(var key in cart) {
		//console.log("KEY: " + key);
		totalCost += computeNetPrice(key, cart[key]);
	}
	totalCostButton.innerHTML = "Cart ($" + totalCost + ")";
}