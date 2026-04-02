# Leaf Notes

Lightweight, Google Keep-style notes app with a minimal UI, dark mode, voice-to-text, and a playful card grid. Built as a full-stack React + Express + MongoDB project.

## Features
- Create, edit, delete notes with color tags.
- Image attachment stored inline (base64 for simplicity).
- Real-time search filter.
- Dark mode toggle.
- Voice-to-text using the Web Speech API (works in Chromium-based browsers).
- Quick AI-ish summarizer (client-side heuristic for brevity).
- Smooth hover/entrance animations, humanized grid spacing, loading and empty states.

## Project Structure
- `backend/` - Express API (`/api/notes`) with MongoDB via Mongoose.
- `frontend/` - Vite + React + Tailwind UI.

## Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017/leaf-notes` by default)

## Setup and Run
From `notes-app/`:

1) Backend  
   - `cd backend`  
   - `cp .env.example .env` and tweak if needed.  
   - `npm install`  
   - `npm run dev`

2) Frontend  
   - In a new terminal: `cd frontend`  
   - `npm install`  
   - `npm run dev`  
   - Visit the URL Vite prints (default `http://localhost:5173`).

API base URL is proxied via Vite (`/api` -> `http://localhost:4000`).

## Notes on Implementation
- Notes are stored with `title`, `content`, `color`, optional `imageData`, plus timestamps.
- Image uploads are kept simple (Data URL); a production variant could move this to object storage.
- Voice input gracefully degrades if the browser lacks `SpeechRecognition`.
- The grid intentionally has slight offsets for a more "lived-in" feel.

## Scripts
- Backend: `npm run dev`, `npm start`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## Quick API Reference
- `GET /api/notes` - list notes
- `POST /api/notes` - create note `{ title, content, color, imageData? }`
- `PUT /api/notes/:id` - update note
- `DELETE /api/notes/:id` - remove note

## Testing the flow
1. Start MongoDB locally.
2. Run backend then frontend.
3. Create a note, try color tags, upload a small image, tap "Voice to text," and toggle dark mode.

Feel free to riff on the styles or extend with auth, pinning, or better summarization later.
