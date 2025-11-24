# Ultraship POC - Setup Guide

## Architecture

This project runs both **Next.js frontend** and **Express backend** on the **same port (3000)**.

### How it Works

- Custom Express server (`server.js`) serves the Next.js application
- Express routes handle `/api/*` endpoints **before** Next.js
- All other routes are handled by Next.js
- Both frontend and backend run together in a single process

## Project Structure

```
ultraship-poc/
├── server.js              # Custom Express server (entry point)
├── src/
│   └── app/
│       ├── page.tsx       # Home page with API testing UI
│       ├── layout.tsx     # Root layout
│       └── api/
│           └── hello/
│               └── route.ts  # Next.js API route (alternative)
└── package.json
```

## API Endpoints

### Express Routes (Handled First)

#### GET `/api/hello`
Returns a simple hello message from Express backend.

**Response:**
```json
{
  "message": "Hello from Express backend!"
}
```

#### POST `/api/hello`
Returns a personalized greeting.

**Request Body:**
```json
{
  "name": "John"
}
```

**Response:**
```json
{
  "message": "Hello John from Express backend!",
  "timestamp": "2025-11-24T..."
}
```

#### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "uptime": 123.456,
  "timestamp": "2025-11-24T..."
}
```

### Next.js API Routes (Fallback)

The project also includes a Next.js API route at `/src/app/api/hello/route.ts` as an example. However, when using the custom Express server, Express routes take precedence.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The server will start on **http://localhost:3000**

### 3. Run Production Build

```bash
npm run build
npm start
```

## Development

### Adding New Express Routes

Edit `server.js` and add your routes before the `server.all('*', ...)` handler:

```javascript
// Add your custom Express routes here
server.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// This must be last - lets Next.js handle remaining routes
server.all('*', (req, res) => {
  return handle(req, res);
});
```

### Adding New Next.js Pages

Simply create new files in `src/app/` following Next.js App Router conventions:

```
src/app/
├── about/
│   └── page.tsx
└── dashboard/
    └── page.tsx
```

## Testing

Open **http://localhost:3000** in your browser to see the test UI with buttons to test each API endpoint.

## Technologies

- **Next.js 16.0.3** - React framework
- **React 19.2.0** - UI library
- **Express 5.1.0** - Backend server
- **TypeScript 5.x** - Type safety
- **Tailwind CSS v4** - Styling

## Benefits of This Setup

✅ Single port for both frontend and backend
✅ Simplified deployment
✅ Full control over Express middleware
✅ Can use any Express ecosystem packages
✅ Next.js features still work (SSR, API routes, etc.)
✅ Unified CORS configuration

## Notes

- Express routes are defined in `server.js`
- Next.js handles all non-API routes
- Both use the same port (no CORS issues)
- Environment variables in `.env.local`

