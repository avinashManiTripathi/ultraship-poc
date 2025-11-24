const express = require('express');
const next = require('next');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const typeDefs = require('./src/backend/schema/typeDefs');
const resolvers = require('./src/backend/resolvers');
const { getUserFromToken } = require('./src/backend/utils/auth');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function startServer() {
  await app.prepare();

  const server = express();

  // Middleware
  server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Initialize Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return error;
    },
  });

  await apolloServer.start();

  // Apply Apollo middleware to /graphql endpoint
  server.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        // Get token from headers
        const token = req.headers.authorization?.replace('Bearer ', '') || '';
        
        // Get user from token
        const user = getUserFromToken(token);
        
        return { user };
      },
    })
  );

  // Express REST API Routes (for legacy support if needed)
  server.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express backend!' });
  });

  server.post('/api/hello', (req, res) => {
    const { name } = req.body;
    res.json({
      message: `Hello ${name || 'Guest'} from Express backend!`,
      timestamp: new Date().toISOString()
    });
  });

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
    console.log(`> GraphQL endpoint: http://${hostname}:${port}/graphql`);
    console.log(`> Environment: ${dev ? 'development' : 'production'}`);
  });
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
