import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useDocuments } from '../store/DocumentsContext';
import { NotFound } from '../components/Layout';

function readDraft(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    if (data && typeof data.form?.title === 'string' && typeof data.form?.content === 'string'
      && ['draft', 'published'].includes(data.form.status) && typeof data.savedAt === 'string'
      && Number.isFinite(Date.parse(data.savedAt))) return data;
  } catch { /* Отсутствующий или повреждённый черновик не мешает редактору. */ }
  return null;
}

export default function DocumentEditorPage() {
  const { id } = useParams();
  const { documents } = useDocuments();
  const document = documents.find((item) => item.id === id);
  if (id && !document) return <NotFound />;
  return <Editor key={id ?? 'new'} document={document} />;
}

function Editor({ document }) {
  const { addDocument, updateDocument } = useDocuments();
  const navigate = useNavigate();
  const draftKey = `collab.draft.${document?.id ?? 'new'}`;
  const [draft] = useState(() => readDraft(draftKey));
  const initial = { title: document?.title ?? '', content: document?.content ?? '', status: document?.status ?? 'draft' };
  const [form, setForm] = useState(draft?.form ?? initial);
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState(draft?.savedAt ?? null);
  const [error, setError] = useState('');
  const [restored, setRestored] = useState(Boolean(draft));

  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => {
      try {
        const now = new Date().toISOString();
        localStorage.setItem(draftKey, JSON.stringify({ form, savedAt: now }));
        setSavedAt(now);
        setError('');
      } catch { setError('Не удалось сохранить черновик в браузере.'); }
    }, 500);
    return () => clearTimeout(timer);
  }, [form, draftKey, dirty]);

  function change(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setDirty(true);
    setSavedAt(null);
  }

  const valid = form.title.trim().length >= 3 && form.content.trim().length > 0;

  function handleSubmit(event) {
    event.preventDefault();
    if (!valid) return;
    const data = { title: form.title.trim(), content: form.content.trim(), status: form.status };
    if (document) updateDocument(document.id, data);
    else addDocument(data);
    try { localStorage.removeItem(draftKey); } catch { /* Список всё ещё обновляется в памяти. */ }
    navigate('/');
  }

  function discardDraft() {
    try { localStorage.removeItem(draftKey); } catch { setError('Не удалось удалить черновик в браузере.'); return; }
    setForm(initial);
    setDirty(false);
    setRestored(false);
    setSavedAt(null);
  }

  return <>
    <Link className="back-link" to="/">← Все документы</Link>
    <div className="page-heading"><div><div className="eyebrow">РЕДАКТОР ДОКУМЕНТА</div><h1>{document ? 'Редактирование' : 'Новый документ'}<span className="heading-dot">.</span></h1><p>{document ? 'Обновите содержание и сохраните изменения.' : 'Дайте идее название и начните с первого абзаца.'}</p></div></div>
    {restored && <div className="restore-banner" role="status">Восстановлен несохранённый черновик.<button type="button" className="text-button" onClick={discardDraft}>Сбросить черновик</button></div>}
    {error && <div className="error-banner" role="alert">{error}</div>}
    <form className="editor-panel" onSubmit={handleSubmit}>
      <div className="editor-heading"><h2>Содержание документа</h2><span className="save-indicator" role="status">{dirty && !savedAt ? 'Ожидание автосохранения…' : savedAt ? 'Черновик сохранён' : 'Автосохранение включено'}</span></div>
      <div className="editor-fields"><div className="form-row"><label className="field grow">Название документа<input name="title" value={form.title} onChange={change} placeholder="Например, план проекта" required minLength={3} maxLength={255} autoFocus /><small>От 3 до 255 символов</small></label><label className="field status-field">Статус<select name="status" value={form.status} onChange={change}><option value="draft">Черновик</option><option value="published">Опубликован</option></select></label></div>
      <label className="field">Текст документа<textarea name="content" value={form.content} onChange={change} placeholder="О чём этот документ?" required rows={13} /><small>{form.content.length} символов · Данные доступны в этом браузере</small></label></div>
      <div className="editor-footer"><span>Заполните название и текст документа.</span><div><Link className="button secondary" to="/">К списку</Link><button className="button primary" type="submit" disabled={!valid}>{document ? 'Сохранить изменения' : 'Создать документ'}</button></div></div>
    </form>
  </>;
}
