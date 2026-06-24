from flask import Blueprint, request, jsonify
from models import db, Book, VALID_STATUSES

bp = Blueprint("api", __name__)


def _validate_rating(rating):
    """Returns an error string if invalid, else None."""
    if rating is None:
        return None
    if not isinstance(rating, int) or isinstance(rating, bool):
        return "Rating must be an integer between 1 and 5"
    if rating < 1 or rating > 5:
        return "Rating must be between 1 and 5"
    return None


def _validate_status(status):
    if status is not None and status not in VALID_STATUSES:
        return f"Status must be one of {VALID_STATUSES}"
    return None


@bp.route("/books", methods=["POST"])
def create_book():
    """Create a new book from JSON payload. (Create / HTTP POST / SQL INSERT)"""
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    author = (data.get("author") or "").strip()

    if not title or not author:
        return jsonify({"error": "Title and author are required"}), 400

    genre = data.get("genre")
    status = data.get("status") or "Want to Read"
    rating = data.get("rating")

    status_error = _validate_status(status)
    if status_error:
        return jsonify({"error": status_error}), 400

    rating_error = _validate_rating(rating)
    if rating_error:
        return jsonify({"error": rating_error}), 400

    book = Book(title=title, author=author, genre=genre, status=status, rating=rating)
    db.session.add(book)
    db.session.commit()

    return jsonify({"message": "Book added successfully", "book": book.to_dict()}), 201


@bp.route("/books", methods=["GET"])
def get_books():
    """Return all books. (Read / HTTP GET / SQL SELECT)"""
    books = Book.query.order_by(Book.created_at.desc()).all()
    return jsonify([book.to_dict() for book in books])


@bp.route("/books/<int:book_id>", methods=["GET"])
def get_book(book_id):
    """Return a single book by id. (Read / HTTP GET / SQL SELECT)"""
    book = db.session.get(Book, book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    return jsonify(book.to_dict())


@bp.route("/books/<int:book_id>", methods=["PUT"])
def update_book(book_id):
    """Update a book record. (Update / HTTP PUT / SQL UPDATE)"""
    book = db.session.get(Book, book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    data = request.get_json(silent=True) or {}

    if "status" in data:
        status_error = _validate_status(data.get("status"))
        if status_error:
            return jsonify({"error": status_error}), 400

    if "rating" in data:
        rating_error = _validate_rating(data.get("rating"))
        if rating_error:
            return jsonify({"error": rating_error}), 400

    if "title" in data and not (data.get("title") or "").strip():
        return jsonify({"error": "Title cannot be empty"}), 400
    if "author" in data and not (data.get("author") or "").strip():
        return jsonify({"error": "Author cannot be empty"}), 400

    for field in ("title", "author", "genre", "status", "rating"):
        if field in data:
            setattr(book, field, data.get(field))

    db.session.commit()
    return jsonify({"message": "Book updated successfully", "book": book.to_dict()})


@bp.route("/books/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    """Delete a book by id. (Delete / HTTP DELETE / SQL DELETE)"""
    book = db.session.get(Book, book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully"})