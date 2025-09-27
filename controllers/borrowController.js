const BorrowedBook = require('../models/BorrowedBooks');
const asyncHandler = require('express-async-handler');

// @desc Get all borrowed books lists
// @route get /borrowed
// @access Private
const getAllBorrowedBooks = asyncHandler(async (requestAnimationFrame, res) => {

    const borrowedBooks = await BorrowedBook.find().lean();
    if (!borrowedBooks?.length) {
        return res.status(400).json({ message: 'No borrowed books found'});
    }

    res.json(borrowedBooks);
});

// @desc Create new borrowed book record
// @route POST /borrowed
// @access Private
const createNewBorrowedBook = asyncHandler(async (req, res) => {
    const { user, book, borrowedDate, dueDate } = req.body;

    // Need to get user and book info and find the IDs to save in borrowed books record

    if (!user || !book || !dueDate || !borrowedDate) {
        return res.status(400).json({ message: 'Provide all required fields' });
    }

    // Check if book is available
    const bookRecord = await Book.findById(book).exec();
    if (!bookRecord || bookRecord.copiesAvailable < 1) {
        return res.status(400).json({ message: 'Book not available' });
    }

    // Create the borrowed book record
    const borrowedBookRecord = await BorrowedBook.create({ user, book, borrowedDate, dueDate });
    if (borrowedBookRecord) {
        // Decrease the available copies of the book
        bookRecord.copiesAvailable -= 1;
        await bookRecord.save();

        res.status(201).json({ message: `Book borrowed successfully`});
    } else {
        res.status(400).json({ message: 'Invalid data received'});
    }

});