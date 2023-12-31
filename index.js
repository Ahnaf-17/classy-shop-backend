
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000


// middleware 
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.fz8oxax.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productDB').collection('product');
    const cartCollection = client.db('productDB').collection('cart');
    


    app.post('/product',async(req,res)=>{
        const newProduct = req.body;
        console.log(newProduct)
        const result = await productCollection.insertOne(newProduct)
        res.send(result)
    })

    app.get('/product', async(req,res)=>{
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/product/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productCollection.findOne(query);
        res.send(result)
    })

    app.put('/product/:id', async(req,res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updatedProduct = req.body;
        const product = {
            $set: {
                name: updatedProduct.name,
                brand: updatedProduct.brand,
                type: updatedProduct.type,
                price: updatedProduct.price,
                rating: updatedProduct.rating,
                photo: updatedProduct.photo
            }
        }
        const result = await productCollection.updateOne(filter,product,options)
        res.send(result)
    })


    // cart 

    app.post('/cart',async(req,res)=>{
        const cartProduct = req.body;
        console.log(cartProduct)
        const result = await cartCollection.insertOne(cartProduct)
        res.send(result)
    })

    app.get('/cart/:email', async(req,res)=>{
        const email = req.params.email;
        const query = {'user.email': email}
        const cursor = cartCollection.find(query);
        const result = await cursor.toArray();
        res.send(result)
    })

    app.delete('/cart/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await cartCollection.deleteOne(query)
        res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/' ,(req,res)=>{
    res.send('classy shop running')
})
app.listen(port,()=>{
    console.log(`running on port : ${port}`)
})