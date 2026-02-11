const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    };
    req.session.user = {
        username: username
    };
//    console.log("auth user:");
//    console.log(req.session.authorization);
    return res.status(200).send("User successfully logged in");
  }
  else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let book = books[req.params.isbn];
    if(!book) {
        return res.status(404).json({message: "Book not found"});
    }

    console.log("session user: ");
    console.log(req.session.user.username);
    let user = req.session.user.username;

    const newReview = req.body.review;
    
    let prevReview = book.reviews[user];
    console.log("prev review: ");
    console.log(prevReview);
    if (!prevReview){
        book.reviews[user] = newReview;

        console.log("new review: ");
        console.log(newReview);
        console.log("all reveiws on book: ", book.title);
        console.log(book.reviews);    
        return res.status(200).send({message: "Added review by user: ", user});
    }
    else {
        book.reviews[user] = newReview;

        console.log("new review: ");
        console.log(newReview);    
        return res.status(200).send({message: "Updated review for user: "});
    }
    return res.status(400).send("Should not be able to get here");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
