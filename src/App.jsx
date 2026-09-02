import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const emptyForm = { name: '', cuisine: '', location: '', priceRange: '$$', description: '' };

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

function Auth({ onSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await request(`/auth/${mode}`, { method: 'POST', body: form });
      onSuccess(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return <main className="auth-layout">
    <section className="intro-panel"><div className="wordmark">TABLECRAFT<span>.</span></div><div className="intro-copy"><p className="eyebrow">RESTAURANT OPERATIONS</p><h1>Keep every table<br /><em>in good company.</em></h1><p className="intro-text">A calm, focused place to manage the restaurants that make your neighborhood worth visiting.</p></div><p className="edition">PERSONAL EDITION / 01</p></section>
    <section className="auth-panel"><div className="auth-box"><p className="eyebrow">WELCOME BACK</p><h2>{mode === 'login' ? 'Sign in to your desk' : 'Create your account'}</h2><p className="muted">{mode === 'login' ? 'Your restaurant list is waiting.' : 'Start building your restaurant list.'}</p><form onSubmit={submit}>
      {mode === 'register' && <label>Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Alex Morgan" /></label>}
      <label>Email address<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="alex@example.com" /></label>
      <label>Password<input required minLength="6" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 6 characters" /></label>
      {error && <p className="error">{error}</p>}<button className="primary-button" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Enter workspace' : 'Create account'}</button>
    </form><button className="text-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'Need an account? Register' : 'Already registered? Sign in'}</button></div></section>
  </main>;
}

function Dashboard({ session, onLogout }) {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function loadRestaurants() {
    try { setRestaurants(await request('/restaurants', { token: session.token })); } catch (requestError) { setError(requestError.message); }
  }
  useEffect(() => { loadRestaurants(); }, []);

  async function submit(event) {
    event.preventDefault(); setError(''); setNotice('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      await request(editingId ? `/restaurants/${editingId}` : '/restaurants', { method, token: session.token, body: form });
      setForm(emptyForm); setEditingId(null); setNotice(editingId ? 'Restaurant updated.' : 'Restaurant added.'); await loadRestaurants();
    } catch (requestError) { setError(requestError.message); }
  }
  function edit(restaurant) { setEditingId(restaurant._id); setForm({ name: restaurant.name, cuisine: restaurant.cuisine, location: restaurant.location, priceRange: restaurant.priceRange, description: restaurant.description }); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  async function remove(id) { if (!window.confirm('Delete this restaurant?')) return; try { await request(`/restaurants/${id}`, { method: 'DELETE', token: session.token }); setNotice('Restaurant deleted.'); await loadRestaurants(); } catch (requestError) { setError(requestError.message); } }

  return <main className="app-shell"><header className="topbar"><div className="wordmark">TABLECRAFT<span>.</span></div><div className="profile"><span>{session.user.name}</span><button className="logout-button" onClick={onLogout}>Log out</button></div></header><section className="dashboard-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>Restaurant directory</h1><p className="muted">Keep the details of your favorite places close at hand.</p></div><div className="count"><strong>{restaurants.length.toString().padStart(2, '0')}</strong><span>places saved</span></div></section><section className="workspace-grid"><form className="editor" onSubmit={submit}><div className="section-label">{editingId ? 'EDIT PLACE' : 'ADD A PLACE'}</div><h2>{editingId ? 'Refine the details' : 'A new favorite'}</h2><label>Restaurant name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="The Greenhouse" /></label><div className="two-col"><label>Cuisine<input required value={form.cuisine} onChange={(event) => setForm({ ...form, cuisine: event.target.value })} placeholder="Italian" /></label><label>Price<select value={form.priceRange} onChange={(event) => setForm({ ...form, priceRange: event.target.value })}><option>$</option><option>$$</option><option>$$$</option><option>$$$$</option></select></label></div><label>Location<input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Downtown" /></label><label>Notes<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What makes it special?" rows="4" /></label>{error && <p className="error">{error}</p>}{notice && <p className="notice">{notice}</p>}<div className="form-actions"><button className="primary-button">{editingId ? 'Save changes' : 'Add restaurant'}</button>{editingId && <button type="button" className="secondary-button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}</div></form><section className="list-panel"><div className="section-label">SAVED PLACES</div>{restaurants.length === 0 ? <div className="empty-state"><h2>Your directory is quiet.</h2><p>Add the first restaurant to start your collection.</p></div> : <div className="restaurant-list">{restaurants.map((restaurant, index) => <article className="restaurant-item" key={restaurant._id}><div className="number">{String(index + 1).padStart(2, '0')}</div><div className="restaurant-details"><h3>{restaurant.name}</h3><p>{restaurant.cuisine} <span>/</span> {restaurant.location}</p>{restaurant.description && <small>{restaurant.description}</small>}</div><div className="restaurant-actions"><b>{restaurant.priceRange}</b><button title="Edit restaurant" onClick={() => edit(restaurant)}>Edit</button><button title="Delete restaurant" onClick={() => remove(restaurant._id)}>Delete</button></div></article>)}</div>}</section></section></main>;
}

export default function App() {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('tablecraft_session') || 'null'));
  function login(data) { localStorage.setItem('tablecraft_session', JSON.stringify(data)); setSession(data); }
  function logout() { localStorage.removeItem('tablecraft_session'); setSession(null); }
  return session ? <Dashboard session={session} onLogout={logout} /> : <Auth onSuccess={login} />;
}
