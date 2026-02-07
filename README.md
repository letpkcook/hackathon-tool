# 🚀 Hackathon Collaboration Tool

A single-web workspace where hackathon participants can collaborate live (video + chat), document progress (posts/updates), and demo their work without jumping between tools.

**Think of it as:** Discord + Zoom + Devlog, stripped to essentials.

**Core user flow:** "Create a room → talk → chat → post updates → share link with judges"

---

## 📋 Features

### ✅ Implemented

1. **Project Rooms** - Create password-protected rooms for your hackathon team
2. **Real-time Chat** - Persistent messaging via Socket.IO (reload-safe)
3. **Video Calling** - WebRTC video/audio with PeerJS (basic implementation)
4. **Posts/Updates** - Document your progress with devlog-style posts
5. **Public View** - Share a read-only link with judges and sponsors
6. **Minimal Auth** - Room password-based authentication (no user accounts needed)

### 🚫 Out of Scope

- No notifications
- No user profiles  
- No file uploads
- No reactions, likes, comments
- No mobile-specific layouts
- No AI features
- No recording

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (React, TypeScript, App Router)
- **Backend:** Node.js + Express + Socket.IO (TypeScript)
- **Database:** PostgreSQL
- **Real-time:** Socket.IO for chat + WebRTC signaling
- **Video:** PeerJS for WebRTC connections

---

## 📁 Project Structure

```
/
├── client/                  # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components (VideoCall, Chat, Posts)
│   │   └── lib/             # Utilities (API client, Socket.IO, auth)
│   ├── package.json
│   └── next.config.js
├── server/                  # Express backend
│   ├── src/
│   │   ├── routes/          # REST API routes (rooms, posts, messages)
│   │   ├── socket/          # Socket.IO handlers (chat, WebRTC signaling)
│   │   ├── db/              # Database connection + queries
│   │   └── index.ts         # Express app entry point
│   ├── migrations/          # SQL migration files
│   ├── package.json
│   └── .env.example
├── README.md
└── package.json             # Root package.json with workspace scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **PostgreSQL** >= 12.x
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/letpkcook/hackathon-tool.git
cd hackathon-tool
```

### 2. Install Dependencies

```bash
npm run install:all
```

Or install individually:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 3. Setup PostgreSQL Database

Create a new PostgreSQL database:

```bash
createdb hackathon_tool
```

Or using `psql`:

```sql
CREATE DATABASE hackathon_tool;
```

### 4. Configure Environment Variables

**Server:**

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/hackathon_tool
CLIENT_URL=http://localhost:3000
```

**Client:**

```bash
cd client
cp .env.example .env.local
```

Edit `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 5. Run Database Migrations

```bash
cd server
npm run migrate
```

This will create the required tables: `rooms`, `room_members`, `messages`, and `posts`.

### 6. Start the Development Servers

From the root directory:

```bash
npm run dev
```

This runs both the frontend and backend concurrently.

**Or run them separately:**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 7. Open the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

---

## 📚 API Documentation

### REST API Endpoints

#### Rooms

**Create a room:**
```
POST /api/rooms
Body: { "name": "My Project", "password": "secret123" }
Response: { "id": "uuid", "name": "My Project", "created_at": "..." }
```

**Get room details:**
```
GET /api/rooms/:id
Response: { "id": "uuid", "name": "...", "created_at": "...", "members": [...] }
```

**Join a room:**
```
POST /api/rooms/:id/join
Body: { "password": "secret123", "displayName": "John" }
Response: { "success": true, "roomId": "uuid", "displayName": "John", "token": "..." }
```

**Get public room info:**
```
GET /api/rooms/:id/public
Response: { "name": "...", "members": [...], "posts": [...] }
```

#### Messages

**Get message history:**
```
GET /api/rooms/:id/messages?limit=100
Response: { "messages": [...] }
```

#### Posts

**Create a post:**
```
POST /api/rooms/:id/posts
Body: { "authorName": "John", "title": "...", "body": "...", "link": "..." }
Response: { "id": 1, "author_name": "...", "title": "...", ... }
```

**Get posts:**
```
GET /api/rooms/:id/posts
Response: { "posts": [...] }
```

### WebSocket Events (Socket.IO)

**Client → Server:**
- `join-room` - Join a room: `{ roomId, displayName }`
- `send-message` - Send a chat message: `{ roomId, senderName, content }`
- `webrtc-offer` - WebRTC offer for video
- `webrtc-answer` - WebRTC answer for video
- `webrtc-ice-candidate` - ICE candidate exchange

**Server → Client:**
- `joined-room` - Confirmation of joining
- `user-joined` - Another user joined the room
- `user-left` - User left the room
- `new-message` - New chat message
- `webrtc-offer` - Received WebRTC offer
- `webrtc-answer` - Received WebRTC answer
- `webrtc-ice-candidate` - Received ICE candidate

---

## 🗃 Database Schema

```sql
-- Rooms
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Room Members
CREATE TABLE room_members (
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  display_name VARCHAR(50) NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (room_id, display_name)
);

-- Messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  sender_name VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  author_name VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  link VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🧪 Development

### Running Tests

*(No tests included in MVP, add your own as needed)*

### Building for Production

```bash
# Build both client and server
npm run build

# Start production server
npm start
```

### Code Style

The project uses TypeScript with strict mode enabled. Follow the existing code patterns.

---

## 🎯 MVP Scope

This is a **starter scaffold** designed to get your hackathon team up and running quickly. The implementation is intentionally minimal to allow for rapid iteration and customization.

### Known Limitations

1. **Video calling** uses PeerJS with manual peer connection (no automatic discovery via signaling)
2. **Authentication** is basic (room passwords only, stored in localStorage)
3. **No persistence** for video calls or active user states
4. **Max 3-5 participants** recommended for video
5. **No error recovery** for WebSocket disconnections (refresh to reconnect)

### Suggested Improvements

- Implement proper WebRTC signaling through Socket.IO for automatic peer discovery
- Add JWT-based authentication
- Add user presence indicators
- Add typing indicators for chat
- Add markdown support for posts
- Add image uploads
- Add dark mode
- Add mobile-responsive layouts

---

## 📝 License

MIT

---

## 🤝 Contributing

This is a hackathon starter template. Fork it, customize it, make it your own!

---

## 🆘 Troubleshooting

**Database connection fails:**
- Check your `DATABASE_URL` in `server/.env`
- Ensure PostgreSQL is running: `pg_ctl status`
- Verify database exists: `psql -l`

**Port already in use:**
- Change `PORT` in `server/.env` (backend)
- Change port in `client/.env.local` URLs

**Video not working:**
- Grant camera/microphone permissions in your browser
- Check browser console for WebRTC errors
- Try in Chrome/Firefox (best WebRTC support)

**Socket.IO connection fails:**
- Verify backend is running on port 3001
- Check CORS configuration in `server/src/index.ts`
- Check browser console for connection errors

---

Built with ❤️ for hackathons