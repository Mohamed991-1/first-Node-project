const express = require('express');
const Joi = require('joi');
const router = express.Router();
const Book = require('../models/book'); // Import the Book model

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).send({ error: "Failed to fetch books" });
    }
});

// Get book
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).send({ error: "Book not found" });
        }
    } catch (err) {
        res.status(500).send({ error: "Failed to fetch the book" });
    }
});

// Add 
router.post('/', async (req, res) => {
    const bookSchema = Joi.object({
        name: Joi.string().min(3).required(),
        description: Joi.string().min(10).required(),
        price: Joi.number().positive().required()
    });

    const { error } = bookSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const newBook = new Book({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        });
        await newBook.save();
        res.json(newBook);
    } catch (err) {
        res.status(500).send({ error: "Failed to add book" });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const bookSchema = Joi.object({
        name: Joi.string().min(3).optional(),
        description: Joi.string().min(10).optional(),
        price: Joi.number().positive().optional()
    });

    const { error } = bookSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).send({ error: "Book not found" });
        }
        res.json(updatedBook);
    } catch (err) {
        res.status(500).send({ error: "Failed to update book" });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).send({ error: "Book not found" });
        }
        res.json(deletedBook);
    } catch (err) {
        res.status(500).send({ error: "Failed to delete book" });
    }
});

module.exports = router;
