from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import Task, TaskCreate, TaskUpdate
from app.database import db, get_next_id

app = FastAPI(
    title="Study Planner API",
    description="A simple API to manage your study sessions — built with FastAPI.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Welcome message."""
    return {"message": "Welcome to the Study Planner API! Visit /docs to explore endpoints."}


@app.get("/tasks", response_model=list[Task])
def get_all_tasks():
    """Return all study sessions."""
    return list(db.values())


@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int):
    """Return a single study session by ID."""
    if task_id not in db:
        raise HTTPException(status_code=404, detail="Task not found")
    return db[task_id]


@app.post("/tasks", response_model=Task, status_code=201)
def create_task(task: TaskCreate):
    """Add a new study session."""
    task_id = get_next_id()
    new_task = Task(id=task_id, **task.model_dump())
    db[task_id] = new_task
    return new_task


@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, updates: TaskUpdate):
    """Update a study session (e.g. mark as done)."""
    if task_id not in db:
        raise HTTPException(status_code=404, detail="Task not found")
    existing = db[task_id]
    updated_data = existing.model_dump()
    updated_data.update({k: v for k, v in updates.model_dump().items() if v is not None})
    db[task_id] = Task(**updated_data)
    return db[task_id]


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    """Delete a study session."""
    if task_id not in db:
        raise HTTPException(status_code=404, detail="Task not found")
    del db[task_id]
    return {"message": f"Task {task_id} deleted successfully"}
