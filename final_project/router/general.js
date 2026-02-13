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
    const getAllBooksPromise =  new Promise((resolve, reject) => {
        // fake function to simulate fetching data from somewhere else
        var books2 = books;
        if (books2) {
            resolve(books2);
        }
        else {
            reject(new Error("Failed getting books"));
        }
    });
    getAllBooksPromise
        .then(result => {
            res.send(JSON.stringify(result, null, 4));
        })
        .catch(error => console.error("error: ", error.message)
    );
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const getSpecificBookPromise = new Promise((resolve, reject) => {
        // again, here is where a more sofisticated call to get the data would be called
        const book = books[req.params.isbn];

        if(book) {
            resolve(book);
        }
        else {
            reject(new Error("Cannot get book with isbn"));
        }
    });

    getSpecificBookPromise
        .then(result => {
            res.send(result);
        })
        .catch(error => console.error("error: ", error.message)
    );
    //const isbn = req.params.isbn;
    //res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const getBookByAuthor = new Promise((resolve, reject) => {
        const booksByAuthor = Object.values(books).filter((obj) => {
            return obj.author === req.params.author;
        });
        if(booksByAuthor) {
            resolve(booksByAuthor);
        }
        else {
            reject(new Error("could not find books from author"));
        }
    });

    getBookByAuthor
        .then(result => {
            res.send(result);
        })
        .catch(error => console.error("error: ", error.message)
    );
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const getBookByTitle = new Promise((resolve, reject) => {
        const bookByTitle = Object.values(books).filter((obj) => {
            return obj.title === req.params.title;
        })
        if(bookByTitle) {
            resolve(bookByTitle);
        }
        else {
            reject(new Error("could not find book with title"));
        }
    });

    getBookByTitle
        .then(result => {
            res.send(result);
        })
        .catch(error => console.error("error: ", error.message)
    );
    });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    res.send(book.reviews);
});

module.exports.general = public_users;
