import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from '../api';
const DocumentsContext = createContext(null);
export function DocumentsProvider({ children }) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [storageError, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setDocuments([]);
    setLoading(true);
    setError('');
    api
      .fetchDocuments(controller.signal)
      .then(setDocuments)
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [version]);
  async function mutate(kind, id, data) {
    const previous = documents;
    const tempId = `temp-${crypto.randomUUID()}`;
    const now = /* @__PURE__ */ new Date().toISOString();
    setPending(true);
    setError('');
    if (kind === 'add')
      setDocuments((prev) => [...prev, { ...data, id: tempId, createdAt: now, updatedAt: now }]);
    if (kind === 'update')
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...data, updatedAt: now } : d)),
      );
    if (kind === 'delete') setDocuments((prev) => prev.filter((d) => d.id !== id));
    try {
      if (kind === 'delete') await api.deleteDocument(id);
      else {
        const saved =
          kind === 'add' ? await api.addDocument(data) : await api.updateDocument(id, data);
        setDocuments((prev) =>
          prev.map((d) => (d.id === (kind === 'add' ? tempId : id) ? saved : d)),
        );
      }
    } catch (error) {
      setDocuments(previous);
      setError(error.message);
      throw error;
    } finally {
      setPending(false);
    }
  }
  return (
    <DocumentsContext.Provider
      value={{
        documents,
        isLoading,
        storageError,
        pending,
        reload,
        addDocument: (data) => mutate('add', null, data),
        updateDocument: (id, data) => mutate('update', id, data),
        removeDocument: (id) => mutate('delete', id),
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}
export const useDocuments = () => useContext(DocumentsContext);
