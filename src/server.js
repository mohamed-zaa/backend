
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware - MUST come before routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Books data
let books = [
  { id: 1, title: "Atomic Habits", author: "James Clear" },
  { id: 2, title: "Deep Work", author: "Cal Newport" }
];

// GET all books
app.get("/books", (req, res) => {
  res.json(books);
});

// GET single book
app.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json(book);
});

// POST new book
app.post("/books", (req, res) => {
  console.log("POST BODY:", req.body);

  const { title, author } = req.body || {};

  if (!title || !author) {
    return res.status(400).json({
      message: "Title and author are required"
    });
  }

  const newBook = {
    id: books.length
      ? Math.max(...books.map(b => b.id)) + 1
      : 1,
    title,
    author
  };

  books.push(newBook);

  res.status(201).json(newBook);
});

// PUT update book
app.put("/books/:id", (req, res) => {
  console.log("PUT BODY:", req.body);

  const book = books.find(b => b.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const { title } = req.body || {};

  if (!title) {
    return res.status(400).json({
      message: "Title is required"
    });
  }

  book.title = title;

  res.json(book);
});

// DELETE book
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const exists = books.some(b => b.id === id);

  if (!exists) {
    return res.status(404).json({ message: "Book not found" });
  }

  books = books.filter(b => b.id !== id);

  res.json({ message: "Book deleted successfully" });
});

// Search books
app.get("/books/search", (req, res) => {
  const author = req.query.author;

  const result = books.filter(b =>
    b.author.toLowerCase().includes((author || "").toLowerCase())
  );

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
