# Quick Reference Guide

## 🎯 What This Project Includes

### Backend Features
✅ RESTful API endpoints for rooms, messages, and posts  
✅ Socket.IO for real-time chat  
✅ WebRTC signaling for video calls  
✅ PostgreSQL database with migrations  
✅ Password hashing with bcrypt  
✅ CORS configured for local development  

### Frontend Features
✅ Next.js 14 with App Router and TypeScript  
✅ Three main pages: Home, Room, Public View  
✅ Three React components: VideoCall, Chat, Posts  
✅ Socket.IO client integration  
✅ PeerJS for WebRTC video  
✅ localStorage-based authentication  

## 📋 Common Commands

```bash
# Install all dependencies
npm run install:all

# Development mode (runs both client and server)
npm run dev

# Development mode (separate terminals)
npm run dev:client    # Frontend on :3000
npm run dev:server    # Backend on :3001

# Build for production
npm run build

# Run production server
npm start

# Database migrations
cd server && npm run migrate
```

## 🔗 Default URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📂 File Locations

### Need to add a new API route?
→ `server/src/routes/`

### Need to add a new React component?
→ `client/src/components/`

### Need to add a new page?
→ `client/src/app/`

### Need to modify database queries?
→ `server/src/db/queries.ts`

### Need to add Socket.IO events?
→ `server/src/socket/handlers.ts`

## 🔧 Configuration Files

### Environment Variables
- `server/.env` - Backend config (DB, PORT, CLIENT_URL)
- `client/.env.local` - Frontend config (API_URL, SOCKET_URL)

### TypeScript Config
- `server/tsconfig.json` - Backend TypeScript settings
- `client/tsconfig.json` - Frontend TypeScript settings

### Package Files
- `package.json` - Root workspace config
- `server/package.json` - Backend dependencies
- `client/package.json` - Frontend dependencies

## 🗄️ Database Schema

**Tables:**
- `rooms` - Project rooms with passwords
- `room_members` - Users in each room
- `messages` - Chat messages
- `posts` - Project updates/posts

**See:** `server/migrations/001_initial_schema.sql`

## 🔌 API Endpoints

### Rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/:id/join` - Join room
- `GET /api/rooms/:id/public` - Public view

### Messages
- `GET /api/rooms/:id/messages` - Get messages

### Posts
- `POST /api/rooms/:id/posts` - Create post
- `GET /api/rooms/:id/posts` - Get posts

## 🎨 Component Props

### VideoCall
```tsx
<VideoCall roomId={string} displayName={string} />
```

### Chat
```tsx
<Chat roomId={string} displayName={string} />
```

### Posts
```tsx
<Posts roomId={string} displayName={string} />
```

## 🐛 Debugging Tips

1. **Database connection fails**
   - Check `DATABASE_URL` in `server/.env`
   - Verify PostgreSQL is running: `pg_ctl status`

2. **Port already in use**
   - Change `PORT` in `server/.env`
   - Update URLs in `client/.env.local`

3. **Build errors**
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Clear Next.js cache: `rm -rf client/.next`

4. **Socket.IO not connecting**
   - Check backend is running on :3001
   - Verify CORS settings in `server/src/index.ts`

## 📊 Tech Stack Versions

- Node.js: >= 18.0.0
- Next.js: 14.x
- React: 18.x
- Express: 4.x
- Socket.IO: 4.x
- PostgreSQL: 12.x+
- TypeScript: 5.x

## 🚀 Deployment Checklist

- [ ] Set up production PostgreSQL database
- [ ] Update environment variables for production
- [ ] Run migrations on production database
- [ ] Build client: `cd client && npm run build`
- [ ] Build server: `cd server && npm run build`
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up SSL certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Socket.IO Documentation](https://socket.io/docs/)
- [PeerJS Documentation](https://peerjs.com/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

For detailed setup instructions, see **README.md**  
For contribution guidelines, see **CONTRIBUTING.md**
