const BorrowedBooks = require('../models/BorrowedBooks');
const Book = require('../models/Book')
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc Get all borrowed books lists
// @route get /borrowed
// @access Private
const getAllBorrowedBooks = asyncHandler(async (req, res) => {

    const BorrowedBookRecords = await BorrowedBooks.find()
    .populate('user', 'username')
    .populate('book', 'title')
    .lean();
    if (!BorrowedBookRecords?.length) {
        return res.status(400).json({ message: 'No borrowed books found'});
    }

    res.json(BorrowedBookRecords);
});

// @desc Create new borrowed book record
// @route POST /borrowed
// @access Private
const createNewBorrowedBook = asyncHandler(async (req, res) => {
    const { user, book, borrowedDate, dueDate } = req.body;
    // Need to get user and book info and find the IDs to save in borrowed books record

    if (!user || !book || !dueDate) {
        return res.status(400).json({ message: 'Provide all required fields' });
    }

    // Check if book is available
    const bookRecord = await Book.findById(book).exec();
    if (!bookRecord || bookRecord.copiesAvailable < 1) {
        return res.status(400).json({ message: 'Book not available' });
    }

    // Create transaction to save the borrowed book record and decrement the book copies available
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const borrowedBookRecord = await BorrowedBooks.create([{ user, book, borrowedDate, dueDate }], { session });
        if (!borrowedBookRecord) {
            throw new Error('Failed to create borrowed book record');
        }

        bookRecord.copiesAvailable -= 1;
        await bookRecord.save({ session });

        await session.commitTransaction();
        res.status(201).json({ message: `Book borrowed successfully` });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: 'Invalid data received' });
    } finally {
        session.endSession();
    }

});

// @desc Update borrowed book record
// @route PATCH /borrowed
// @access Private

const updateBorrowedBook = asyncHandler(async (req, res) => {
    const { id, user, book, dueDate, status } = req.body;

    if (!id || !user || !book || !dueDate || !status ) {
        return res.status(400).json({ message: 'Provide all required fields Update'});
    }

    const borrowedRecord = await BorrowedBooks.findById(id).exec();
    if (!borrowedRecord) {
        return res.status(400).json({ message: 'Book not found' });
    }

    borrowedRecord.user = user;
    borrowedRecord.book = book;
    borrowedRecord.dueDate = dueDate;
    //borrowedRecord.returnDate = returnDate;
    borrowedRecord.status = status;

    const updateBorrowedRecord = await borrowedRecord.save();
    res.json({ message: `${updateBorrowedRecord.id} udpated`});
});

// @desc Delete a borrowed book record
// @route DELETE /borrowed
// @access Private

const deleteBorrowedBook = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Borrowed record ID required' });
    }

    const borrowedRecord = await BorrowedBooks.findById(id).exec();
    if (!borrowedRecord) {
        return res.status(400).json({ message: 'Record not found' });
    }

    const result = await borrowedRecord.deleteOne();
    const reply = `Borrowed record with ID ${borrowedRecord.id} has been deleted`;

    res.json({ message: reply });
});

module.exports = {
    getAllBorrowedBooks,
    createNewBorrowedBook,
    updateBorrowedBook,
    deleteBorrowedBook
}