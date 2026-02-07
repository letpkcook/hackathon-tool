import { Router } from 'express';
import * as db from '../db/queries';

const router = Router();

// Create a new room
router.post('/rooms', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password are required' });
    }

    if (name.length > 100) {
      return res.status(400).json({ error: 'Name must be 100 characters or less' });
    }

    const room = await db.createRoom(name, password);
    res.status(201).json({
      id: room.id,
      name: room.name,
      created_at: room.created_at,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Get room details (requires authentication)
router.get('/rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const room = await db.getRoomById(id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const members = await db.getRoomMembers(id);

    res.json({
      id: room.id,
      name: room.name,
      created_at: room.created_at,
      members: members.map(m => ({
        display_name: m.display_name,
        joined_at: m.joined_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Join a room with password
router.post('/rooms/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { password, displayName } = req.body;

    if (!password || !displayName) {
      return res.status(400).json({ error: 'Password and display name are required' });
    }

    if (displayName.length > 50) {
      return res.status(400).json({ error: 'Display name must be 50 characters or less' });
    }

    const room = await db.getRoomById(id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const isValid = await db.verifyRoomPassword(id, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Check if already a member
    const isMember = await db.isMemberOfRoom(id, displayName);
    if (!isMember) {
      await db.addRoomMember(id, displayName);
    }

    res.json({
      success: true,
      roomId: id,
      displayName,
      token: Buffer.from(`${id}:${displayName}`).toString('base64'), // Simple token
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// Get public room info (no auth required)
router.get('/rooms/:id/public', async (req, res) => {
  try {
    const { id } = req.params;
    const room = await db.getRoomById(id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const members = await db.getRoomMembers(id);
    const posts = await db.getPosts(id);

    res.json({
      name: room.name,
      created_at: room.created_at,
      members: members.map(m => m.display_name),
      posts: posts.map(p => ({
        id: p.id,
        author_name: p.author_name,
        title: p.title,
        body: p.body,
        link: p.link,
        created_at: p.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching public room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

export default router;
