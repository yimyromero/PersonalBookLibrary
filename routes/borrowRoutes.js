const express = require('express');
const router = express.Router();
const borrowedBook = require('../controllers/borrowController');

router.route('/')
    .get(borrowedBook.getAllBorrowedBooks)
    .post(borrowedBook.createNewBorrowedBook)
    .patch(borrowedBook.updateBorrowedBook)
    .delete(borrowedBook.deleteBorrowedBook)

module.exports = router;
