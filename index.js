const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

// oAAcsEqgyvnSmBOI
// foodService

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hvxqvqc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function running(){
    try{
        const serviceCollection = client.db('foodService').collection('services');

        app.get('/services',async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services);

            app.get('/services/:id', async(req,res)=>{
                const id = req.params.id;
                const query = {_id:ObjectId(id)};
                const service = await serviceCollection.findOne(query)
                res.send(service)
            })
        })
    }
    finally{

    }
}
running().catch(err=>console.error(err));


app.get('/',(req,res) => {
    res.send('Food review')
})
app.listen(port,() =>{
    console.log(`food service listening on port ${port}`)
})