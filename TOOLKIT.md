# 📚 Prompt-Powered Kickstart: Building a Beginner's Toolkit for FastAPI

**Student:** Kemigisa Suzan
**Cohort:** Moringa School — AI Capstone
**Submission Date:** March 2026

---

## 1. Title & Objective

### Getting Started with FastAPI — A Beginner's Guide to Building REST APIs with Python

**What technology did you choose?**
**FastAPI** — a modern, high-performance Python web framework for building REST APIs.

**Why did you choose it?**
FastAPI sits at the intersection of Python (a language I am comfortable with) and real-world backend development. Every modern application — from mobile apps to dashboards — needs an API layer, and FastAPI is one of the fastest ways to build one. It also has one of the best beginner experiences of any framework: you write a function, add a decorator, and you have a working endpoint. I also wanted to experience how AI tools can accelerate backend development, from scaffolding routes to debugging validation errors.

**What is the end goal?**
Build and run a fully functional **Study Planner API** with four CRUD endpoints (GET, POST, PUT, DELETE), Pydantic data validation, and auto-generated interactive documentation — all accessible at `http://127.0.0.1:8000/docs` without writing a single line of documentation manually.

---

## 2. Quick Summary of the Technology

### What is FastAPI?

FastAPI is a **modern Python web framework** designed specifically for building APIs quickly and correctly. It was created by Sebastián Ramírez and released in 2018. Unlike older frameworks like Flask or Django REST Framework, FastAPI is built on top of Python's type hints and leverages them to automatically validate data, generate documentation, and catch bugs at development time rather than at runtime.

### Where is it used?

FastAPI is used across the industry for:
- **Microservices** — small, focused APIs that do one thing well
- **Machine Learning APIs** — serving ML model predictions (e.g. wrapping a trained model)
- **Internal tools** — dashboards, admin panels, automation APIs
- **Mobile backends** — powering iOS/Android apps with a JSON API

### One real-world example

**Netflix** uses FastAPI internally for some of its crisis management and internal tooling APIs. **Uber** has also adopted it for internal services. For a more beginner-visible example: any time you use a weather app that fetches today's forecast, there is an API server behind it — FastAPI is exactly the kind of tool used to build that server.

### Key advantages over alternatives

| Feature | FastAPI | Flask | Django REST |
|---|---|---|---|
| Auto docs (Swagger) | ✅ Built-in | ❌ Plugin needed | ❌ Plugin needed |
| Data validation | ✅ Pydantic | ❌ Manual | ✅ Serializers |
| Speed | ⚡ Very fast | 🐢 Moderate | 🐢 Moderate |
| Learning curve | 🟢 Gentle | 🟢 Gentle | 🔴 Steep |
| Type safety | ✅ Native | ❌ Optional | ❌ Optional |

---

## 3. System Requirements

| Requirement | Version | Notes |
|---|---|---|
| **OS** | Windows 10/11, macOS 12+, Ubuntu 20.04+ | Any modern OS works |
| **Python** | 3.10 or higher | Check with `python --version` |
| **pip** | Latest | Comes with Python |
| **VS Code** | Any recent version | Recommended editor |
| **Node.js** | 18+ | Only needed for React frontend |
| **npm** | 9+ | Comes with Node.js |
| **Browser** | Chrome, Firefox, or Edge | For Swagger UI testing |

### Checking your Python version

```bash
python --version
# Should output: Python 3.10.x or higher
```

