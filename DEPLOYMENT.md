# Deployment Guide

## Quick Start (Local Development)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Application**
   - Navigate to http://localhost:3000
   - Login with test credentials:
     - Admin: admin@company.com / admin123
     - Employee: employee@company.com / employee123

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add:
     ```
     JWT_SECRET=your-secret-key-here
     NODE_ENV=production
     ```

### Option 2: Heroku

1. **Create Heroku App**
   ```bash
   heroku create ultraship-poc
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key-here
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 3: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build Image**
   ```bash
   docker build -t ultraship-poc .
   ```

3. **Run Container**
   ```bash
   docker run -p 3000:3000 -e JWT_SECRET=your-secret ultraship-poc
   ```

### Option 4: VPS (Ubuntu/Debian)

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone & Setup**
   ```bash
   git clone <repo-url>
   cd ultraship-poc
   npm install
   npm run build
   ```

3. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start npm --name "ultraship" -- start
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Environment Variables

Create `.env.local` for local development or set in your deployment platform:

```env
# Server
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Optional
DATABASE_URL=your-database-url-if-using-real-db
```

## Build Commands

```bash
# Development
npm run dev

# Production Build
npm run build

# Start Production
npm start

# Lint
npm run lint
```

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] JWT_SECRET is strong and unique
- [ ] Health check endpoint working (/api/health)
- [ ] GraphQL endpoint accessible (/graphql)
- [ ] Login functionality working
- [ ] Both admin and employee roles tested
- [ ] All CRUD operations verified
- [ ] Mobile responsiveness checked
- [ ] SSL certificate installed (production)
- [ ] Monitoring/logging configured

## Troubleshooting

### Server Won't Start
- Check if port 3000 is available
- Verify all dependencies installed
- Check Node.js version (20.x required)

### GraphQL Errors
- Verify JWT_SECRET is set
- Check authorization header format
- Confirm user has proper role

### Build Fails
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

## Performance Tips

1. **Enable Caching**
   - Use Redis for session management
   - Implement query result caching

2. **Database**
   - Replace in-memory data with PostgreSQL/MongoDB
   - Add database indexing

3. **CDN**
   - Serve static assets via CDN
   - Use Vercel Edge Network

4. **Monitoring**
   - Setup error tracking (Sentry)
   - Add performance monitoring (New Relic)

## Security Recommendations

1. Change JWT_SECRET to a strong random string
2. Enable CORS with specific origins
3. Implement rate limiting
4. Add HTTPS in production
5. Set secure cookie flags
6. Implement CSRF protection
7. Add input validation and sanitization
8. Regular dependency updates

## Support

For deployment issues, refer to:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)

