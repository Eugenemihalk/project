import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { useDocuments } from '../store/DocumentsContext';

export function Layout() {
  const { documents, isLoading, storageError } = useDocuments();
  return <div className="app-shell">
    <aside className="sidebar">
      <Link to="/" className="brand"><span className="brand-icon">д.</span><span>Документы<span className="brand-sub">пространство команды</span></span></Link>
      <div className="workspace"><span className="avatar">ЕЛ</span><div>Учебный проект<small>Евгений Лозюк</small></div></div>
      <div className="nav-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
      <nav aria-label="Основная навигация">
        <NavLink to="/" end><span>▤</span> Все документы <span className="nav-count">{isLoading ? '…' : documents.length}</span></NavLink>
        <NavLink to="/new"><span>＋</span> Создать документ</NavLink>
      </nav>
      <div className="sidebar-bottom"><span className="online-dot" /> Локальное пространство<p>Документы сохраняются<br />в этом браузере.</p><small>ЛАБОРАТОРНАЯ РАБОТА №4</small></div>
    </aside>
    <div className="main-area">
      <header className="topbar"><span>Рабочее пространство <span className="breadcrumb">/ Документы</span></span><span className="topbar-label">React · useState · useEffect</span></header>
      <main>
        {storageError && <div className="error-banner" role="alert">{storageError}</div>}
        {isLoading ? <div className="loading" role="status"><span className="spinner" />Загружаем документы…</div> : <Outlet />}
      </main>
      <footer>Система совместного редактирования документов<span>Автономный клиент · localStorage</span></footer>
    </div>
  </div>;
}

export function Status({ value }) {
  return <span className={`status ${value}`}>{value === 'published' ? 'Опубликован' : 'Черновик'}</span>;
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function NotFound() {
  return <section className="empty-state"><span className="empty-icon">▤</span><h1>Документ не найден</h1><p>Возможно, он был удалён или ссылка указана неверно.</p><Link className="button primary" to="/">К списку документов</Link></section>;
}
