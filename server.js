const express = require('express');
const next = require('next');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ApolloServer } = require('@apollo/server');
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

  // GraphQL endpoint handler
  server.post('/graphql', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || '';
      const user = getUserFromToken(token);

      const result = await apolloServer.executeOperation(
        {
          query: req.body.query,
          variables: req.body.variables,
          operationName: req.body.operationName,
        },
        {
          contextValue: { user },
        }
      );

      if (result.body.kind === 'single') {
        res.status(200).json(result.body.singleResult);
      } else {
        res.status(200).json({ errors: [{ message: 'Unexpected response type' }] });
      }
    } catch (error) {
      console.error('GraphQL execution error:', error);
      res.status(500).json({ errors: [{ message: 'Internal server error' }] });
    }
  });

  // GraphQL GET endpoint for playground
  server.get('/graphql', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GraphQL Playground</title>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; }
            .container { max-width: 800px; margin: 50px auto; padding: 20px; }
            h1 { color: #333; }
            .info { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
            code { background: #e0e0e0; padding: 2px 6px; border-radius: 3px; }
            pre { background: #2d2d2d; color: #f8f8f8; padding: 15px; border-radius: 5px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 GraphQL API</h1>
            <div class="info">
              <p><strong>Endpoint:</strong> <code>POST /graphql</code></p>
              <p><strong>Authentication:</strong> Add header <code>Authorization: Bearer &lt;token&gt;</code></p>
            </div>
            
            <h2>Sample Query</h2>
            <pre>
query {
  employees(page: 1, pageSize: 10) {
    employees {
      id
      name
      email
      department
      position
      attendance
    }
    totalCount
    pageInfo {
      currentPage
      totalPages
      hasNextPage
    }
  }
}</pre>

            <h2>Login Mutation</h2>
            <pre>
mutation {
  login(email: "admin@company.com", password: "admin123") {
    token
    user {
      id
      username
      email
      role
    }
  }
}</pre>

            <p>Use a GraphQL client like <a href="https://www.postman.com/" target="_blank">Postman</a>, 
            <a href="https://insomnia.rest/" target="_blank">Insomnia</a>, or the web app to interact with the API.</p>
          </div>
        </body>
      </html>
    `);
  });

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

  // Let Next.js handle all other routes (must be last)
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
