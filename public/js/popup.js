var inactiveTime = 300000;
var myInactiveTimer = setInterval(function(){ popup() }, inactiveTime);

var time = 0;
var myCounter = setInterval(function(){ showTime() }, 1000);

/* Resets the alert timer when user clicks ok or add to/remove from cart*/
function resetTimer() {
	clearInterval(myInactiveTimer)
	myInactiveTimer = setInterval(function(){ popup() }, inactiveTime);
	time = 0;
}

/* Alert the user if they are inactive */
function popup() {
    alert('Hey there! Are you still planning to buy something?');
}

/* displays the time the user has been inactive for */
function showTime() {
	time++;
	document.getElementById("timer").innerHTML = "You've been inactive for " + time + " seconds.";

}
