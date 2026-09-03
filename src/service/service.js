import { httpClient } from '../client/client';

export const loginUser = async (form) => {
  const response = await httpClient({
    method: 'POST',
    endpoint: '/auth/login',
    payload: form,
  });

  if (response.status >= 400) {
    throw new Error(
      response.data?.message || 'Login failed'
    );
  }

  return response.data;
};

export const registerUser = async (form) => {
  const response = await httpClient({
    method: 'POST',
    endpoint: '/auth/register',
    payload: form,
  });

  if (response.status >= 400) {
    throw new Error(
      response.data?.message || 'Registration failed'
    );
  }

  return response.data;
};

export const fetchRestaurants = async (token) => {
  const response = await httpClient({
    method: 'GET',
    endpoint: '/restaurants',
    token,
  });

  if (response.status >= 400) {
    throw new Error(
      response.data?.message || 'Failed to fetch restaurants'
    );
  }

  return response.data;
};

export const createRestaurant = async (form, token) => {
  const response = await httpClient({
    method: 'POST',
    endpoint: '/restaurants',
    payload: form,
    token,
  });

  if (response.status >= 400) {
    throw new Error(
      response.data?.message || 'Failed to create restaurant'
    );
  }

  return response.data;
};

export const updateRestaurant = async (id, form, token) => {
  const response = await httpClient({
    method: 'PUT',
    endpoint: `/restaurants/${id}`,
    payload: form,
    token,
  });

  if (response.status >= 400) {
    throw new Error(
      response.data?.message || 'Failed to update restaurant'
    );
  }

  return response.data;
};

export const deleteRestaurant = async (id, token) => {
  const response = await httpClient({
    method: 'DELETE',
    endpoint: `/restaurants/${id}`,
    token,
  });

  if (response.status >= 400) {
    throw new Error(
      response.data?.message || 'Failed to delete restaurant'
    );
  }

  return response.data;
};