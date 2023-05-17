const express = require('express');
const connectDB = require('./db/connect');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');
const books = require('./routes/books')
require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.static('./public'));
app.use(express.json());

app.use('/api/v1/books',books)

app.use(notFound)
app.use(errorHandlerMiddleware)

const start = async ()=>{
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT,()=>{
            console.log(`Server is listening on port ${PORT}...`);
        })
    }catch(error){
        console.log(error);
    }
}

start();