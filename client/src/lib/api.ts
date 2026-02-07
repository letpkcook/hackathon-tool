const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiError {
  error: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Room APIs
export async function createRoom(name: string, password: string) {
  return request<{ id: string; name: string; created_at: string }>('/api/rooms', {
    method: 'POST',
    body: JSON.stringify({ name, password }),
  });
}

export async function getRoom(roomId: string) {
  return request<{
    id: string;
    name: string;
    created_at: string;
    members: { display_name: string; joined_at: string }[];
  }>(`/api/rooms/${roomId}`);
}

export async function joinRoom(roomId: string, password: string, displayName: string) {
  return request<{
    success: boolean;
    roomId: string;
    displayName: string;
    token: string;
  }>(`/api/rooms/${roomId}/join`, {
    method: 'POST',
    body: JSON.stringify({ password, displayName }),
  });
}

export async function getPublicRoom(roomId: string) {
  return request<{
    name: string;
    created_at: string;
    members: string[];
    posts: Array<{
      id: number;
      author_name: string;
      title: string;
      body: string | null;
      link: string | null;
      created_at: string;
    }>;
  }>(`/api/rooms/${roomId}/public`);
}

// Message APIs
export async function getMessages(roomId: string, limit = 100) {
  return request<{
    messages: Array<{
      id: number;
      sender_name: string;
      content: string;
      created_at: string;
    }>;
  }>(`/api/rooms/${roomId}/messages?limit=${limit}`);
}

// Post APIs
export async function createPost(
  roomId: string,
  authorName: string,
  title: string,
  body?: string,
  link?: string
) {
  return request<{
    id: number;
    author_name: string;
    title: string;
    body: string | null;
    link: string | null;
    created_at: string;
  }>(`/api/rooms/${roomId}/posts`, {
    method: 'POST',
    body: JSON.stringify({ authorName, title, body, link }),
  });
}

export async function getPosts(roomId: string) {
  return request<{
    posts: Array<{
      id: number;
      author_name: string;
      title: string;
      body: string | null;
      link: string | null;
      created_at: string;
    }>;
  }>(`/api/rooms/${roomId}/posts`);
}
