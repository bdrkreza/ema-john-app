const express = require('express')
require('dotenv').config()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userPss = process.env.DB_PASS;
const user = process.env.DB_USER;
const name = process.env.DB_NAME;
const uri = `mongodb+srv://${user}:${userPss}@cluster0.9akcg.mongodb.net/${name}?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {

    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");





    app.post("/addProduct", (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result => {
                res.send(result.insertedCount)
                console.log(result.insertedCount)
            })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    app.post('/productsByKeys', (req, res) => {
        const productsKeys = req.body;
        productsCollection.find({ key: { $in: productsKeys } })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post("/addOrder", (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
});




app.listen(process.env.PORT || port)
