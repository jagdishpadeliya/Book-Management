const mongoose = require('mongoose');
const properties = {
    type:String,
    required:[true,'must provide name'],
    trim:true,
}
const BookSchema = new mongoose.Schema({
    title:properties,
    author:properties,
    isbn:properties
})

module.exports = mongoose.model('Book', BookSchema);