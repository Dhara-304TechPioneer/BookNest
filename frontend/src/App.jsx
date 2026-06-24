import React, { useEffect, useState } from "react";
import api from "./api";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";

export default function App() {
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

    const addBook = async (payload) => {
    try {
        setError("");
        await api.post("/books", payload);
        fetchBooks();
    } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
    }
    };

  const updateBook = async (id, payload) => {
    try {
      await api.put(`/books/${id}`, payload);
      setEditing(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBooks = books.filter((b) => {
    if (filter !== "All" && b.status !== filter) return false;
    if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: books.length,
    completed: books.filter((b) => b.status === "Completed").length,
    reading: books.filter((b) => b.status === "Reading").length,
  };

  return (
    <div className="app-wrap">
      <div className="hero">
        <div className="hero-inner">
          <h1 className="brand">📚 BookNest</h1>
          <p className="lead">Your Personal Digital Library</p>
          <p className="tag">Track • Organize • Read</p>
        </div>
      </div>

      <div className="container">
        {error && (
        <div className="error">
            {error}
        </div>
        )}
        <div className="top-controls">
          <div className="search-filter">
            <input
              className="input-search"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select className="select-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Want to Read</option>
              <option>Reading</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Books</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.reading}</div>
              <div className="stat-label">Currently Reading</div>
            </div>
          </div>
        </div>

        <main className="main-grid">
          <aside className="panel panel-left">
            <BookForm
              onAdd={addBook}
              editing={editing}
              onUpdate={updateBook}
              onCancel={() => setEditing(null)}
            />
          </aside>

          <section className="panel panel-right">
            <BookList books={filteredBooks} onEdit={setEditing} onDelete={deleteBook} />
          </section>
        </main>
      </div>
    </div>
  );
}
