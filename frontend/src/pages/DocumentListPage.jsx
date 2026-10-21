import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useDocuments } from '../store/DocumentsContext';
import { Status, formatDate } from '../components/Layout';

const SORTS = {
  updated: (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
  created: (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  title: (a, b) => a.title.localeCompare(b.title, 'ru'),
};

export default function DocumentListPage() {
  const { documents, removeDocument } = useDocuments();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState(() => {
    try {
      const saved = localStorage.getItem('collab.list.sort');
      return Object.hasOwn(SORTS, saved) ? saved : 'updated';
    } catch { return 'updated'; }
  });

  useEffect(() => {
    try { localStorage.setItem('collab.list.sort', sort); } catch { /* Не мешаем работе списка. */ }
  }, [sort]);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('ru');
    return documents
      .filter((item) => status === 'all' || item.status === status)
      .filter((item) => !q || `${item.title} ${item.content}`.toLocaleLowerCase('ru').includes(q))
      .sort(SORTS[sort]);
  }, [documents, query, status, sort]);

  const stats = useMemo(() => ({
    total: documents.length,
    published: documents.filter((item) => item.status === 'published').length,
    drafts: documents.filter((item) => item.status === 'draft').length,
  }), [documents]);

  function handleDelete(item) {
    if (window.confirm(`Удалить документ «${item.title}»? Это действие нельзя отменить.`)) removeDocument(item.id);
  }

  return <>
    <div className="page-heading"><div><div className="eyebrow">ВАШИ ИДЕИ В ОДНОМ МЕСТЕ</div><h1>Документы команды<span className="heading-dot">.</span></h1><p>Создавайте, редактируйте и находите нужные материалы.</p></div><Link to="/new" className="button primary"><span>＋</span> Новый документ</Link></div>
    <section className="stats" aria-label="Статистика документов">
      <div className="stat-card"><span className="stat-icon">▤</span><div><span>Всего документов</span><strong>{stats.total}</strong></div></div>
      <div className="stat-card"><span className="stat-icon green">✓</span><div><span>Опубликовано</span><strong>{stats.published}</strong></div></div>
      <div className="stat-card"><span className="stat-icon amber">✎</span><div><span>Черновики</span><strong>{stats.drafts}</strong></div></div>
    </section>
    <section className="documents-panel">
      <div className="panel-title"><h2>Библиотека документов</h2><span className="storage-label"><span className="online-dot" /> Сохранение при изменении</span></div>
      <div className="toolbar">
        <label className="search"><span aria-hidden="true">⌕</span><input aria-label="Поиск документов" placeholder="Поиск по названию или тексту…" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
        <label className="select-label">Статус<select aria-label="Фильтр по статусу" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">Все статусы</option><option value="draft">Черновики</option><option value="published">Опубликованные</option></select></label>
        <label className="select-label">Сортировка<select aria-label="Сортировка" value={sort} onChange={(e) => setSort(e.target.value)}><option value="updated">Сначала обновлённые</option><option value="created">Сначала новые</option><option value="title">По названию А–Я</option></select></label>
      </div>
      {visible.length ? <div className="table-wrap"><table><thead><tr><th>НАЗВАНИЕ ДОКУМЕНТА</th><th>СТАТУС</th><th>ИЗМЕНЁН</th><th><span className="sr-only">Действия</span></th></tr></thead><tbody>{visible.map((item) => <tr key={item.id}>
        <td><div className="document-cell"><span className="document-icon">▤</span><div><Link className="document-title" to={`/documents/${item.id}`}>{item.title}</Link><p>{item.content.replace(/\s+/g, ' ').slice(0, 95)}</p></div></div></td>
        <td><Status value={item.status} /></td><td className="date-cell">{formatDate(item.updatedAt)}</td>
        <td><div className="row-actions"><Link to={`/documents/${item.id}/edit`} className="icon-button" aria-label={`Редактировать: ${item.title}`} title="Редактировать">✎</Link><button className="icon-button delete" onClick={() => handleDelete(item)} aria-label={`Удалить: ${item.title}`} title="Удалить">×</button></div></td>
      </tr>)}</tbody></table></div> : <div className="empty-state"><span className="empty-icon">▤</span><h2>{documents.length ? 'Ничего не найдено' : 'Пока нет документов'}</h2><p>{documents.length ? 'Измените поисковый запрос или выберите другой статус.' : 'Создайте первый документ для вашей команды.'}</p>{!documents.length && <Link className="button primary" to="/new">Создать документ</Link>}</div>}
      <div className="table-footer">Показано {visible.length} из {documents.length}<span>Изменения остаются после перезагрузки</span></div>
    </section>
    <div className="info-note"><span>↳</span><p>Продолжайте с того места, где остановились.<br /><strong>Черновик в редакторе сохраняется автоматически через 500 мс после ввода.</strong></p></div>
  </>;
}
