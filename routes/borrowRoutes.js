const express = require('express');
const router = express.Router();
const borrowedBook = require('../controllers/borrowController');

router.route('/')
    .get(borrowedBook.getAllBorrowedBooks)
    .post(borrowedBook.createNewBorrowedBook)

module.exports = router;
