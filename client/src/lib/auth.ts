export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
}

export function getRoomInfo(): { roomId: string; displayName: string } | null {
  if (typeof window === 'undefined') return null;
  const token = getAuthToken();
  if (!token) return null;

  try {
    const decoded = atob(token);
    const [roomId, displayName] = decoded.split(':');
    return { roomId, displayName };
  } catch {
    return null;
  }
}
