const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:7000').replace(/\/$/, '');
export async function request(path, { method = 'GET', body, signal } = {}) {
  const token = localStorage.getItem('token');
  let response;
  try {
    response = await fetch(`${baseURL}${path}`, {
      method,
      cache: 'no-store',
      signal,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : void 0,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Сервер недоступен. Проверьте подключение и запуск сервера.');
  }
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.error || `Ошибка HTTP ${response.status}`);
  return data;
}
const normalize = (doc) => ({ ...doc, id: String(doc.id) });
export const fetchDocuments = (signal) =>
  request('/documents', { signal }).then((rows) => rows.map(normalize));
export const addDocument = (body) =>
  request('/documents', { method: 'POST', body }).then(normalize);
export const updateDocument = (id, body) =>
  request(`/documents/${id}`, { method: 'PUT', body }).then(normalize);
export const deleteDocument = (id) => request(`/documents/${id}`, { method: 'DELETE' });
