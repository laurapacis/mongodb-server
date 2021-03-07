const express = require("express");
const app = express();

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


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server started on Port: ${PORT}`);
});