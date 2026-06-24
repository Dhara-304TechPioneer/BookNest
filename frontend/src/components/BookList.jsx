import React from "react";

export default function BookList({ books, onEdit, onDelete }) {
  if (!books.length) {
    return (
      <div className="empty-state card">
        <div className="empty-emoji">📚</div>
        <h3>Your library is empty</h3>
        <p>Start adding your first book!</p>
      </div>
    );
  }

  return (
    <div className="list-cards">
      {books.map((book) => (
        <article key={book.id} className="book-card card">
          <div className="book-info">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">{book.author}</p>
            <p className="book-meta">{book.genre || "—"} • <span className="pill">{book.status}</span></p>
          </div>

          <div className="book-right">
            <div className="book-rating">
            {book.rating ? `${book.rating} / 5` : "No rating"}
            </div>
            <div className="card-actions">
              <button className="btn btn-outline" onClick={() => onEdit(book)}>Edit</button>
              <button className="btn btn-danger" onClick={() => onDelete(book.id)}>Delete</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
