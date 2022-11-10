const express = require('express')
const cors = require('cors');
const jwt =require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hvxqvqc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function running(){
    try{
        const serviceCollection = client.db('foodService').collection('services');
        const reviewCollection = client.db('foodService').collection('reviews');

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

        app.get('/reviews',async(req,res)=>{
            let query = {};
            if(req.query.email){
                query ={
                    email:req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.post('/reviews',async(req,res)=>{
            const body = req.body;
            const result = await reviewCollection.insertOne(body)
            res.send(result)

    })

    app.patch('/reviews/:id', async(req, res)=>{
        const id = req.params.id;
        const status = req.body.status;
        const query = {_id:ObjectId(id)}
        const updatedDoc = {
            $set:{
                status: status
            }
        }
        const result = await reviewCollection.updateOne(query, updatedDoc)
        res.send(result)
    })

    app.delete('/reviews/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await reviewCollection.deleteOne(query)
        res.send(result)
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