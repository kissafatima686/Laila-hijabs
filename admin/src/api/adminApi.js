const BACKEND_URL = 'http://localhost:5000/api/admin';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
});

export const fetchOrdersApi = async () => {
  const res = await fetch(`${BACKEND_URL}/orders`, { headers: getHeaders() });
  return res.json();
};

export const createProductApi = async (productData) => {
  const res = await fetch(`${BACKEND_URL}/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(productData)
  });
  return res.json();
};