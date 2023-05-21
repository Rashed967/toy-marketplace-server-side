const express = require('express');
const cors = require('cors');
const app = express()
const dotenv = require('dotenv');
const port = process.env.PORT || 5000

dotenv.config()

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.ACCESS_TOKEN}@cluster0.kt6fwyn.mongodb.net/?retryWrites=true&w=majority`;

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

    // create database 
    const gamesCollection = client.db('gamesDB').collection('game')
    const addedToyCollection = client.db('gamesDB').collection('addedToy')

    // games collecton 
    app.get('/games', async (req, res) => {
        const result = await gamesCollection.find().toArray()
        res.send(result)
    })

    app.get('/gamesByCategory', async (req, res) => {
        let query = {}
        if(req.query?.subcategory){
            query = {subcategory : req.query.subcategory}
        }
        const result = await gamesCollection.find(query).toArray()
        res.send(result)
    })

    app.get('/games/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await gamesCollection.findOne(query)
        res.send(result)
    })

    app.post('/addAToy', async(req, res) => {
        const newToy = req.body;
        const result = await addedToyCollection.insertOne(newToy)
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


app.get('/', (req, res) => {
    res.send('express server is runnign')
})


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
