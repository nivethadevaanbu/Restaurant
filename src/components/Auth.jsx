import { useState } from 'react';
import {
  loginUser,
  registerUser,
} from '../service/service';

function Auth({ onSuccess }) {
  const [mode, setMode] = useState('login');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();

    setError('');
    setLoading(true);
    console.log(event,"llogi")
    try {
      const data =
        mode === 'login'
          ? await loginUser({
              email: form.email,
              password: form.password,
            })
          : await registerUser(form);

      onSuccess(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="intro-panel">
        <div className="wordmark">
          TABLECRAFT<span>.</span>
        </div>

        <div className="intro-copy">
          <p className="eyebrow">
            RESTAURANT OPERATIONS
          </p>

          <h1>
            Keep every table
            <br />
            <em>in good company.</em>
          </h1>

          <p className="intro-text">
            A calm, focused place to manage the restaurants
            that make your neighborhood worth visiting.
          </p>
        </div>

        <p className="edition">
          PERSONAL EDITION / 01
        </p>
      </section>

      <section className="auth-panel">
        <div className="auth-box">
          <p className="eyebrow">WELCOME BACK</p>

          <h2>
            {mode === 'login'
              ? 'Sign in to your desk'
              : 'Create your account'}
          </h2>

          <p className="muted">
            {mode === 'login'
              ? 'Your restaurant list is waiting.'
              : 'Start building your restaurant list.'}
          </p>

          <form onSubmit={submit}>
            {mode === 'register' && (
              <label>
                Full name

                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder="Alex Morgan"
                />
              </label>
            )}

            <label>
              Email address

              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({
                    ...form,
                    email: event.target.value,
                  })
                }
                placeholder="alex@example.com"
              />
            </label>

            <label>
              Password

              <input
                required
                minLength="6"
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({
                    ...form,
                    password: event.target.value,
                  })
                }
                placeholder="At least 6 characters"
              />
            </label>

            {error && (
              <p className="error">{error}</p>
            )}

            <button
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Enter workspace'
                : 'Create account'}
            </button>
          </form>

          <button
            className="text-button"
            onClick={() => {
              setMode(
                mode === 'login'
                  ? 'register'
                  : 'login'
              );
              setError('');
            }}
          >
            {mode === 'login'
              ? 'Need an account? Register'
              : 'Already registered? Sign in'}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Auth;