const express = require("express");
const app = express();

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on Port: ${PORT}`);
});

// setup MongoDB
const { MongoClient } = require("mongodb");

// parse incoming POST into json data
app.use(express.json());

// hide credentials with .env
const dotenv = require("dotenv");
dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const MONGO_URI = process.env.MONGO_URI;

const connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${MONGO_URI}/${DB_NAME}?retryWrites=true&w=majority`;

// create instance from MongoClient
const client = new MongoClient(connectionString);

// connect to the MongoDB
try {
     client.connect();
     console.log("MongoDB is connected 😎");
} catch (error) {
    console.log(error);
}
 
// setup different routes
app.get("/", (req, res) => {
    res.send("Welcome to homepage");
});

app.get("/mongo", (req, res) => {
    res.send("Welcome to Mongo!");
});

//* Query Documents
app.get("/restaurants", (req, res) => {
    const db = client.db(DB_NAME);
    // select all documents in a collection
    db.collection("restaurants").find({}).toArray((error, info) => {
        if (error) throw error;
        console.log(info);
        res.send(info);
    });
});

app.get("/restaurants/:name", (req, res) => {
    console.log(req.params);
    const name = req.params.name;
    const db = client.db(DB_NAME);
    // The db.collection.findOne() method also performs a read operation to return a single document. Internally, the db.collection.findOne() method is the db.collection.find() method with a limit of 1.
    db.collection("restaurants").findOne({ name }, (error, info) => {
        if (error) throw error;
        console.log(info);
        res.send(info);
    });
});

app.post("/restaurants", (req, res) => {
    const name = req.body.name;
    const db = client.db(DB_NAME);
    db.collection("restaurants").findOne({ name: req.body.name }, (error, info) => {
        if (error) throw error;
        res.send(info);
    });
});

//* Create Operations
app.post("/add", (req, res) => {
    console.log("Add new restaurant");
    const restaurantData = req.body;
    const db = client.db(DB_NAME);
    // insert a single document to a collection with the insertOne() method
    db.collection("restaurants").insertOne(restaurantData, (error, info) => {
        if (error) throw error;
        console.log(info.ops[0]);
        res.send(info.ops[0]);
    });
});