const express = require('express');
const cors = require('cors');
const app = express();
const favorites = require('./routes/favorites');
const connectDB = require('./db/connect');
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.static('../public')) //serve static files
app.use(express.json()); //we now have access to req.body

//routes:
app.use('/api/v1/favorites', favorites);


const port = process.env.PORT || 5000;

//invoke connectDB; only when connection is successful, start the server.
const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI)
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  }; 
  
  start();
  
