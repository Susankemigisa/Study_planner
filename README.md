<div align="center">

# 📚 Study Planner API

### Your AI-assisted study session manager — built with FastAPI

*Moringa School AI Capstone Project — Prompt-Powered Kickstart*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Pydantic](https://img.shields.io/badge/Pydantic-v2-E92063?style=flat-square&logo=pydantic&logoColor=white)](https://docs.pydantic.dev)
[![License](https://img.shields.io/badge/License-MIT-b8f060?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

[Features](#-features) • [Quick Start](#-quick-start) • [API Docs](#-api-endpoints) • [Frontend](#-frontend) • [AI Prompts](#-ai-prompt-journal)

---

![Study Planner Banner](https://img.shields.io/badge/Study_Planner-FastAPI_%2B_React-b8f060?style=for-the-badge&labelColor=0f0f1a)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [System Requirements](#-system-requirements)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Frontend](#-frontend)
- [AI Prompt Journal](#-ai-prompt-journal)
- [Common Issues & Fixes](#-common-issues--fixes)
- [Learning Reflections](#-learning-reflections)
- [References](#-references)

---

## 🎯 Project Overview

**Study Planner API** is a beginner-friendly REST API built with **FastAPI** as part of the Moringa School AI Capstone Project. The project demonstrates how Generative AI can be used as a learning companion to explore, scaffold, and build a real-world backend application from scratch.

The API manages study sessions — allowing users to create, read, update, and delete study blocks with subjects, topics, durations, and statuses. It is paired with a polished **React + Framer Motion** frontend dashboard.

> **End Goal:** A fully functional CRUD API with auto-generated Swagger docs at `/docs`, live status cycling, and a session countdown timer — all scaffolded with AI assistance.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📖 **CRUD Endpoints** | Create, Read, Update and Delete study sessions |
| ✅ **Status Tracking** | Three states — `pending`, `in_progress`, `done` |
| ⏱️ **Session Timer** | Per-session countdown with circular progress ring |
| 📊 **Live Stats Dashboard** | Real-time stat cards that update on every action |
| 🔍 **Filter & Sort** | Filter sessions by status with animated tabs |
| 🤖 **Auto Docs** | Interactive Swagger UI at `/docs` out of the box |
| 🎨 **React Frontend** | Dark-theme dashboard with Framer Motion animations |
| 🔔 **Toast Notifications** | Feedback toasts for every create / update / delete action |
| 🛡️ **Input Validation** | Pydantic v2 models with type checking on all fields |
| 🌐 **CORS Enabled** | Frontend can communicate with the API from any origin |

---

## 🛠 Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** — Modern Python web framework for building REST APIs
- **[Uvicorn](https://www.uvicorn.org/)** — ASGI server for running FastAPI
- **[Pydantic v2](https://docs.pydantic.dev/)** — Data validation and serialisation

### Frontend
- **[React 18](https://react.dev/)** — Component-based UI library
- **[Framer Motion](https://www.framer.com/motion/)** — Spring animations and transitions
- **[Lucide React](https://lucide.dev/)** — Icon library
- **[Vite](https://vitejs.dev/)** — Lightning-fast build tool

---

## 📁 Project Structure

```
study_planner_api/
│
├── app/
│   ├── __init__.py         # Package init
│   ├── main.py             # FastAPI app, routes, CORS middleware
│   ├── models.py           # Pydantic schemas (TaskCreate, TaskUpdate, Task)
│   └── database.py         # In-memory data store + ID counter
│
├── frontend/               # React source (dev)
│   ├── src/
│   │   ├── App.jsx         # Full UI — stats, task cards, drawer, timer
│   │   └── index.css       # CSS variables and global styles
│   ├── index.html
│   └── package.json
│
├── frontend-dist/          # Pre-built React app (open directly in browser)
│   ├── index.html
│   └── assets/
│
├── requirements.txt        # Python dependencies
└── README.md
```

---

## 💻 System Requirements

| Requirement | Version |
|---|---|
| **OS** | Windows 10/11, macOS 12+, Ubuntu 20.04+ |
| **Python** | 3.10 or higher |
| **Node.js** | 18+ (only needed for frontend dev server) |
| **npm** | 9+ |
| **Editor** | VS Code (recommended) |
| **Browser** | Chrome, Firefox, or Edge |

---

## 🚀 Quick Start

### 1. Clone or unzip the project

```bash
# If cloning from GitHub
git clone https://github.com/your-username/study-planner-api.git
cd study-planner-api

# Or unzip and navigate into the folder
cd study_planner_api
```

### 2. Set up Python virtual environment

```bash
# Create the virtual environment
python -m venv venv

# Activate it — Mac/Linux
source venv/bin/activate

# Activate it — Windows
venv\Scripts\activate
```

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the API server

```bash
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process using WatchFiles
```

### 5. Open the interactive docs

Visit **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)** in your browser to see the full Swagger UI.

---

## 📡 API Endpoints

Base URL: `http://127.0.0.1:8000`

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/` | Welcome message | `200` |
| `GET` | `/tasks` | List all study sessions | `200` |
| `GET` | `/tasks/{id}` | Get a single session by ID | `200` |
| `POST` | `/tasks` | Create a new session | `201` |
| `PUT` | `/tasks/{id}` | Update a session (e.g. change status) | `200` |
| `DELETE` | `/tasks/{id}` | Delete a session | `200` |

### Example: Create a session

```bash
curl -X POST http://127.0.0.1:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Mathematics",
    "topic": "Calculus — Integration",
    "duration_minutes": 60,
    "status": "pending"
  }'
```

**Response:**
```json
{
  "id": 1,
  "subject": "Mathematics",
  "topic": "Calculus — Integration",
  "duration_minutes": 60,
  "status": "pending"
}
```

### Task Schema

```json
{
  "subject": "string",         // e.g. "Mathematics"
  "topic": "string",           // e.g. "Calculus — Integration"
  "duration_minutes": 60,      // integer, minimum 1
  "status": "pending"          // "pending" | "in_progress" | "done"
}
```

---

## 🎨 Frontend

The project includes a React dashboard that connects directly to the running API.

### Option A — Open pre-built (no npm needed)

1. Make sure the API server is running (`uvicorn app.main:app --reload`)
2. Open `frontend-dist/index.html` directly in your browser

### Option B — Run the dev server

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Frontend Features

- **Stat cards** — live counts for Total, Pending, In Progress, Completed
- **Filter tabs** — filter by status with smooth transitions
- **Task cards** — click to expand a countdown timer for each session
- **Slide-in drawer** — add new sessions with keyboard support (press `Enter` to submit)
- **Status cycling** — click the `›` button to cycle a task through all three statuses
- **Toast notifications** — instant feedback on every action
- **API status indicator** — live pulsing dot shows if the API is connected

---

## 🤖 AI Prompt Journal

This project was built using generative AI at every stage. Below are the key prompts used and what they produced.

| # | Prompt Used | What it helped with |
|---|---|---|
| 1 | *"Give me a step-by-step guide to set up a FastAPI project with a virtual environment on Windows"* | Scaffolded the full project setup including venv activation and uvicorn install |
| 2 | *"Show me how to create a Pydantic v2 model for a Task object with subject, topic, duration, and status fields"* | Generated the complete `models.py` with `TaskCreate`, `TaskUpdate`, and `Task` schemas |
| 3 | *"Write all four CRUD endpoints for the Task model in FastAPI — GET all, GET by ID, POST, PUT, DELETE"* | Produced all route handlers in `main.py` with correct HTTP status codes |
| 4 | *"Why am I getting a 422 Validation Error when I POST to /tasks?"* | Diagnosed a missing required field in the request body and explained Pydantic validation |
| 5 | *"How do I add CORS middleware to FastAPI so my React frontend can call the API?"* | Added `CORSMiddleware` with `allow_origins=["*"]` configuration |
| 6 | *"My React inputs have cursor lag — I have to click the field every time I type a letter. Why?"* | Identified `useState` re-render issue and switched to `useRef` for uncontrolled inputs |
| 7 | *"Build a countdown timer in React that shows a circular SVG progress ring and changes colour as time runs out"* | Built the full `CountdownTimer` component with play/pause/reset controls |

---

## 🐛 Common Issues & Fixes

### `ModuleNotFoundError: No module named 'fastapi'`
**Cause:** Virtual environment not activated.
```bash
# Activate it first
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
```

### `422 Unprocessable Entity` on POST
**Cause:** Missing or wrong field in the request body.
**Fix:** Check your JSON matches the schema exactly — all fields are required on creation.

### `CORS error` in browser console
**Cause:** FastAPI CORS middleware not configured.
**Fix:** Ensure `CORSMiddleware` is added in `main.py` with `allow_origins=["*"]`.

### Input cursor jumps after every character in React
**Cause:** `useState` triggers a full re-render on every keystroke, losing cursor position.
**Fix:** Use `useRef` and `defaultValue` instead of `value` + `onChange` for form inputs.

### `Port 8000 already in use`
**Cause:** Another process is already running on port 8000.
```bash
uvicorn app.main:app --reload --port 8001
```

### Numbers show as icons in React UI
**Cause:** Google Fonts (Syne) failed to load — no internet or slow connection.
**Fix:** The app uses system font fallbacks automatically. The UI still works correctly.

---

## 💡 Learning Reflections

> **What I learned building this project with AI:**

1. **AI is fastest when you're specific.** Vague prompts like *"build me a CRUD API"* gave bloated answers. Specific prompts like *"write a FastAPI POST endpoint that accepts a Pydantic model and returns a 201 status"* gave exactly what I needed.

2. **Understanding beats copy-pasting.** Every time I pasted code without understanding it, I hit a wall debugging. When I asked the AI *"explain why this line does X"*, I could fix the next error myself.

3. **FastAPI's auto-docs are a superpower.** Swagger UI at `/docs` meant I could test every endpoint without writing a single test file — which made the iteration loop extremely fast.

4. **React re-renders are subtle bugs.** The cursor lag issue taught me the difference between controlled (`useState`) and uncontrolled (`useRef`) inputs — something I wouldn't have found without using AI to diagnose it.

---

## 📚 References

| Resource | Link |
|---|---|
| FastAPI Official Docs | [https://fastapi.tiangolo.com](https://fastapi.tiangolo.com) |
| Pydantic v2 Docs | [https://docs.pydantic.dev/latest](https://docs.pydantic.dev/latest) |
| Uvicorn Docs | [https://www.uvicorn.org](https://www.uvicorn.org) |
| React Docs | [https://react.dev](https://react.dev) |
| Framer Motion Docs | [https://www.framer.com/motion](https://www.framer.com/motion) |
| HTTP Status Codes | [https://developer.mozilla.org/en-US/docs/Web/HTTP/Status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) |
| REST API Design Guide | [https://restfulapi.net](https://restfulapi.net) |

---

<div align="center">

Built with 🤖 AI assistance as part of the **Moringa School AI Capstone**

*"Prompt smart. Build small. Ship something mighty."*

</div>
