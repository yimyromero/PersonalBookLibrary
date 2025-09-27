const Book = require('../models/Book');
const User = require('../models/User');
const BorrowedBooks = require('../models/BorrowedBooks');
const asyncHandler = require('express-async-handler');

// @desc Get all books
// @route GET /books
// @access Private
const getAllBooks = asyncHandler(async (req, res) => {
    const books = await Book.find().lean();
    if (!books?.length) {
        return res.status(400).json({ message: 'No books found'});
    }

    res.json(books);
});

// @desc Create new book
// @route POST /books
// @access Private
const createNewBook = asyncHandler(async (req, res) => {
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

});

// @esc Update a book
// @route PATCH /books
// @access Private

const updateBook = asyncHandler(async (req, res) => {
    const { id, title, author, isbn, genre, publishedYear, copiesAvailable } = req.body;

    // Confirm data
    if (!id || !title || !author || !isbn || !publishedYear || !copiesAvailable) {
        return res.status(400).json({ message: 'Provide all required fields' });
    }

    const book = await Book.findById(id).exec();
    if (!book) {
        return res.status(400).json({ message: 'Book not found' });
    }

    // Check for duplicates
    const duplicate = await Book.findOne({ title }).lean().exec();
    // This is to check in case the user changes the id but it shouldn't be allowed when using the UI.
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate book' });
    }

    book.title = title;
    book.author = author;
    book.isbn = isbn;
    book.genre = genre;
    book.publishedYear = publishedYear;
    book.copiesAvailable = copiesAvailable;

    const updatedBook = await book.save();
    res.json({ message: `${updatedBook.title} updated` });
});

// @desc Delete a book
// @route DELETE /books
// @access Private
const deleteBook = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Book ID required' });
    }

    // Check if this book was borrowed by any user
    const borrowedBook = await BorrowedBooks.findOne({ book: id }).lean().exec();
    if (borrowedBook) {
        return res.status(400).json({ message: 'Book cannot be deleted as it has related borrow records' });
    }


    const book = await Book.findById(id).exec();
    if (!book) {
        return res.status(400).json({ message: 'Book not found' });
    }

    const result = await book.deleteOne();
    const reply = `Book ${book.title} with ID ${book._id} deleted ${result.deletedCount}`;

    res.json({ message: reply });
});

module.exports = {
    getAllBooks,
    createNewBook,
    updateBook,
    deleteBook
}