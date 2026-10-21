import React from 'react';
import { Route, Routes } from 'react-router';
import { Layout, NotFound } from './components/Layout';
import DocumentListPage from './pages/DocumentListPage';
import DocumentEditorPage from './pages/DocumentEditorPage';
import DocumentViewPage from './pages/DocumentViewPage';

export default function App() {
  return <Routes><Route element={<Layout />}>
    <Route index element={<DocumentListPage />} />
    <Route path="new" element={<DocumentEditorPage />} />
    <Route path="documents/:id" element={<DocumentViewPage />} />
    <Route path="documents/:id/edit" element={<DocumentEditorPage />} />
    <Route path="*" element={<NotFound />} />
  </Route></Routes>;
}
