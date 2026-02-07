'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRoom } from '@/lib/api';
import { getRoomInfo, clearAuthToken } from '@/lib/auth';
import VideoCall from '@/components/VideoCall';
import Chat from '@/components/Chat';
import Posts from '@/components/Posts';

type Tab = 'call' | 'chat' | 'posts';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [roomData, setRoomData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState<{ roomId: string; displayName: string } | null>(null);

  useEffect(() => {
    // Verify authentication
    const info = getRoomInfo();
    if (!info || info.roomId !== roomId) {
      router.push('/');
      return;
    }

    setUserInfo(info);

    // Load room data
    const loadRoom = async () => {
      try {
        const data = await getRoom(roomId);
        setRoomData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load room');
      } finally {
        setIsLoading(false);
      }
    };

    loadRoom();
  }, [roomId, router]);

  const handleLeaveRoom = () => {
    clearAuthToken();
    router.push('/');
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/rooms/${roomId}/public`;
    navigator.clipboard.writeText(publicUrl);
    alert('Public link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        Loading room...
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

  if (!userInfo) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #ddd',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{ fontSize: '24px', color: '#1976d2', marginBottom: '5px' }}>
              {roomData?.name}
            </h1>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Logged in as: <strong>{userInfo.displayName}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={copyPublicLink}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              📋 Copy Public Link
            </button>
            <button
              onClick={handleLeaveRoom}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Leave Room
            </button>
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #ddd',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
        }}>
          {(['call', 'chat', 'posts'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '15px 30px',
                backgroundColor: activeTab === tab ? '#1976d2' : 'transparent',
                color: activeTab === tab ? 'white' : '#666',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #1976d2' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'call' ? '📹 Video Call' : tab === 'chat' ? '💬 Chat' : '📝 Posts'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        minHeight: 'calc(100vh - 200px)',
      }}>
        {activeTab === 'call' && (
          <VideoCall roomId={roomId} displayName={userInfo.displayName} />
        )}
        {activeTab === 'chat' && (
          <Chat roomId={roomId} displayName={userInfo.displayName} />
        )}
        {activeTab === 'posts' && (
          <Posts roomId={roomId} displayName={userInfo.displayName} />
        )}
      </div>
    </div>
  );
}
