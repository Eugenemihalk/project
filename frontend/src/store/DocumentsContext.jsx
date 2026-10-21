import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DocumentsContext = createContext(null);

export function DocumentsProvider({ children }) {
  const { documents, setDocuments, isLoading, storageError } = useLocalStorage();

  const addDocument = useCallback((data) => {
    const now = new Date().toISOString();
    const document = { id: crypto.randomUUID(), ...data, createdAt: now, updatedAt: now };
    setDocuments((prev) => [...prev, document]);
    return document;
  }, [setDocuments]);

  const updateDocument = useCallback((id, data) => {
    setDocuments((prev) => prev.map((item) => item.id === id
      ? { ...item, title: data.title, content: data.content, status: data.status, updatedAt: new Date().toISOString() }
      : item));
  }, [setDocuments]);

  const removeDocument = useCallback((id) => {
    setDocuments((prev) => prev.filter((item) => item.id !== id));
  }, [setDocuments]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = isLoading ? 'Загрузка… — Документы' : `Документы (${documents.length}) — Команда`;
    return () => { document.title = previousTitle; };
  }, [documents.length, isLoading]);

  return <DocumentsContext.Provider value={{ documents, isLoading, storageError, addDocument, updateDocument, removeDocument }}>
    {children}
  </DocumentsContext.Provider>;
}

export function useDocuments() {
  return useContext(DocumentsContext);
}
