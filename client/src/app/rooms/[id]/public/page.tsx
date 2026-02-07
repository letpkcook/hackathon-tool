'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPublicRoom } from '@/lib/api';

export default function PublicRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  
  const [roomData, setRoomData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const data = await getPublicRoom(roomId);
        setRoomData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load room');
      } finally {
        setIsLoading(false);
      }
    };

    loadRoom();
  }, [roomId]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <p style={{ color: '#f44336' }}>{error}</p>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '2px solid #1976d2',
        }}>
          <h1 style={{
            fontSize: '36px',
            color: '#1976d2',
            marginBottom: '10px',
          }}>
            {roomData?.name}
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Public View - Read Only
          </p>
        </div>

        {/* Team Members */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '24px',
            marginBottom: '15px',
            color: '#333',
          }}>
            👥 Team Members
          </h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            {roomData?.members.length > 0 ? (
              roomData.members.map((member: string, index: number) => (
                <span
                  key={index}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {member}
                </span>
              ))
            ) : (
              <p style={{ color: '#666' }}>No members yet</p>
            )}
          </div>
        </section>

        {/* Posts/Updates */}
        <section>
          <h2 style={{
            fontSize: '24px',
            marginBottom: '20px',
            color: '#333',
          }}>
            📝 Updates & Progress
          </h2>
          {roomData?.posts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {roomData.posts.map((post: any) => (
                <div
                  key={post.id}
                  style={{
                    padding: '25px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}>
                    <h3 style={{
                      fontSize: '20px',
                      color: '#1976d2',
                      margin: 0,
                    }}>
                      {post.title}
                    </h3>
                    <span style={{
                      fontSize: '12px',
                      color: '#999',
                    }}>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '10px',
                  }}>
                    By <strong>{post.author_name}</strong>
                  </p>

                  {post.body && (
                    <p style={{
                      marginBottom: '10px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                    }}>
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
                        fontSize: '14px',
                      }}
                    >
                      🔗 {post.link}
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{
              color: '#666',
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
            }}>
              No updates posted yet. Check back later!
            </p>
          )}
        </section>

        {/* Footer */}
        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid #ddd',
          textAlign: 'center',
        }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Want to join this project?{' '}
            <a
              href={`/`}
              style={{
                color: '#1976d2',
                textDecoration: 'underline',
              }}
            >
              Go to home page
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
