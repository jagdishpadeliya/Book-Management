const mongoose = require('mongoose');

const connectDB = (URL)=>{
    return mongoose.connect(URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false,
        useCreateIndex:true 
    })
}

module.exports = connectDB