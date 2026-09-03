import { useState } from 'react';

import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export default function App() {
  const [session, setSession] = useState(() =>
    JSON.parse(
      localStorage.getItem(
        'tablecraft_session'
      ) || 'null'
    )
  );

  function login(data) {
    localStorage.setItem(
      'tablecraft_session',
      JSON.stringify(data)
    );

    setSession(data);
  }

  function logout() {
    localStorage.removeItem(
      'tablecraft_session'
    );

    setSession(null);
  }

  return session ? (
    <Dashboard
      session={session}
      onLogout={logout}
    />
  ) : (
    <Auth onSuccess={login} />
  );
}