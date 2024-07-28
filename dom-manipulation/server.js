const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let quotes = [
  { id: 1, text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { id: 2, text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { id: 3, text: "Do or do not. There is no try.", category: "Motivation" }
];

// GET endpoint to fetch quotes
app.get('/quotes', (req, res) => {
  res.json(quotes);
});

// POST endpoint to update quotes
app.post('/quotes', (req, res) => {
  const newQuotes = req.body;
  quotes = [...newQuotes];
  res.status(200).json({ message: 'Quotes updated successfully' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
