var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
// app.use(express.static(__dirname + '/public'))
app.use(express.static('public'));

app.use(express.json());  // <- alias to bodyParser.json
app.use(express.urlencoded());  // <- alias to bodyParser.urlencoded

app.get('/products', function(request, response) {

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    var lower_bound = request.query.low;
    var higher_bound = request.query.high;
    var lower_bound_num = parseInt(request.query.low);
    var higher_bound_num = parseInt(request.query.high);
    console.log("lower: " + lower_bound);
    console.log("higher: " + higher_bound);

    var category = request.query.category;

    var query = {};

    // if only higher bound given
    if(typeof higher_bound == 'string' && typeof lower_bound == 'undefined'){
      query["price"] =  {$lte: higher_bound_num};      
    } 
    // if only lower bound given
    else if(typeof lower_bound == 'string' && typeof higher_bound == 'undefined'){
      query["price"] =  {$gte: lower_bound_num};            
    }
    // if higher > lower
    else if (higher_bound_num > lower_bound_num){
      query["price"] =  {$gte: lower_bound_num, $lte: higher_bound_num};                  
    }
    // if higher = lower
    else if(higher_bound_num == lower_bound_num){
      query["price"] =  lower_bound_num;                  
    }
    // if higher < lower
    else if(higher_bound_num < lower_bound_num){
      response.status(400);
    }

    if(typeof category == 'string'){
      if (category == 'allitems'){

      }
      else {
        query["category"] =  category;                                
      }
    }
    
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost:27017/CPEN400A", function (err, db) {
        db.collection('products', function (err, collection) {    
             collection.find(query).toArray(function(err, items) {              
                if(err) throw err;    
                var products = {};
                for(index in items) {
                  var key = items[index].name;
                  var val = items[index];
                  products[key] = val;
                }
                response.json(products);        
            });
        });
                    
    });
})

app.get('/products/:productKey', function(request, response) {

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var option = getRandomInt(0,5);
  if (option < 4) {
	  if (request.params.productKey in products){
		  response.json(products[request.params.productKey]);	  
	  }
	  else {
		  response.status(404).send("Product does not exist");
	  }
  } else if (option == 4) {
    response.status(500).send("An error occurred, please try again");
  }
})

app.post('/checkout', function(request, response) {

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  var data = request.body;
  var cartData = request.body.cart;
  var totalData = request.body.total;

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost:27017/CPEN400A", function (err, db) {
      if (err) throw err;
      var myQuery = {id: 1};
      var newValues = { $set:{ cart: cartData, total: totalData } };

      // Update orders value with cart object string and total
      db.collection('orders').updateOne(myQuery, newValues, function (err, res) {
        if (err) throw err;
        console.log("orders updated");
      });

      // Update products table
      for (var key in cartData) {
        if (cartData.hasOwnProperty(key)) {
          console.log(key + " -> " + cartData[key]);

          var query = {name: key};
          var value = { $inc: { quantity: (-1) * cartData[key]}};

          db.collection('products').updateOne(query, value, function (err, res) {
          if (err) throw err;
            console.log("products updated");
          });
        }
      }
      
  });
  console.log(data);
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
