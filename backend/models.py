from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy import CheckConstraint

# Initialize SQLAlchemy (will be bound to app in app.py)
db = SQLAlchemy()

VALID_STATUSES = ("Want to Read", "Reading", "Completed")


class Book(db.Model):
    """Book model representing a single book in the personal library.

    Pillar 1 (Blueprint): schema/types/defaults defined here.
    Pillar 4 (Shield): NOT NULL + CHECK constraints enforce integrity
    at the database layer, not just in application code.
    """

    __tablename__ = "books"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    genre = db.Column(db.String(100))
    status = db.Column(db.String(50), nullable=False, default="Want to Read")
    rating = db.Column(db.Integer)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        # CHECK constraint: rating must be between 1 and 5, or left empty
        CheckConstraint(
            "rating IS NULL OR (rating >= 1 AND rating <= 5)",
            name="ck_books_rating_range",
        ),
        # CHECK constraint: status must be one of the allowed values
        CheckConstraint(
            "status IN ('Want to Read', 'Reading', 'Completed')",
            name="ck_books_status_valid",
        ),
    )

    def to_dict(self):
        """Return a dict representation suitable for JSON responses."""
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "genre": self.genre,
            "status": self.status,
            "rating": self.rating,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }