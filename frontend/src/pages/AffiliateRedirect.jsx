import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AffiliateRedirect = () => {
  const { code } = useParams();

  useEffect(() => {
    // We redirect the browser to the backend URL so the backend can log the click,
    // set the tracking cookie, and then issue a 302 redirect back to the home page.
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/api/affiliate/ref/${code}`;
  }, [code]);

  return (
    <div style={{ padding: '150px 20px', textAlign: 'center', backgroundColor: '#1A2010', color: '#E7D9C9', minHeight: '100vh' }}>
      <h2 style={{ color: '#B8935B' }}>Applying Referral Code...</h2>
      <p>Redirecting you to the store...</p>
    </div>
  );
};

export default AffiliateRedirect;
