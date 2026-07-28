export const formatCurrency = (amount) => {
  return `Rs. ${Number(amount || 0).toLocaleString()}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
