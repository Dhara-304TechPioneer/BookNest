import React, { useEffect, useState } from "react";

export default function BookForm({ onAdd, editing, onUpdate, onCancel }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("Want to Read");
  const [rating, setRating] = useState("");

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setAuthor(editing.author || "");
      setGenre(editing.genre || "");
      setStatus(editing.status || "Want to Read");
      setRating(editing.rating ?? "");
    } else {
      setTitle("");
      setAuthor("");
      setGenre("");
      setStatus("Want to Read");
      setRating("");
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
    title,
    author,
    genre,
    status,
    rating: rating ? Number(rating) : null
    };

if (editing) {
      onUpdate(editing.id, payload);
    } else {
      onAdd(payload);
    }
  };

  return (
    <div className="card form-card">
      <div className="form-head">
        <h2 className="form-title">{editing ? "Edit Book" : "Add Book"}</h2>
        <p className="form-sub">Add a book to your personal library</p>
      </div>

      <form onSubmit={handleSubmit} className="book-form">
        <div className="row">
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Atomic Habits" />
          </div>

          <div className="field">
            <label>Author</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} required placeholder="e.g. James Clear" />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Genre</label>
            <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="e.g. Self Help" />
          </div>

          <div className="field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Want to Read</option>
              <option>Reading</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="row small">
          <div className="field">
            <label>Rating</label>
            <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
          </div>

          <div className="actions-right">
            {editing && (
              <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            )}
            <button type="submit" className="btn btn-primary">{editing ? "Update Book" : "Add Book"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
