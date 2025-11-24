import 'dotenv/config';
import express, { Request, Response } from 'express';
import next from 'next';
import cors from 'cors';
import session from 'express-session';
import { ApolloServer } from '@apollo/server';
import connectDB from './src/backend/config/database';
import { seedDatabase } from './src/backend/utils/seed';
import typeDefs from './src/backend/schema/typeDefs';
import resolvers from './src/backend/resolvers';
import { ISession, SessionUser } from './src/backend/types';

// Extend Express Request type to include session
declare module 'express-session' {
  interface SessionData {
    user?: SessionUser;
  }
}

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function startServer(): Promise<void> {
  // Connect to MongoDB
  await connectDB();
  
  // Seed database with initial data
  await seedDatabase();
  
  // Prepare Next.js
  await app.prepare();

  const server = express();

  // Middleware
  server.use(cors({
    origin: `http://${hostname}:${port}`,
    credentials: true
  }));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  server.use((req: Request, _res: Response, next: any) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Session middleware
  server.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production' && process.env.HTTPS === 'true', // Only secure with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    }
  }));

  // Initialize Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      // Only log errors that aren't expected authentication checks
      const code = error.extensions?.code;
      if (code !== 'UNAUTHENTICATED' && code !== 'FORBIDDEN') {
        console.error('GraphQL Error:', error);
      }
      return error;
    },
  });

  await apolloServer.start();
  console.log('✅ Apollo Server started');

  // GraphQL endpoint handler
  server.post('/graphql', async (req: Request, res: Response) => {
    console.log('📨 GraphQL POST request received');
    try {
      // Get user from session instead of token
      const user = req.session.user || null;

      const result = await apolloServer.executeOperation(
        {
          query: req.body.query,
          variables: req.body.variables,
          operationName: req.body.operationName,
        },
        {
          contextValue: { 
            user,
            session: req.session as ISession,
            req,
            res
          },
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
  server.get('/graphql', (_req: Request, res: Response) => {
    console.log('📖 GraphQL GET request received (playground)');
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
              <p><strong>Authentication:</strong> Session-based (OTP login)</p>
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

            <h2>OTP Login Flow</h2>
            <pre>
# Step 1: Request OTP
mutation {
  requestOTP(email: "admin@company.com") {
    success
    message
  }
}

# Step 2: Verify OTP (check console for OTP in development)
mutation {
  verifyOTP(email: "admin@company.com", otp: "123456") {
    user {
      id
      username
      email
      role
    }
    message
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
  server.get('/api/hello', (_req: Request, res: Response) => {
    res.json({ message: 'Hello from Express backend!' });
  });

  server.post('/api/hello', (req: Request, res: Response) => {
    const { name } = req.body;
    res.json({
      message: `Hello ${name || 'Guest'} from Express backend!`,
      timestamp: new Date().toISOString()
    });
  });

  server.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // Let Next.js handle all other routes (must be last)
  server.use((req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(port, (err?: Error) => {
    if (err) throw err;
    console.log('\n🚀 Server started successfully!');
    console.log(`> App URL: http://${hostname}:${port}`);
    console.log(`> GraphQL: http://${hostname}:${port}/graphql`);
    console.log(`> Health Check: http://${hostname}:${port}/api/health`);
    console.log(`> Environment: ${dev ? 'development' : 'production'}`);
    console.log(`> MongoDB: Connected`);
    console.log(`> Session: Cookies ${process.env.NODE_ENV === 'production' && process.env.HTTPS === 'true' ? 'SECURE' : 'NOT SECURE'}\n`);
  });
}

startServer().catch((error: Error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});

