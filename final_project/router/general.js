const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let aut = req.params.author;
    var book = Object.values(books).filter((obj) => {
        return obj.author === aut;
    });
    if(book) {
        res.send(book);
    }
    else {
        res.status(404).json({message: "could not find books from author " + aut});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    var book = Object.values(books).filter((obj) => {
        return obj.title === title;
    });
    if(book) {
        res.send(book);
    }
    else {
        res.status(404).json({message: "could not find books from author " + aut});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    var book = Object.values(books).filter((obj) => {
        return obj.author === isbn;
    });
    if(book) {
        res.send(book.reviews)
    }
});

module.exports.general = public_users;
