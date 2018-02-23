connection = new Mongo();
db = connection.getDB("CPEN400A");

ImageHostName = "https://cpen400a-bookstore.herokuapp.com/"

db.products.insertMany([
    {
      name: "KeyboardCombo",
      category: "tech",
      price: 30,
      quantity: 5,
      imageUrl: ImageHostName + "images/KeyboardCombo.png"
    },
    {
        name: "Mice",
        category: "tech",        
        price: 6,
        quantity: 5,
        imageUrl: ImageHostName + "images/Mice.png"
      },
      {
        name: "PC1",
        category: "tech",        
        price: 325,
        quantity: 5,
        imageUrl: ImageHostName + "images/PC1.png"
      },
      {
        name: "PC2",
        category: "tech",        
        price: 375,
        quantity: 5,
        imageUrl: ImageHostName + "images/PC2.png"
      },
      {
        name: "PC3",
        category: "tech",        
        price: 355,
        quantity: 5,
        imageUrl: ImageHostName + "images/PC3.png"
      },
      {
        name: "Tent",
        category: "supplies",        
        price: 35,
        quantity: 5,
        imageUrl: ImageHostName + "images/Tent.png"
      },
      {
        name: "Box1",
        category: "gifts",        
        price: 6,
        quantity: 5,
        imageUrl: ImageHostName + "images/Box1.png"
      },
      {
        name: "Box2",
        category: "gifts",  
        price: 6,
        quantity: 5,
        imageUrl: ImageHostName + "images/Box2.png"
      },
      {
        name: "Clothes1",
        category: "clothing",  
        price: 25,
        quantity: 5,
        imageUrl: ImageHostName + "images/Clothes1.png"
      },
      {
        name: "Clothes2",
        category: "clothing",          
        price: 25,
        quantity: 5,
        imageUrl: ImageHostName + "images/Clothes2.png"
      },
      {
        name: "Jeans",
        category: "clothing",          
        price: 35,
        quantity: 5,
        imageUrl: ImageHostName + "images/Jeans.png"
      },
      {
        name: "Keyboard",
        category: "tech",          
        price: 20,
        quantity: 5,
        imageUrl: ImageHostName + "images/Keyboard.png"
      }
    ])
  
  db.orders.insertOne(
    {
      id: 1,
      cart: "json string for cart object",
      total: 117
    }
  )
  
  db.users.insertOne(
    {
      token: "Xoe2inasd"
    }
  )