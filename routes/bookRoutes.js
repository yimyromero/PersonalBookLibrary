const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');

router.route('/')
    .get(booksController.getAllBooks)
    .post(booksController.createNewBook)

module.exports = router;