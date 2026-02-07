-- Migration: Initial schema for hackathon collaboration tool
-- Created: 2026-02-07

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Room members table
CREATE TABLE room_members (
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  display_name VARCHAR(50) NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (room_id, display_name)
);

-- Messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  sender_name VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  author_name VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  link VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_posts_room_id ON posts(room_id);
CREATE INDEX idx_room_members_room_id ON room_members(room_id);
