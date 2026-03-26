# Yoonis Tasks

A personal task tracking app built with React, TypeScript, and Vite. It does what it says — lets you create, organize, and track tasks across three lists, with an optional AI-assisted description feature powered by Google Gemini.

No backend. No database. No accounts. Everything lives in your browser's localStorage.

---

## What It Actually Does

- Create tasks with a title, description, and optional due date & time
- Organize tasks into three fixed lists: **Personal**, **Professional**, and **Learning**
- Mark tasks as complete, star them for priority, or delete them
- Filter across all tasks by: **Starred**, **Completed**, or **Upcoming** (future due dates only)
- Search tasks in real time by title or description
- Use the **AI Suggest** button to auto-generate a task description using Gemini 2.5 Flash
- See a productivity progress bar showing how many tasks you've completed
- Tasks persist across page refreshes via localStorage

---

## What It Does Not Do

- No editing of existing tasks — you can only create or delete
- No custom lists — the three lists are hardcoded
- No subtask UI — the data model supports it but it's never rendered
- No reminders or push notifications for due dates
- No sync across devices or browsers
- No user accounts or authentication
- AI feature requires internet and a valid Gemini API key with available quota

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| AI | Google Gemini 2.5 Flash (`@google/genai`) |
| Storage | Browser localStorage |

---

## Project Structure

```
personaltrackingsystem/
├── index.html                        ← Vite entry HTML
├── vite.config.ts                    ← Vite + Tailwind config
├── tsconfig.json                     ← TypeScript config
├── package.json                      ← Dependencies & scripts
├── .env                              ← Gemini API key (not committed)
└── src/
    ├── index.tsx                     ← React root mount
    ├── App.tsx                       ← Root component, all state
    ├── types.ts                      ← Task, List, FilterType interfaces
    ├── index.css                     ← Global styles
    ├── components/
    │   ├── Header.tsx                ← Search + progress bar + New Task button
    │   ├── Sidebar.tsx               ← Smart views + list navigation
    │   ├── TaskItem.tsx              ← Task card (expand, complete, star, delete)
    │   └── NewTaskModal.tsx          ← Task creation modal with AI suggest
    └── services/
        └── geminiService.ts          ← Gemini API call with retry logic
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your Gemini API key

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com). The AI Suggest feature won't work without it, but the rest of the app will.

### 3. Run the dev server

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
```

---

## Data Model

```ts
interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isStarred: boolean;
  listId: string;           // "inbox" | "work" | "hobbies"
  createdAt: number;        // Unix timestamp
  dueDate?: string;         // ISO datetime string, optional
  subtasks?: string[];      // Exists in model, not rendered in UI
}
```

All tasks are stored as a JSON array under the localStorage key `aura-tasks`.

---

## AI Feature

The **AI Suggest** button in the task creation modal sends the task title to Gemini 2.5 Flash and returns a 2–3 sentence actionable description.

- Retries up to 3 times with exponential backoff (2s, 4s) on rate limit errors (HTTP 429)
- Displays a user-facing error message if all retries fail
- Silently skipped if no API key is present

Free tier limits apply. If you hit 429 frequently, wait a minute or generate a new API key.

---

## Known Limitations

These are real gaps, not future roadmap items:

- **No task editing** — deleting and recreating is the only option
- **No custom lists** — hardcoded to three categories
- **Subtasks field is dead** — it's in the type definition but never used
- **No overdue notifications** — overdue tasks turn red visually but nothing alerts you
- **localStorage only** — clearing browser data wipes everything
- **Single user, single device** — no cloud sync of any kind

---

## License

All rights reserved © Yoonis Tasks
