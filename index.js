const express = require("express");
const app = express();
const port = 3000;
const { MongoClient } = require("mongodb");

// Connection URI for MongoDB
const mongoURI = "mongodb://mongodb:27017/mydatabase"; // Replace with your MongoDB URI

// Function to connect to MongoDB, insert a document, and then perform a find operation
async function connectInsertAndFind() {
  try {
    // Create a MongoDB client
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Connect to the MongoDB server
    await client.connect();

    // Access the MongoDB database
    const db = client.db();

    // Perform an insertOne operation
    const collection = db.collection("mycollection");
    await collection.insertOne({
      data: "New Data" + Date.now(),
    });

    // Perform a find operation
    const findResult = await collection.find({}).toArray(); // Find all documents in the collection

    // Close the MongoDB client
    client.close();

    return { findResult }; // Return both insert and find results
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

app.get("/", async (req, res) => {
  try {
    // Call the connectInsertAndFind function when a request is made to "/"
    const { findResult } = await connectInsertAndFind();

    // Send both insert and find results as part of the response
    res.json({ data: "hello world 2", findResult });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