If Python is not installed, download it from [https://python.org/downloads](https://python.org/downloads). On Windows, tick **"Add Python to PATH"** during installation.

---

## 4. Installation & Setup Instructions

### Step 1 — Download and extract the project

Unzip `study_planner_api.zip` into a folder of your choice.

```
study_planner_api/
├── app/
│   ├── main.py
│   ├── models.py
│   └── database.py
├── requirements.txt
└── README.md
```

### Step 2 — Open the project in VS Code

```bash
cd study_planner_api
code .
```

### Step 3 — Create a virtual environment

A virtual environment keeps your project's dependencies isolated from the rest of your system.

```bash
# Create the virtual environment
python -m venv venv
```

```bash
# Activate it on Mac/Linux
source venv/bin/activate

# Activate it on Windows (Command Prompt)
venv\Scripts\activate

# Activate it on Windows (PowerShell)
venv\Scripts\Activate.ps1
```

When activated, your terminal prompt will show `(venv)` at the start — that's how you know it worked.

### Step 4 — Install dependencies

```bash
pip install -r requirements.txt
```

Expected output:
```
Successfully installed fastapi-0.111.0 pydantic-2.7.1 uvicorn-0.29.0 ...
```

### Step 5 — Run the server

```bash
uvicorn app.main:app --reload
```

Expected output:
```
INFO:     Will watch for changes in these directories: ['/path/to/study_planner_api']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Step 6 — Open the interactive docs

Go to **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)** in your browser.

You will see the **Swagger UI** — a full interactive documentation page listing all your endpoints. You can test every endpoint directly from this page without any extra tools.

> 💡 **What is `--reload`?** It tells Uvicorn to watch your files and automatically restart the server when you save a change. Remove it in production.

---

## 5. Minimal Working Example

### What the example does

The Study Planner API is a CRUD (Create, Read, Update, Delete) application for managing study sessions. Each session has:
- A **subject** (e.g. "Mathematics")
- A **topic** (e.g. "Calculus — Integration")
- A **duration** in minutes
- A **status**: `pending`, `in_progress`, or `done`

The data lives in memory — no database setup required. When you stop the server, the data resets. This is intentional for a beginner project.

### The core code — `app/main.py`

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import Task, TaskCreate, TaskUpdate
from app.database import db, get_next_id

# Create the FastAPI application instance
app = FastAPI(
    title="Study Planner API",
    description="Manage your study sessions — built with FastAPI.",
    version="1.0.0"
)

# Allow the frontend to call the API from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# GET / — welcome message
@app.get("/")
def root():
    return {"message": "Welcome! Visit /docs to explore the API."}

# GET /tasks — return all study sessions
@app.get("/tasks", response_model=list[Task])
def get_all_tasks():
    return list(db.values())

# POST /tasks — create a new study session
@app.post("/tasks", response_model=Task, status_code=201)
def create_task(task: TaskCreate):
    task_id = get_next_id()              # auto-increment ID
    new_task = Task(id=task_id, **task.model_dump())
    db[task_id] = new_task               # store in memory
    return new_task

# PUT /tasks/{id} — update an existing session
@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, updates: TaskUpdate):
    if task_id not in db:
        raise HTTPException(status_code=404, detail="Task not found")
    existing = db[task_id].model_dump()
    existing.update({k: v for k, v in updates.model_dump().items() if v is not None})
    db[task_id] = Task(**existing)
    return db[task_id]

# DELETE /tasks/{id} — remove a session
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    if task_id not in db:
        raise HTTPException(status_code=404, detail="Task not found")
    del db[task_id]
    return {"message": f"Task {task_id} deleted successfully"}
```

### The data model — `app/models.py`

```python
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

# Enum restricts status to exactly these three values
class StatusEnum(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    done = "done"

# Schema used when CREATING a task (no ID yet)
class TaskCreate(BaseModel):
    subject: str = Field(..., example="Mathematics")
    topic: str = Field(..., example="Calculus - Integration")
    duration_minutes: int = Field(..., ge=1, example=60)
    status: StatusEnum = Field(default=StatusEnum.pending)

# Schema used when UPDATING a task (all fields optional)
class TaskUpdate(BaseModel):
    subject: Optional[str] = None
    topic: Optional[str] = None
    duration_minutes: Optional[int] = Field(default=None, ge=1)
    status: Optional[StatusEnum] = None

# Full task schema — includes the auto-generated ID
class Task(BaseModel):
    id: int
    subject: str
    topic: str
    duration_minutes: int
    status: StatusEnum
```

### Testing with Swagger UI — step by step

1. With the server running, open `http://127.0.0.1:8000/docs`
2. Click **POST /tasks** → **Try it out**
3. Paste this into the request body:
```json
{
  "subject": "Python",
  "topic": "FastAPI basics",
  "duration_minutes": 45,
  "status": "pending"
}
```
4. Click **Execute**

**Expected response — 201 Created:**
```json
{
  "id": 1,
  "subject": "Python",
  "topic": "FastAPI basics",
  "duration_minutes": 45,
  "status": "pending"
}
```

5. Click **GET /tasks** → **Try it out** → **Execute**

**Expected response — 200 OK:**
```json
[
  {
    "id": 1,
    "subject": "Python",
    "topic": "FastAPI basics",
    "duration_minutes": 45,
    "status": "pending"
  }
]
```

6. Click **PUT /tasks/{task_id}** → **Try it out** → set `task_id` to `1`
7. Paste `{ "status": "done" }` and Execute
8. Click **DELETE /tasks/{task_id}** → set `task_id` to `1` → Execute

---

## 6. AI Prompt Journal

All prompts were used via **[ai.moringaschool.com](https://ai.moringaschool.com)** (Claude by Anthropic).

---

### Prompt 1 — Project setup

**Prompt used:**
> *"Give me a step-by-step guide to set up a FastAPI project with a virtual environment on Windows, including how to install dependencies and run the server with Uvicorn."*

**Curriculum link:** Week 1 — Setting Up Your Development Environment

**AI response summary:**
The AI produced a complete setup walkthrough: creating a venv, activating it on both Windows and Mac/Linux, installing FastAPI and Uvicorn via pip, and running the server. It also explained the `--reload` flag and why it matters during development.

**Helpfulness rating:** ⭐⭐⭐⭐⭐
Saved roughly 30–45 minutes of reading documentation. The Windows-specific activation command (`venv\Scripts\activate`) was something I would have gotten wrong on my own.

---

### Prompt 2 — Pydantic models

**Prompt used:**
> *"Show me how to create a Pydantic v2 model for a Task object with subject, topic, duration_minutes, and status fields. Status should only accept the values pending, in_progress, or done."*

**Curriculum link:** Week 2 — Data Validation with Pydantic

**AI response summary:**
The AI introduced Python `Enum` for restricting the status field to exactly three values, and showed the difference between `TaskCreate` (no ID), `TaskUpdate` (all optional fields), and `Task` (full schema with ID). This three-model pattern is a FastAPI best practice I wouldn't have known without the AI.

**Helpfulness rating:** ⭐⭐⭐⭐⭐
The explanation of *why* you need three separate models — not just one — was the most valuable learning moment of the project.

---

### Prompt 3 — CRUD routes

**Prompt used:**
> *"Write all five CRUD endpoints for the Task model in FastAPI — GET all tasks, GET one task by ID, POST a new task, PUT to update a task, DELETE a task. Use an in-memory dictionary as the data store."*

**Curriculum link:** Week 2 — Building REST Endpoints

**AI response summary:**
The AI produced all five route handlers with correct HTTP methods, path parameters, response models, and status codes (201 for POST, 404 for not-found errors). It also used `HTTPException` for error handling, which I then looked up to understand properly.

**Helpfulness rating:** ⭐⭐⭐⭐☆
Very useful as a starting scaffold. I had to ask a follow-up about what `**task.model_dump()` does because I didn't understand dictionary unpacking in that context.

---

### Prompt 4 — Debugging a 422 error

**Prompt used:**
> *"I'm getting a 422 Unprocessable Entity error when I POST to /tasks. Here is my request body: `{ 'subject': 'Math', 'duration_minutes': 60 }`. Here is my Pydantic model: [pasted model]. What is wrong?"*

**Curriculum link:** Week 3 — Debugging API Errors

**AI response summary:**
The AI immediately identified that the `topic` field was required in `TaskCreate` but missing from my request body. It also explained what a 422 error means in FastAPI — Pydantic rejected the input before it even reached my function — and showed how to read the error detail array in the response body to diagnose validation failures myself in the future.

**Helpfulness rating:** ⭐⭐⭐⭐⭐
Without AI this would have taken me much longer to debug. The explanation of *how to read* a 422 response is something I can reuse on every future project.

---

### Prompt 5 — CORS middleware

**Prompt used:**
> *"My React frontend is running on localhost:5173 and my FastAPI server is on localhost:8000. The browser is throwing a CORS error. How do I fix this in FastAPI?"*

**Curriculum link:** Week 3 — Cross-Origin Resource Sharing

**AI response summary:**
The AI explained what CORS is (browsers block requests between different origins by default as a security measure), and showed how to add `CORSMiddleware` to the FastAPI app with `allow_origins=["*"]` for development. It also warned that `["*"]` should be replaced with specific origins in production.

**Helpfulness rating:** ⭐⭐⭐⭐⭐
CORS errors are one of the most confusing issues for beginners because the error shows in the browser, not the server. The conceptual explanation made it click.

---

### Prompt 6 — React input cursor bug

**Prompt used:**
> *"My React form inputs have a cursor bug — after typing one character the cursor jumps out of the input and I have to click it again. The inputs use useState and onChange. What's causing this and how do I fix it?"*

**Curriculum link:** Week 4 — React State and Re-renders

**AI response summary:**
The AI diagnosed the root cause: `useState` triggers a full component re-render on every keystroke, which causes React to re-mount the input element and lose focus. The fix was to switch to `useRef` with `defaultValue` (uncontrolled inputs) instead of `value` + `onChange` (controlled inputs). This only matters in forms — for display data, `useState` is still correct.

**Helpfulness rating:** ⭐⭐⭐⭐⭐
This was the most surprising debugging session. I had never heard of the controlled vs uncontrolled input distinction before. The AI not only fixed the bug but taught me a React concept that will affect how I write forms forever.

---

### Prompt 7 — Countdown timer component

**Prompt used:**
> *"Build a React countdown timer component that takes a totalSeconds prop. It should show a circular SVG progress ring that shrinks as time runs out, and change colour from green to amber to red. Include play, pause and reset buttons."*

**Curriculum link:** Week 4 — React Components and Hooks

**AI response summary:**
The AI built the full `CountdownTimer` component using `useEffect` and `setInterval` for the tick logic, SVG `stroke-dasharray` and `stroke-dashoffset` for the animated ring, and conditional colour logic based on the percentage of time remaining. It also handled the cleanup function in `useEffect` to prevent memory leaks when the component unmounts.

**Helpfulness rating:** ⭐⭐⭐⭐⭐
I would not have known how to compute SVG arc offsets for the progress ring. The AI turned what would have been a two-day task into a two-minute one — and explained the maths behind it.

---

## 7. Common Issues & Fixes

### Issue 1 — `ModuleNotFoundError: No module named 'fastapi'`

**What happened:** Running `uvicorn app.main:app` gave an import error even after installing FastAPI.

**Root cause:** The virtual environment was not activated, so Python was using the global interpreter which didn't have FastAPI installed.

**Fix:**
```bash
# Always activate before running
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows
```

**How I found it:** Asked the AI: *"I installed FastAPI but Python says it can't find the module. What's wrong?"*

---

### Issue 2 — `422 Unprocessable Entity`

**What happened:** POST /tasks returned a 422 error instead of creating a task.

**Root cause:** My request body was missing the required `topic` field. Pydantic rejected it before the route function even ran.

**Fix:** Always check the `detail` array in the 422 response body — it tells you exactly which field failed and why:
```json
{
  "detail": [
    {
      "loc": ["body", "topic"],
      "msg": "Field required",
      "type": "missing"
    }
  ]
}
```

**Reference:** [https://docs.pydantic.dev/latest/errors/validation_errors/](https://docs.pydantic.dev/latest/errors/validation_errors/)

---

### Issue 3 — CORS error in browser console

**What happened:** The React frontend showed `Access to fetch at 'http://127.0.0.1:8000/tasks' from origin 'http://localhost:5173' has been blocked by CORS policy`.

**Root cause:** FastAPI did not have CORS middleware configured, so the browser refused cross-origin requests.

**Fix:** Add this to `main.py` before your routes:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Reference:** [https://fastapi.tiangolo.com/tutorial/cors/](https://fastapi.tiangolo.com/tutorial/cors/)

---

### Issue 4 — React input cursor jumping

**What happened:** Typing in the "Add Session" form caused the cursor to leave the input after every character.

**Root cause:** Using `useState` + `onChange` for form inputs causes React to re-render on every keystroke, which re-mounts the input and loses focus.

**Fix:** Switch to uncontrolled inputs using `useRef` and `defaultValue`:
```jsx
// Before (causes lag)
const [name, setName] = useState('')
<input value={name} onChange={e => setName(e.target.value)} />

// After (no lag)
const nameRef = useRef()
<input ref={nameRef} defaultValue="" />
// Then read: nameRef.current.value on submit
```

---

### Issue 5 — `PUT /tasks/{id}` returns "Value must be an integer"

**What happened:** Trying to update a task in Swagger UI gave a validation error on the `task_id` parameter.

**Root cause:** The `task_id` field in the Swagger UI path parameters was left empty.

**Fix:** Always fill in the path parameter field (e.g. type `1`) before clicking Execute on any endpoint that has `{task_id}` in its URL.

---

### Issue 6 — Stat numbers showing as icons

**What happened:** The React dashboard showed icons (⊙) instead of numbers in the stat cards.

**Root cause:** Google Fonts (Syne) failed to load due to no internet connection or a slow network. The font used for numbers didn't have proper fallbacks.

**Fix:** Added system font fallbacks to the CSS variable:
```css
--font-display: 'Syne', Georgia, serif;
```
Numbers now display correctly even without the custom font loaded.

---

## 8. Peer Testing

### Testing Process

After completing the project, I asked a fellow student (who had not seen the project before) to follow this toolkit document from scratch on their own machine. The goal was to check whether the instructions were clear enough for someone with no prior knowledge of FastAPI.

### What they tried

- Set up the virtual environment and install dependencies
- Run the server and open Swagger UI
- Create, update and delete a task using the Swagger UI
- Open the React frontend and add a session

### Issues they encountered

| Issue found during peer test | Change made |
|---|---|
| Confused by `venv\Scripts\Activate.ps1` vs `venv\Scripts\activate` on Windows PowerShell | Added a separate PowerShell activation command to Step 3 |
| Did not know what `(venv)` in the terminal meant | Added a note explaining the `(venv)` prefix indicates successful activation |
| Left `task_id` empty in PUT endpoint and got a validation error | Added Issue 5 to the Common Issues section |
| Unsure whether to open `frontend/index.html` or `frontend-dist/index.html` | Clarified in the Frontend section that `frontend-dist` is the pre-built version |

### Outcome

After applying the above changes, the peer was able to run the full project end-to-end without assistance in under 10 minutes. They described the Swagger UI as "the coolest thing about this project" — which validates it as the right testing method to highlight in the documentation.

---

## 9. Learning Reflections

> *How did using Generative AI change the way I learned FastAPI?*

**1. AI collapsed the setup time from hours to minutes.**
The first time I tried to set up a Python web project on my own, I spent two hours debugging environment issues. With AI, the entire setup — venv, dependencies, first route, running server — took under 20 minutes. That time saving went directly into understanding the code rather than fighting configuration.

**2. Specificity in prompts is a skill.**
My first prompt was *"build me a CRUD API in FastAPI"*. The result was overwhelming — too much code at once, hard to follow. When I broke it into smaller, specific prompts (*"just show me the POST endpoint for creating a Task"*), the answers were immediately usable. Prompt engineering is not magic — it is just being precise about what you need.

**3. AI is best used to explain, not just generate.**
The most valuable prompts were the "why" ones: *"why do I need three Pydantic models instead of one?"*, *"why does a 422 error happen before my route function runs?"* Those explanations gave me a mental model that I could apply to new problems the AI didn't help me with.

**4. Debugging with AI requires sharing context.**
When I pasted an error without any code, the AI gave generic answers. When I pasted the error + my model + my request body, it diagnosed the problem immediately. The lesson: always give the AI your context — it cannot see your screen.

**5. There are things AI won't teach you until you hit them.**
The React cursor bug, the CORS error, the PowerShell vs Command Prompt activation — none of these came up in tutorials. They only appear when you actually build something. That is why building a real project, even a small one, teaches more than reading documentation.

---

## References

| Resource | Link |
|---|---|
| FastAPI Official Documentation | [https://fastapi.tiangolo.com](https://fastapi.tiangolo.com) |
| FastAPI Tutorial — First Steps | [https://fastapi.tiangolo.com/tutorial/first-steps/](https://fastapi.tiangolo.com/tutorial/first-steps/) |
| Pydantic v2 Documentation | [https://docs.pydantic.dev/latest](https://docs.pydantic.dev/latest) |
| Uvicorn Documentation | [https://www.uvicorn.org](https://www.uvicorn.org) |
| FastAPI CORS Middleware | [https://fastapi.tiangolo.com/tutorial/cors/](https://fastapi.tiangolo.com/tutorial/cors/) |
| Python Virtual Environments Guide | [https://docs.python.org/3/library/venv.html](https://docs.python.org/3/library/venv.html) |
| React useRef Hook | [https://react.dev/reference/react/useRef](https://react.dev/reference/react/useRef) |
| Framer Motion Documentation | [https://www.framer.com/motion/](https://www.framer.com/motion/) |
| HTTP Status Codes (MDN) | [https://developer.mozilla.org/en-US/docs/Web/HTTP/Status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) |
| REST API Design Best Practices | [https://restfulapi.net](https://restfulapi.net) |
| StackOverflow — FastAPI 422 Error | [https://stackoverflow.com/questions/tagged/fastapi](https://stackoverflow.com/questions/tagged/fastapi) |
| StackOverflow — React input cursor bug | [https://stackoverflow.com/questions/28922275/in-reactjs-why-does-setstate-behave-differently-when-called-synchronously](https://stackoverflow.com/questions/28922275/in-reactjs-why-does-setstate-behave-differently-when-called-synchronously) |

---

*Document prepared with AI assistance via [ai.moringaschool.com](https://ai.moringaschool.com) — Moringa School AI Capstone, March 2026.*
