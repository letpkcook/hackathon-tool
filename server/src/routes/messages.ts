import { Router } from 'express';
import * as db from '../db/queries';

const router = Router();

// Get message history for a room
router.get('/rooms/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 100;

    const messages = await db.getMessages(id, limit);

    res.json({
      messages: messages.map(m => ({
        id: m.id,
        sender_name: m.sender_name,
        content: m.content,
        created_at: m.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
