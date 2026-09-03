const baseURL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const httpClient = async ({
  method,
  endpoint,
  payload,
  token,
}) => {
  const url = `${baseURL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (
    payload &&
    ['POST', 'PUT', 'PATCH'].includes(method)
  ) {
    options.body = JSON.stringify(payload);
  }

  try {
    const response = await fetch(url, options);

    let data;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    throw new Error(`API Error: ${error.message}`);
  }
};