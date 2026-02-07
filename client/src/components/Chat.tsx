'use client';

import { useEffect, useState, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import { getMessages } from '@/lib/api';

interface Message {
  id: number;
  sender_name: string;
  content: string;
  created_at: string;
}

interface ChatProps {
  roomId: string;
  displayName: string;
}

export default function Chat({ roomId, displayName }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load message history
    const loadMessages = async () => {
      try {
        const data = await getMessages(roomId);
        setMessages(data.messages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Setup Socket.IO listeners
    const socket = getSocket();

    socket.emit('join-room', { roomId, displayName });

    socket.on('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('new-message');
    };
  }, [roomId, displayName]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const socket = getSocket();
    socket.emit('send-message', {
      roomId,
      senderName: displayName,
      content: newMessage.trim(),
    });

    setNewMessage('');
  };

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading messages...</div>;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      padding: '20px',
    }}>
      <h2 style={{ marginBottom: '20px' }}>Chat</h2>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#f9f9f9',
      }}>
        {messages.length === 0 ? (
          <p style={{ color: '#666' }}>No messages yet. Start the conversation!</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: message.sender_name === displayName ? '#e3f2fd' : 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '5px',
              }}>
                <strong style={{ color: '#1976d2' }}>{message.sender_name}</strong>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{
        display: 'flex',
        gap: '10px',
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            opacity: newMessage.trim() ? 1 : 0.6,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
