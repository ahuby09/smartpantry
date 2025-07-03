import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CollectionView.css";
import Navbar from "../NavBar/NavBar";
import Breadcrumb from "../breadcrumb/breadcrumb";
   import { Link } from "react-router-dom";

const baseLayout = ["", "", "", "wide", "tall", "", ""];  // positions for page 0
const RECIPES_PER_PAGE = 7;

const CollectionView = () => {
  const { area } = useParams();
  const navigate = useNavigate();

  const [collection, setCollection] = useState(null);
  const [recipes, setRecipes]     = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(0);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const fetchCollection = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`/api/collections/${area}?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      setCollection(data.collection);
      setRecipes(data.recipes);
      setTotal(data.total);
    } catch (err) {
      console.error("Error loading collection:", err);
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (area) fetchCollection();
  }, [area, page]);  // re-fetch on area or page change

  const totalPages = Math.ceil(total / RECIPES_PER_PAGE);

  // Choose layout for this page: reverse on odd pages
  const layout = page % 2 === 0
    ? baseLayout
    : [...baseLayout].reverse();

  if (loading) return <p>Loading…</p>;
  if (error)   return <p className="error">Error: {error}</p>;
  if (!collection) return null;

  return (
    <>
      <div
  className="collection-hero"
  style={{
    backgroundImage: `
      linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
      url(${collection.image_url})
    `
  }}
>
  <div className="hero-content">
    <h2 className="title">{collection.name}</h2>
    <p className="description">{collection.description}</p>
  </div>
</div>

      <Breadcrumb />

 

<div className="collection-view">
  <div className="recipe-grid">
    {recipes.map((r, i) => (
      <Link
        to={`/recipe/${r.id}`}
        key={r.id}
        className={`recipe-card ${layout[i] || ""}`}
        style={{ backgroundImage: `url(${r.image_url})` }}
      >
        <div className="recipe-card-content">
          <h3>{r.name}</h3>
          <p className="missing">2 ingredients missing</p>
        </div>
      </Link>
    ))}
  </div>

  {totalPages > 1 && (
    <div className="pagination-controls">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 0))}
        disabled={page === 0}
      >
        Previous
      </button>
      <span>Page {page + 1} of {totalPages}</span>
      <button
        onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
        disabled={page + 1 >= totalPages}
      >
        Next
      </button>
    </div>
  )}
</div>

 
    </>
  );
};

export default CollectionView;
