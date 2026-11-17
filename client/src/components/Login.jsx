import React, { useState } from 'react';
import { request } from '../api';
export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const register = mode === 'register';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const rules = [
    { label: 'Больше 8 и меньше 64 символов', valid: password.length > 8 && password.length < 64 },
    {
      label: 'Только латиница, цифры и спецсимволы, без пробелов',
      valid: /^[!-~]+$/.test(password),
    },
    { label: 'Хотя бы один спецсимвол', valid: /[^A-Za-z0-9]/.test(password) },
  ];
  const valid = rules.every((rule) => rule.valid) && confirmation === password;
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget));
    if (register && !valid) {
      setError('Проверьте требования к паролю и его подтверждение.');
      return;
    }
    delete body.confirmation;
    setBusy(true);
    setError('');
    try {
      if (register) await request('/auth/register', { method: 'POST', body });
      const { token } = await request('/auth/login', { method: 'POST', body });
      localStorage.setItem('token', token);
      onLogin();
    } catch (error2) {
      setError(error2.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <section className="editor-panel auth-card">
        <h1>{register ? 'Регистрация' : 'Вход в аккаунт'}</h1>
        <form key={mode} className="auth-form" onSubmit={submit}>
          <label className="field">
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="field">
            Пароль
            <input
              name="password"
              type="password"
              autoComplete={register ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-describedby={register ? 'password-rules' : void 0}
              required
            />
          </label>
          {register && (
            <>
              <label className="field">
                Подтвердите пароль
                <input
                  name="confirmation"
                  type="password"
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  aria-describedby="password-rules"
                  aria-invalid={Boolean(confirmation && confirmation !== password)}
                  required
                />
              </label>
              <ul id="password-rules" className="password-rules">
                {rules.map((rule) => (
                  <li
                    key={rule.label}
                    className={!password ? 'neutral' : rule.valid ? 'valid' : 'invalid'}
                  >
                    <span aria-hidden="true">{!password ? '○' : rule.valid ? '✓' : '\xD7'}</span>{' '}
                    {rule.label}
                  </li>
                ))}
              </ul>
            </>
          )}
          {error && <p role="alert">{error}</p>}
          <div className="auth-actions">
            <button disabled={busy || (register && !valid)} className="button primary">
              {busy ? 'Подождите…' : register ? 'Зарегистрироваться' : 'Войти'}
            </button>
            <p className="auth-switch">
              {register ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setMode(register ? 'login' : 'register');
                  setError('');
                  setPassword('');
                  setConfirmation('');
                }}
              >
                {register ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
