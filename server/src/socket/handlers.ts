import { Server as SocketServer, Socket } from 'socket.io';
import * as db from '../db/queries';

export function setupSocketHandlers(io: SocketServer) {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Join a room
    socket.on('join-room', async (data: { roomId: string; displayName: string }) => {
      const { roomId, displayName } = data;
      
      try {
        // Verify room exists
        const room = await db.getRoomById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Join the socket room
        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.displayName = displayName;

        console.log(`${displayName} joined room ${roomId}`);

        // Notify others in the room
        socket.to(roomId).emit('user-joined', { displayName });
        
        socket.emit('joined-room', { roomId, displayName });
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Handle chat messages
    socket.on('send-message', async (data: { roomId: string; senderName: string; content: string }) => {
      const { roomId, senderName, content } = data;

      try {
        // Save message to database
        const message = await db.createMessage(roomId, senderName, content);

        // Broadcast to all clients in the room (including sender)
        io.to(roomId).emit('new-message', {
          id: message.id,
          sender_name: message.sender_name,
          content: message.content,
          created_at: message.created_at,
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // WebRTC signaling - offer
    socket.on('webrtc-offer', (data: { roomId: string; offer: any; to: string }) => {
      const { roomId, offer, to } = data;
      socket.to(roomId).emit('webrtc-offer', {
        offer,
        from: socket.id,
      });
    });

    // WebRTC signaling - answer
    socket.on('webrtc-answer', (data: { roomId: string; answer: any; to: string }) => {
      const { roomId, answer, to } = data;
      socket.to(to).emit('webrtc-answer', {
        answer,
        from: socket.id,
      });
    });

    // WebRTC signaling - ICE candidate
    socket.on('webrtc-ice-candidate', (data: { roomId: string; candidate: any; to?: string }) => {
      const { roomId, candidate, to } = data;
      if (to) {
        socket.to(to).emit('webrtc-ice-candidate', {
          candidate,
          from: socket.id,
        });
      } else {
        socket.to(roomId).emit('webrtc-ice-candidate', {
          candidate,
          from: socket.id,
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      const roomId = socket.data.roomId;
      const displayName = socket.data.displayName;

      if (roomId && displayName) {
        socket.to(roomId).emit('user-left', { displayName });
      }
    });
  });
}
