const express = require('express');
const next = require('next');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware
  server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Express API Routes
  // Simple hello endpoint
  server.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express backend!' });
  });

  // Example POST endpoint
  server.post('/api/hello', (req, res) => {
    const { name } = req.body;
    res.json({ 
      message: `Hello ${name || 'Guest'} from Express backend!`,
      timestamp: new Date().toISOString()
    });
  });

  // Health check endpoint
  server.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // Let Next.js handle all other routes
  server.use((req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Express backend running on same port`);
    console.log(`> Environment: ${dev ? 'development' : 'production'}`);
  });
});

