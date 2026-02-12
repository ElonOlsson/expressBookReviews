const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

const getAllBooksPromise =  new Promise((resolve, reject) => {
    // fake function to simulate fetching data from somewhere else
    const books2 = books;
    if (books2) {
        resolve(books2);
    }
    else {
        reject(new Error("Failed getting books"));
    }
});

//testuser, testpw
public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } 
    else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    getAllBooksPromise
        .then(result => {
            res.send(JSON.stringify(result, null, 4));
            console.log("test");
        })
        .catch(error => console.error("error: ", error.message));
    }
);

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
    const book = books[isbn];
    res.send(book.reviews);
});

module.exports.general = public_users;
