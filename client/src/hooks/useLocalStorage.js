import { useEffect, useState } from 'react';
import { mockDocuments } from '../data/mockDocuments';
import { readDocuments, writeDocuments } from '../data/storage';
export function useLocalStorage() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setDocuments(readDocuments(window.localStorage, mockDocuments));
      } catch {
        setDocuments(mockDocuments);
      }
      setIsLoading(false);
    }, 1e3);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (isLoading) return;
    try {
      writeDocuments(window.localStorage, documents);
      setStorageError('');
    } catch {
      setStorageError(
        'Не удалось сохранить документы в браузере. Проверьте доступ к localStorage и свободное место. До перезагрузки изменения доступны в этой вкладке.',
      );
    }
  }, [documents, isLoading]);
  return { documents, setDocuments, isLoading, storageError };
}
