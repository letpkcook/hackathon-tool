# Contributing to Hackathon Tool

Thank you for your interest in contributing to this hackathon collaboration tool!

## Quick Start for Development

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/hackathon-tool.git
   cd hackathon-tool
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up PostgreSQL database**
   ```bash
   createdb hackathon_tool
   ```

4. **Configure environment variables**
   - Copy `server/.env.example` to `server/.env`
   - Copy `client/.env.example` to `client/.env.local`
   - Update with your database credentials

5. **Run migrations**
   ```bash
   cd server
   npm run migrate
   ```

6. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

## Project Architecture

### Backend (server/)
- **Express.js** server with TypeScript
- **Socket.IO** for real-time communication
- **PostgreSQL** for data persistence
- **bcrypt** for password hashing

### Frontend (client/)
- **Next.js 14** with App Router
- **React** with TypeScript
- **Socket.IO Client** for real-time features
- **PeerJS** for WebRTC video calls

## Development Workflow

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Test your changes locally
4. Commit with descriptive messages
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug"
   ```

5. Push and create a pull request

## Code Style

- Use **TypeScript** for all new code
- Follow existing patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic

## Testing

Currently, this is an MVP without formal tests. When adding tests:
- Place backend tests in `server/src/__tests__/`
- Place frontend tests in `client/src/__tests__/`
- Use Jest or your preferred testing framework

## Common Tasks

### Adding a new API endpoint

1. Create route handler in `server/src/routes/`
2. Import and register in `server/src/index.ts`
3. Add corresponding function in `client/src/lib/api.ts`

### Adding a new React component

1. Create component in `client/src/components/`
2. Use TypeScript for props interface
3. Follow existing styling patterns (inline styles or add CSS module)

### Adding a new Socket.IO event

1. Add handler in `server/src/socket/handlers.ts`
2. Emit/listen in relevant React component using `getSocket()`

### Database changes

1. Create new migration file in `server/migrations/`
2. Follow naming: `00X_description.sql`
3. Update `run.js` if needed
4. Add queries in `server/src/db/queries.ts`

## Debugging

### Backend
- Check server console output
- Use `console.log()` in route handlers
- Check PostgreSQL logs if database issues

### Frontend
- Open browser DevTools
- Check Console for errors
- Check Network tab for API calls
- Check Application tab for localStorage

### Socket.IO
- Use browser DevTools Console
- Log socket events on both client and server
- Check Network tab → WS for WebSocket connections

## Performance Considerations

- Keep database queries efficient (use indexes)
- Limit message history loads (already set to 100)
- Consider pagination for large datasets
- Optimize video quality settings for bandwidth

## Security

- Never commit `.env` files
- Always hash passwords (bcrypt is configured)
- Validate all user inputs
- Use parameterized SQL queries (already implemented)
- Implement rate limiting if deploying to production

## Need Help?

- Check the README.md for setup instructions
- Open an issue for bugs or feature requests
- Review existing code for patterns and examples

## License

MIT - Feel free to use this for your hackathon projects!
