import pool from './index';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export interface Room {
  id: string;
  name: string;
  password_hash: string;
  created_at: Date;
}

export interface RoomMember {
  room_id: string;
  display_name: string;
  joined_at: Date;
}

export interface Message {
  id: number;
  room_id: string;
  sender_name: string;
  content: string;
  created_at: Date;
}

export interface Post {
  id: number;
  room_id: string;
  author_name: string;
  title: string;
  body: string | null;
  link: string | null;
  created_at: Date;
}

// Room queries
export async function createRoom(name: string, password: string): Promise<Room> {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await pool.query(
    'INSERT INTO rooms (name, password_hash) VALUES ($1, $2) RETURNING *',
    [name, passwordHash]
  );
  return result.rows[0];
}

export async function getRoomById(roomId: string): Promise<Room | null> {
  const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [roomId]);
  return result.rows[0] || null;
}

export async function verifyRoomPassword(roomId: string, password: string): Promise<boolean> {
  const room = await getRoomById(roomId);
  if (!room) return false;
  return bcrypt.compare(password, room.password_hash);
}

// Room member queries
export async function addRoomMember(roomId: string, displayName: string): Promise<RoomMember> {
  const result = await pool.query(
    'INSERT INTO room_members (room_id, display_name) VALUES ($1, $2) RETURNING *',
    [roomId, displayName]
  );
  return result.rows[0];
}

export async function getRoomMembers(roomId: string): Promise<RoomMember[]> {
  const result = await pool.query(
    'SELECT * FROM room_members WHERE room_id = $1 ORDER BY joined_at ASC',
    [roomId]
  );
  return result.rows;
}

export async function isMemberOfRoom(roomId: string, displayName: string): Promise<boolean> {
  const result = await pool.query(
    'SELECT 1 FROM room_members WHERE room_id = $1 AND display_name = $2',
    [roomId, displayName]
  );
  return result.rows.length > 0;
}

// Message queries
export async function createMessage(
  roomId: string,
  senderName: string,
  content: string
): Promise<Message> {
  const result = await pool.query(
    'INSERT INTO messages (room_id, sender_name, content) VALUES ($1, $2, $3) RETURNING *',
    [roomId, senderName, content]
  );
  return result.rows[0];
}

export async function getMessages(roomId: string, limit = 100): Promise<Message[]> {
  const result = await pool.query(
    'SELECT * FROM messages WHERE room_id = $1 ORDER BY created_at ASC LIMIT $2',
    [roomId, limit]
  );
  return result.rows;
}

// Post queries
export async function createPost(
  roomId: string,
  authorName: string,
  title: string,
  body: string | null = null,
  link: string | null = null
): Promise<Post> {
  const result = await pool.query(
    'INSERT INTO posts (room_id, author_name, title, body, link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [roomId, authorName, title, body, link]
  );
  return result.rows[0];
}

export async function getPosts(roomId: string): Promise<Post[]> {
  const result = await pool.query(
    'SELECT * FROM posts WHERE room_id = $1 ORDER BY created_at DESC',
    [roomId]
  );
  return result.rows;
}
