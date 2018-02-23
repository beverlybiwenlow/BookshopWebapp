function setClickListenersForCategoryFilters(){
    
        /* Setting click listeners for category filters */
        var filterButtons = document.getElementsByClassName("filter");
        console.log(filterButtons);
        for (var i = 0 ; i < filterButtons.length; i++) {            
            filterButtons[i].addEventListener('mousedown' , function() {
                ajaxGet("http://localhost:5000/products?category=" + this.className.split(' ')[1], initialize, handleError);
            }) ; 
        }
    
}

setClickListenersForCategoryFilters();