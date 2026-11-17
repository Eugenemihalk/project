import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useDocuments } from '../store/DocumentsContext';
import { NotFound } from '../components/Layout';
export default function DocumentEditorPage() {
  const { id } = useParams();
  const { documents } = useDocuments();
  const document = documents.find((item) => item.id === id);
  if (id && !document) return <NotFound />;
  return <Editor key={id ?? 'new'} document={document} />;
}
function Editor({ document }) {
  const { addDocument, updateDocument, pending } = useDocuments();
  const navigate = useNavigate();
  const initial = {
    title: document?.title ?? '',
    content: document?.content ?? '',
    status: document?.status ?? 'draft',
  };
  const [form, setForm] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  function change(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setDirty(true);
  }
  const valid = form.title.trim().length >= 3 && form.content.trim().length > 0;
  async function handleSubmit(event) {
    event.preventDefault();
    if (!valid) return;
    const data = { title: form.title.trim(), content: form.content.trim(), status: form.status };
    try {
      if (document) await updateDocument(document.id, data);
      else await addDocument(data);
      navigate('/');
    } catch (error2) {
      setError(error2.message);
    }
  }
  return (
    <>
      <Link className="back-link" to="/">
        ← Все документы
      </Link>
      <div className="page-heading">
        <div>
          <div className="eyebrow">РЕДАКТОР ДОКУМЕНТА</div>
          <h1>
            {document ? 'Редактирование' : 'Новый документ'}
            <span className="heading-dot">.</span>
          </h1>
          <p>
            {document
              ? 'Обновите содержание и сохраните изменения.'
              : 'Дайте идее название и начните с первого абзаца.'}
          </p>
        </div>
      </div>
      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}
      <form className="editor-panel" onSubmit={handleSubmit}>
        <div className="editor-heading">
          <h2>Содержание документа</h2>
          <span className="save-indicator" role="status">
            {dirty ? 'Есть несохранённые изменения' : 'Данные с сервера'}
          </span>
        </div>
        <div className="editor-fields">
          <div className="form-row">
            <label className="field grow">
              Название документа
              <input
                name="title"
                value={form.title}
                onChange={change}
                placeholder="Например, план проекта"
                required
                minLength={3}
                maxLength={255}
                autoFocus
              />
              <small>От 3 до 255 символов</small>
            </label>
            <label className="field status-field">
              Статус
              <select name="status" value={form.status} onChange={change}>
                <option value="draft">Черновик</option>
                <option value="published">Опубликован</option>
              </select>
            </label>
          </div>
          <label className="field">
            Текст документа
            <textarea
              name="content"
              value={form.content}
              onChange={change}
              placeholder="О чём этот документ?"
              required
              rows={13}
            />
            <small>{form.content.length} символов · Документ сохраняется на сервере</small>
          </label>
        </div>
        <div className="editor-footer">
          <span>Заполните название и текст документа.</span>
          <div>
            <Link className="button secondary" to="/">
              К списку
            </Link>
            <button className="button primary" type="submit" disabled={!valid || pending}>
              {pending ? 'Сохранение…' : document ? 'Сохранить изменения' : 'Создать документ'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
