const Book = require('../models/Book');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/cutsom-error');
const getAllBooks = asyncWrapper( async(req,res)=>{
    const books = await Book.find({})
    res.status(200).json({books})
})
const createBook = asyncWrapper( async(req,res)=>{
    const book = await Book.create(req.body);
    res.status(201).json({book})
})

const getBook = asyncWrapper( async(req,res,next)=>{
    const {id:bookID} = req.params;
    const book = await Book.findOne({_id:bookID})
    if(!book){
        return next(createCustomError(`No Boook with id : ${bookID}`,404))
    }
    return res.status(200).json({book})
})

const deleteBook = asyncWrapper( async(req,res,next)=>{
    console.log(req.params);
    const {id:bookID} = req.params;
    const book = await Book.findOneAndDelete({_id:bookID});
    if(!book){
        return next(createCustomError(`No Boook with id : ${bookID}`,404))
    }
    return res.status(200).json({book})
})

const updateBook =  asyncWrapper( async(req,res,next)=>{
    const {id:bookID} = req.params
    const task = await Book.findOneAndUpdate({_id:bookID},req.body,{
        new:true,
        runValidators:true
    })
    if(!task){
        return next(createCustomError(`No Boook with id : ${bookID}`,404))
    }
    res.status(200).json({task})
})

module.exports = {getAllBooks,createBook,getBook,updateBook,deleteBook}