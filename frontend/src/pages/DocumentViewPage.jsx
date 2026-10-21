import React from 'react';
import { Link, useParams } from 'react-router';
import { useDocuments } from '../store/DocumentsContext';
import { Status, NotFound, formatDate } from '../components/Layout';

export default function DocumentViewPage() {
  const { id } = useParams();
  const { documents } = useDocuments();
  const document = documents.find((item) => item.id === id);
  if (!document) return <NotFound />;
  return <><Link className="back-link" to="/">← Все документы</Link><div className="page-heading"><div><div className="eyebrow">ПРОСМОТР ДОКУМЕНТА</div><h1>{document.title}</h1><p>Создан {formatDate(document.createdAt)} · Обновлён {formatDate(document.updatedAt)}</p></div><Link className="button primary" to={`/documents/${id}/edit`}>✎ Редактировать</Link></div><article className="document-view"><Status value={document.status} /><div className="document-content">{document.content}</div></article></>;
}
