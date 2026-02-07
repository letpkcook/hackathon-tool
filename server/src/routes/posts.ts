import { Router } from 'express';
import * as db from '../db/queries';

const router = Router();

// Create a new post
router.post('/rooms/:id/posts', async (req, res) => {
  try {
    const { id } = req.params;
    const { authorName, title, body, link } = req.body;

    if (!authorName || !title) {
      return res.status(400).json({ error: 'Author name and title are required' });
    }

    if (title.length > 200) {
      return res.status(400).json({ error: 'Title must be 200 characters or less' });
    }

    if (link && link.length > 500) {
      return res.status(400).json({ error: 'Link must be 500 characters or less' });
    }

    const room = await db.getRoomById(id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const post = await db.createPost(id, authorName, title, body || null, link || null);

    res.status(201).json({
      id: post.id,
      author_name: post.author_name,
      title: post.title,
      body: post.body,
      link: post.link,
      created_at: post.created_at,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all posts for a room
router.get('/rooms/:id/posts', async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await db.getPosts(id);

    res.json({
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
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

export default router;
