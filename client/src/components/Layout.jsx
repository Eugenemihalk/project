import React, { useEffect, useState } from 'react';
import Login from './Login';
import { request } from '../api';
import { Link, NavLink, Outlet } from 'react-router';
import { useDocuments } from '../store/DocumentsContext';
export function Layout() {
  const { documents, isLoading, storageError, reload, pending } = useDocuments();
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [email, setEmail] = useState('');
  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setEmail('');
  }
  useEffect(() => {
    setEmail('');
    if (!token) return;
    const controller = new AbortController();
    request('/profile', { signal: controller.signal })
      .then((user) => setEmail(user.email))
      .catch(() => {});
    return () => controller.abort();
  }, [token]);
  if (!token)
    return (
      <Login
        onLogin={() => {
          setToken(localStorage.getItem('token'));
          reload();
        }}
      />
    );
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-icon">Д.</span>
          <span>Документы</span>
        </Link>
        <div className="workspace">
          <span className="avatar">{email ? email[0].toUpperCase() : '…'}</span>
          <div className="user-email" title={email}>
            {email || 'Загрузка профиля…'}
          </div>
        </div>
        <div className="nav-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
        <nav aria-label="Основная навигация">
          <NavLink to="/" end>
            <span>▤</span> Все документы{' '}
            <span className="nav-count">{isLoading ? '…' : documents.length}</span>
          </NavLink>
          <NavLink to="/new">
            <span>＋</span> Создать документ
          </NavLink>
        </nav>
        <button className="logout-button" type="button" onClick={logout}>
          <svg
            className="logout-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5M14 8l4 4-4 4M8 12h10" />
          </svg>{' '}
          Выйти
        </button>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <span>
            Рабочее пространство <span className="breadcrumb">/ Документы</span>
          </span>
          <span className="topbar-label">React · useState · useEffect</span>
        </header>
        <main>
          {storageError && (
            <div className="error-banner" role="alert">
              {storageError} <button onClick={logout}>Сменить аккаунт</button>{' '}
              <button disabled={pending} onClick={reload}>
                Повторить
              </button>
            </div>
          )}
          {isLoading ? (
            <div className="loading" role="status">
              <span className="spinner" />
              Загружаем документы…
            </div>
          ) : (
            <Outlet />
          )}
        </main>
        <footer>
          Система совместного редактирования документов<span>React · REST API · PostgreSQL</span>
        </footer>
      </div>
    </div>
  );
}
export function Status({ value }) {
  return (
    <span className={`status ${value}`}>{value === 'published' ? 'Опубликован' : 'Черновик'}</span>
  );
}
export function formatDate(value) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
export function NotFound() {
  return (
    <section className="empty-state">
      <span className="empty-icon">▤</span>
      <h1>Документ не найден</h1>
      <p>Возможно, он был удалён или ссылка указана неверно.</p>
      <Link className="button primary" to="/">
        К списку документов
      </Link>
    </section>
  );
}
