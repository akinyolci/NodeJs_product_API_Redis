const express = require('express');
const app = express();
const cors = require('cors');

const mongoose = require('mongoose');
const dotenv = require('dotenv');



const productRoute = require('./routes/product');

dotenv.config();

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECT, 
    { useNewUrlParser : true,
    useUnifiedTopology : true
});


app.use(cors()); // CORS middleware
app.use(express.static('public'));

//Middleware
app.use(express.json());

//Router Middlewares
app.use('/api/product', productRoute);

let port = 5005;
app.listen(port,()=>{
    console.log(`Server running on http://127.0.0.1:${port}`);
});