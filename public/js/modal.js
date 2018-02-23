window.onload = (function(){

// Initial set-up for modal
var modal = document.getElementById("modal");
var cart = document.getElementById("cartButton");
var span = document.getElementById("close");

cart.addEventListener('click', function() { 
	modal.style.display = "block";
	resetTimer();
});

span.addEventListener('click', function() {
	modal.style.display = "none";
	resetTimer();
})

// Initial set-up for table in modal
var table = document.getElementById("myTable");
var text = document.createTextNode("Your cart is currently empty");
table.appendChild(text);
});

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        modal.style.display = "none";
       	resetTimer();
    }
};

/* Remove/Add buttons for modal */
function appendButton(productName, subCell, addCell) {
	// Remove product button
	var subBtn = document.createElement("button");
	var subText = document.createTextNode("-");
	subBtn.appendChild(subText);
	subBtn.addEventListener("click", function() {
		removeFromCart(productName);
	});
	subCell.appendChild(subBtn);

	// Add product button
	var addBtn = document.createElement("button");
	var addText = document.createTextNode("+");
	addBtn.appendChild(addText);
	addBtn.addEventListener("click", function() {
		addToCart(productName);
	});
	addCell.appendChild(addBtn);
}

/* Recreate table whenever cart is modified */
function recreateTable(table) {
	table.parentNode.removeChild(table);

	var newTable = document.createElement("table");
	newTable.id = "myTable";

	if(Object.keys(cart).length == 0) {
		var text = document.createTextNode("Your cart is currently empty");
		newTable.appendChild(text);
	} else {
		var row = newTable.insertRow(0);

		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);

		cell1.setAttribute("width", "40%");
		cell2.setAttribute("width", "20%");
		cell3.setAttribute("width", "30%");

		var text1 = document.createTextNode("Product");
		var text2 = document.createTextNode("Quantity");
		var text3 = document.createTextNode("Total Price");

		cell1.appendChild(text1);
		cell2.appendChild(text2);
		cell3.appendChild(text3);


		newTable.insertRow(1);
		row = newTable.insertRow(2);

		var checkoutButton = document.createElement("button");
		var text = document.createTextNode("Checkout");
		checkoutButton.appendChild(text);
		checkoutButton.addEventListener("click", function() { confirmation(); });
		row.appendChild(checkoutButton);
	}

	document.getElementById("table-container").appendChild(newTable);
}

/* Show contents of cart inside modal */
function showCart() {
	var table = document.getElementById("myTable");

	recreateTable(table);
	table = document.getElementById("myTable");

	var productNum = 0;
	for(var key in cart) {
		var row = table.insertRow(1);

		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var cell4 = row.insertCell(3);
		var cell5 = row.insertCell(4); 

		var text1 = document.createTextNode(key);
		var text2 = document.createTextNode(cart[key]);
		var text3 = document.createTextNode(computeNetPrice(key, cart[key]));

		cell1.appendChild(text1);
		cell2.appendChild(text2);
		cell3.appendChild(text3);

		var prod = String(Object.keys(cart)[productNum]);
		appendButton(prod, cell4, cell5);

		productNum++;
	}
}

/* Confirmation window for checkout */
function confirmation() {
	var r = confirm("Confirm final price?");
	if(r == true) {
		ajaxGet("http://localhost:5000/products", compare, compareError);
	}
}