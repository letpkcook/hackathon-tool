'use client';

import { useEffect, useState } from 'react';
import { getPosts, createPost } from '@/lib/api';

interface Post {
  id: number;
  author_name: string;
  title: string;
  body: string | null;
  link: string | null;
  created_at: string;
}

interface PostsProps {
  roomId: string;
  displayName: string;
}

export default function Posts({ roomId, displayName }: PostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [newPost, setNewPost] = useState({
    title: '',
    body: '',
    link: '',
  });

  useEffect(() => {
    loadPosts();
  }, [roomId]);

  const loadPosts = async () => {
    try {
      const data = await getPosts(roomId);
      setPosts(data.posts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPost.title.trim()) {
      alert('Title is required');
      return;
    }

    setIsCreating(true);
    try {
      const post = await createPost(
        roomId,
        displayName,
        newPost.title.trim(),
        newPost.body.trim() || undefined,
        newPost.link.trim() || undefined
      );
      
      setPosts([post, ...posts]);
      setNewPost({ title: '', body: '', link: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading posts...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <h2>Updates & Posts</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreatePost}
          style={{
            marginBottom: '30px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Title *
            </label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="Post title..."
              required
              maxLength={200}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Body
            </label>
            <textarea
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
              placeholder="Post content..."
              rows={5}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Link (optional)
            </label>
            <input
              type="url"
              value={newPost.link}
              onChange={(e) => setNewPost({ ...newPost, link: e.target.value })}
              placeholder="https://..."
              maxLength={500}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isCreating || !newPost.title.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isCreating || !newPost.title.trim() ? 'not-allowed' : 'pointer',
              opacity: isCreating || !newPost.title.trim() ? 0.6 : 1,
            }}
          >
            {isCreating ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      )}

      <div>
        {posts.length === 0 ? (
          <p style={{ color: '#666' }}>No posts yet. Create the first one!</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{
                marginBottom: '20px',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}>
                <h3 style={{ margin: 0, color: '#1976d2' }}>{post.title}</h3>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                By {post.author_name}
              </p>

              {post.body && (
                <p style={{ marginBottom: '10px', whiteSpace: 'pre-wrap' }}>
                  {post.body}
                </p>
              )}

              {post.link && (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#1976d2',
                    textDecoration: 'underline',
                  }}
                >
                  {post.link}
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
