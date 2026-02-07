'use client';

import { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';

interface VideoCallProps {
  roomId: string;
  displayName: string;
}

export default function VideoCall({ roomId, displayName }: VideoCallProps) {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string>('');
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize peer and local media
  useEffect(() => {
    const initPeer = async () => {
      try {
        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize PeerJS
        const newPeer = new Peer();
        
        newPeer.on('open', (id) => {
          console.log('Peer ID:', id);
          setPeerId(id);
        });

        newPeer.on('call', (call: MediaConnection) => {
          console.log('Receiving call from:', call.peer);
          call.answer(stream);
          
          call.on('stream', (remoteStream) => {
            console.log('Received remote stream from:', call.peer);
            setRemoteStreams((prev) => {
              const newMap = new Map(prev);
              newMap.set(call.peer, remoteStream);
              return newMap;
            });
          });

          call.on('close', () => {
            console.log('Call closed with:', call.peer);
            setRemoteStreams((prev) => {
              const newMap = new Map(prev);
              newMap.delete(call.peer);
              return newMap;
            });
          });
        });

        setPeer(newPeer);
      } catch (error) {
        console.error('Error initializing video call:', error);
      }
    };

    initPeer();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peer) {
        peer.destroy();
      }
    };
  }, []);

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Video Call</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Your Peer ID: <strong>{peerId || 'Connecting...'}</strong></p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Share this ID with others in the room to connect (manual connection for MVP)
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={toggleAudio} style={{
          padding: '10px 20px',
          backgroundColor: isAudioEnabled ? '#4CAF50' : '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          {isAudioEnabled ? '🎤 Mute' : '🎤 Unmute'}
        </button>
        
        <button onClick={toggleVideo} style={{
          padding: '10px 20px',
          backgroundColor: isVideoEnabled ? '#4CAF50' : '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          {isVideoEnabled ? '📹 Stop Video' : '📹 Start Video'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
      }}>
        {/* Local video */}
        <div style={{ position: 'relative' }}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              backgroundColor: '#000',
              borderRadius: '8px',
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '14px',
          }}>
            You ({displayName})
          </div>
        </div>

        {/* Remote videos */}
        {Array.from(remoteStreams.entries()).map(([peerId, stream]) => (
          <RemoteVideo key={peerId} stream={stream} peerId={peerId} />
        ))}
      </div>

      {remoteStreams.size === 0 && (
        <p style={{ color: '#666', marginTop: '20px' }}>
          No other participants connected yet. This is a basic PeerJS setup. 
          For production, integrate with Socket.IO signaling for automatic peer discovery.
        </p>
      )}
    </div>
  );
}

function RemoteVideo({ stream, peerId }: { stream: MediaStream; peerId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{ position: 'relative' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: '100%',
          backgroundColor: '#000',
          borderRadius: '8px',
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '14px',
      }}>
        Peer: {peerId.substring(0, 8)}...
      </div>
    </div>
  );
}
