Deploy to Render:

1. Push repo to GitHub.
2. Create Render Web Service -> Connect GitHub.
3. Build command: npm ci && npm run build
4. Start command: npm run start
5. Set environment variables: DATABASE_URL, SESSION_SECRET, STRIPE_SECRET_KEY (if used), PORT=5000
6. Create a managed Postgres and paste DATABASE_URL.
