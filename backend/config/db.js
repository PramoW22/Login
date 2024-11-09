// Import MongoClient and ServerApiVersion from the MongoDB Node.js driver
const { MongoClient, ServerApiVersion } = require('mongodb');


// Create a MongoClient instance with options to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect();

    // Ping the database to confirm successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = { client, connectToDatabase };
