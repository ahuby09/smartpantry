import React, { useEffect, useState } from 'react';
import './Collection.css';
import { useNavigate } from 'react-router-dom';

const layoutClasses = ["", "", "tall-wide", "tall", " ", "", ""];

const Collections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/collections', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setCollections(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p className="error">Error: {error}</p>;

  return (
    <div className="collections-wrapper">
      <h2>Collections</h2>
      <div className="collections-grid">
        {collections.map((item, index) => (
          <div
            key={item.id}
            className={`collection-card ${layoutClasses[index]}`}
            style={{ backgroundImage: `url(${item.image_url})` }}
            onClick={() => navigate(`/collections/${item.slug}`)}
          >
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
