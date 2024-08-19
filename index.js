const express = require('express');
const Joi = require('joi');

const app = express();
const port = 8000;

const booksRoutes = require ('./routes/books');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});
app.use(express.json());
app.use("/books",booksRoutes);


app.get('/', (req, res) => {
    res.send('Welcome');
});

app.get('/*', (req, res) => {
    res.status(404).send("Error: Page not found");
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
