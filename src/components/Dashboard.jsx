import { useEffect, useState } from 'react';

import {
    fetchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
} from '../service/service';

const emptyForm = {
    name: '',
    cuisine: '',
    location: '',
    priceRange: '$$',
    description: '',
};

function Dashboard({ session, onLogout }) {
    const [restaurants, setRestaurants] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [notice, setNotice] = useState('');
    const [error, setError] = useState('');

    async function loadRestaurants() {
        try {
            const data = await fetchRestaurants(
                session.token
            );

            setRestaurants(data);
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    useEffect(() => {
        loadRestaurants();
    }, []);

    async function submit(event) {
        event.preventDefault();

        setError('');
        setNotice('');

        try {
            if (editingId) {
                await updateRestaurant(
                    editingId,
                    form,
                    session.token
                );

                setNotice('Restaurant updated.');
            } else {
                await createRestaurant(
                    form,
                    session.token
                );

                setNotice('Restaurant added.');
            }

            setForm(emptyForm);
            setEditingId(null);

            await loadRestaurants();
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    function edit(restaurant) {
        setEditingId(restaurant._id);

        setForm({
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            location: restaurant.location,
            priceRange: restaurant.priceRange,
            description: restaurant.description || '',
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    async function remove(id) {
        if (
            !window.confirm(
                'Delete this restaurant?'
            )
        ) {
            return;
        }

        try {
            await deleteRestaurant(
                id,
                session.token
            );

            setNotice('Restaurant deleted.');

            await loadRestaurants();
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    return (
        <main className="app-shell">
            <header className="topbar">
                <div className="wordmark">
                    TABLECRAFT<span>.</span>
                </div>

                <div className="profile">
                    <span>{session.user.name}</span>

                    <button
                        className="logout-button"
                        onClick={onLogout}
                    >
                        Log out
                    </button>
                </div>
            </header>

            <section className="dashboard-heading">
                <div>
                    <p className="eyebrow">
                        YOUR WORKSPACE
                    </p>

                    <h1>Restaurant directory</h1>

                    <p className="muted">
                        Keep the details of your favorite places
                        close at hand.
                    </p>
                </div>

                <div className="count">
                    <strong>
                        {restaurants.length
                            .toString()
                            .padStart(2, '0')}
                    </strong>

                    <span>places saved</span>
                </div>
            </section>

            <section className="workspace-grid">
                <form
                    className="editor"
                    onSubmit={submit}
                >
                    <div className="section-label">
                        {editingId
                            ? 'EDIT PLACE'
                            : 'ADD A PLACE'}
                    </div>

                    <h2>
                        {editingId
                            ? 'Refine the details'
                            : 'A new favorite'}
                    </h2>

                    <label>
                        Restaurant name

                        <input
                            required
                            value={form.name}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    name: event.target.value,
                                })
                            }
                            placeholder="The Greenhouse"
                        />
                    </label>

                    <div className="two-col">
                        <label>
                            Cuisine

                            <input
                                required
                                value={form.cuisine}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        cuisine: event.target.value,
                                    })
                                }
                                placeholder="Italian"
                            />
                        </label>

                        <label>
                            Price

                            <select
                                value={form.priceRange}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        priceRange:
                                            event.target.value,
                                    })
                                }
                            >
                                <option>$</option>
                                <option>$$</option>
                                <option>$$$</option>
                                <option>$$$$</option>
                            </select>
                        </label>
                    </div>

                    <label>
                        Location

                        <input
                            required
                            value={form.location}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    location: event.target.value,
                                })
                            }
                            placeholder="Downtown"
                        />
                    </label>

                    <label>
                        Notes

                        <textarea
                            value={form.description}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    description:
                                        event.target.value,
                                })
                            }
                            placeholder="What makes it special?"
                            rows="4"
                        />
                    </label>

                    {error && (
                        <p className="error">{error}</p>
                    )}

                    {notice && (
                        <p className="notice">{notice}</p>
                    )}

                    <div className="form-actions">
                        <button className="primary-button">
                            {editingId
                                ? 'Save changes'
                                : 'Add restaurant'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => {
                                    setEditingId(null);
                                    setForm(emptyForm);
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <section className="list-panel">
                    <div className="section-label">
                        SAVED PLACES
                    </div>

                    {restaurants.length === 0 ? (
                        <div className="empty-state">
                            <h2>
                                Your directory is quiet.
                            </h2>

                            <p>
                                Add the first restaurant to start
                                your collection.
                            </p>
                        </div>
                    ) : (
                        <div className="restaurant-list">
                            {restaurants.map(
                                (restaurant, index) => (
                                    <article
                                        className="restaurant-item"
                                        key={restaurant._id}
                                    >
                                        <div className="number">
                                            {String(index + 1).padStart(
                                                2,
                                                '0'
                                            )}
                                        </div>

                                        <div className="restaurant-details">
                                            <h3>
                                                {restaurant.name}
                                            </h3>

                                            <p>
                                                {restaurant.cuisine}{' '}
                                                <span>/</span>{' '}
                                                {restaurant.location}
                                            </p>

                                            {restaurant.description && (
                                                <small>
                                                    {restaurant.description}
                                                </small>
                                            )}
                                        </div>

                                        <div className="restaurant-actions">
                                            <b>
                                                {restaurant.priceRange}
                                            </b>

                                            <button
                                                type="button"
                                                title="Edit restaurant"
                                                onClick={() =>
                                                    edit(restaurant)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                title="Delete restaurant"
                                                onClick={() =>
                                                    remove(
                                                        restaurant._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                )
                            )}
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}

export default Dashboard;