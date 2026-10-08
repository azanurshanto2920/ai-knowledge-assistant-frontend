# AI Knowledge Assistant — Frontend

A React frontend for an AI chatbot that answers questions from uploaded PDF documents (RAG), with user registration and login.

## Live Demo

- **App:** [https://ai-knowledge-assistant-frontend-tau.vercel.app](https://ai-knowledge-assistant-frontend-tau.vercel.app)
- **Backend repository:** [ai-knowledge-assistant-backend](https://github.com/azanurshanto2920/ai-knowledge-assistant-backend)
- **Backend API docs:** [https://ai-knowledge-assistant-backend-1yuu.onrender.com/docs](https://ai-knowledge-assistant-backend-1yuu.onrender.com/docs)

> Note: The backend runs on a free tier and sleeps after inactivity. The first request (register or login) may take up to a minute. Uploaded PDFs are not stored permanently on the free tier.

## Features

- User registration and login (JWT token stored in the browser)
- Upload a PDF and ask questions about its content
- Chat interface with AI responses
- Automatic logout when the session expires

## Tech Stack

- React (Vite)
- Fetch API for communicating with the FastAPI backend
- Deployed on Vercel

## Running Locally

```bash
npm install
npm run dev
```

Create a `.env` file in the project root:

```
VITE_API_URL=http://127.0.0.1:8000
```

To use the live backend instead, set `VITE_API_URL` to the Render backend URL.