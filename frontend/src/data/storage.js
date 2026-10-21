export const STORAGE_KEY = 'collab.documents';

// Данные из браузера тоже проверяются: JSON может быть изменён вручную.
export function isDocumentList(value) {
  return Array.isArray(value) && value.every((item) => (
    item && typeof item.id === 'string' && item.id.length > 0
    && typeof item.title === 'string' && item.title.trim().length >= 3
    && typeof item.content === 'string' && item.content.trim().length > 0
    && ['draft', 'published'].includes(item.status)
    && typeof item.createdAt === 'string' && Number.isFinite(Date.parse(item.createdAt))
    && typeof item.updatedAt === 'string' && Number.isFinite(Date.parse(item.updatedAt))
  )) && new Set(value.map((item) => item.id)).size === value.length;
}

export function readDocuments(storage, fallback) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return fallback;
    const data = JSON.parse(raw);
    return isDocumentList(data) ? data : fallback;
  } catch {
    return fallback;
  }
}

export function writeDocuments(storage, documents) {
  storage.setItem(STORAGE_KEY, JSON.stringify(documents));
}
