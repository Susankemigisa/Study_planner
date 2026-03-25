# Simple in-memory store (acts as our "database" for this demo)
# In a real project this would be replaced with SQLite/PostgreSQL + SQLAlchemy

db: dict = {}
_id_counter: int = 0


def get_next_id() -> int:
    global _id_counter
    _id_counter += 1
    return _id_counter
