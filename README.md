# Frontend (Vite + React)

Quick start:

1. From project root, open a terminal and run:

```powershell
cd "c:/Users/dubey/OneDrive/Desktop/Ankit/student portal/frontend"
npm install
npm run dev
```

2. Copy `.env.example` to `.env` and set `VITE_API_URL` if backend isn't at `http://localhost:4000`.

Pages:
- `/login` — login for admin (username) or student (userId)
- `/admin` — admin dashboard (create student, assign course, view submissions)
- `/student` — student dashboard (view courses, modules, submit links)

This is a minimal demo for the MVP; improve UX and validation before production.
