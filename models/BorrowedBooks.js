const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", require: true
    },
    book: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", require: true
    },
    borrowDate: {
        type: Date, default: Date.now
    },
    dueDate: { 
        type: Date, required: true
    }
}, {timestamps: true })

module.exports = mongoose.model("Borrow", borrowSchema);