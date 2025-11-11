const express = require("express");
const router = express.Router();
const borrowedBook = require("../controllers/borrowController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
	.route("/")
	.get(borrowedBook.getAllBorrowedBooks)
	.post(borrowedBook.createNewBorrowedBook)
	.patch(borrowedBook.updateBorrowedBook)
	.delete(borrowedBook.deleteBorrowedBook);

module.exports = router;
