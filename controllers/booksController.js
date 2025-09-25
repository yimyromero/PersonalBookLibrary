const Book = require('../models/Book');
const User = require('../models/User');

// @desc Get all books
// @route GET /books
// @access Private
const getAllBooks = async (req, res) => {
    const books = await Book.find().lean();
    if (!books?.length) {
        return res.status(400).json({ message: 'No books found'});
    }

    res.json(books);
}

// @desc Create new book
// @route POST /books
// @access Private
const createNewBook = async (req, res) => {
    const { title, author, genre, isbn, publishedYear, copiesAvailable } = req.body;

    // Confirm data
    if (!title || !author || !isbn || !publishedYear || !copiesAvailable) {
        return res.status(400).json({ message: 'Provide all required fields' });
    }
    // Check for duplicates
    const duplicate = await Book.find({ title }).lean().exec();
    if (duplicate?.length) {
        return res.status(409).json({ message: 'Duplicate book title' });
    }

    const book = await Book.create({ title, author, genre, isbn, publishedYear, copiesAvailable });
    if (book) {
        res.status(201).json({ message: `New book ${title} created`});
    } else {
        res.status(400).json({ message: 'Invalid book data received'});
    }

}

module.exports = {
    getAllBooks,
    createNewBook
}