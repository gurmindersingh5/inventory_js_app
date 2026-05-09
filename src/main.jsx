import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle2, ChevronDown, Filter, Search } from 'lucide-react';
import { products } from './data/products';
import './styles.css';

function assetUrl(path) {
  if (!path) return '';
  return `${import.meta.env.BASE_URL}${path}`;
}

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [availability, setAvailability] = useState('All');

  const categories = useMemo(() => ['All', ...new Set(products.map((item) => item.category).filter(Boolean))], []);
  const availabilityOptions = useMemo(() => ['All', ...new Set(products.map((item) => item.availability).filter(Boolean))], []);

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      const searchText = `${product.name} ${product.brand} ${product.category} ${product.grade} ${product.packSize} ${product.description}`.toLowerCase();
      return (
        (!term || searchText.includes(term)) &&
        (category === 'All' || product.category === category) &&
        (availability === 'All' || product.availability === availability)
      );
    });
  }, [query, category, availability]);

  const stats = useMemo(() => ({
    total: products.length,
    inStock: products.filter((item) => item.availability === 'In stock').length,
    categories: categories.length - 1,
  }), [categories]);

  return (
    <main>
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">ML</div>
          <div>
            <p className="eyebrow">Online product catalog</p>
            <h1>Malwa Lubes Inventory</h1>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Engine oils, gear oils, hydraulic oils and lubricants</p>
          <h2>Find the right lubricant fast.</h2>
          <p>Search by product name, grade, pack size, brand, or use case. Every product listed here is stored with the deployed website, so customers see the same catalog online.</p>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="oil-can can-red"><span>15W-40</span></div>
          <div className="oil-can can-yellow"><span>5W-30</span></div>
          <div className="oil-can can-blue"><span>AW 68</span></div>
        </div>
      </section>

      <section className="controls" aria-label="Catalog controls">
        <label className="search-box">
          <Search size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, grade, brand, pack size..."
          />
        </label>
        <label className="select-box">
          <Filter size={18} />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <ChevronDown size={16} />
        </label>
        <label className="select-box">
          <CheckCircle2 size={18} />
          <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
            {availabilityOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
          <ChevronDown size={16} />
        </label>
      </section>

      <section className="stats" aria-label="Inventory summary">
        <div><strong>{stats.total}</strong><span>Total products</span></div>
        <div><strong>{stats.inStock}</strong><span>In stock</span></div>
        <div><strong>{stats.categories}</strong><span>Categories</span></div>
      </section>

      <section className="catalog" aria-live="polite">
        {filteredProducts.length ? filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        )) : (
          <div className="empty-state">
            <Search size={34} />
            <h3>No products found</h3>
            <p>Try a different product name, grade, category, or availability filter.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image">
        {product.image ? <img src={assetUrl(product.image)} alt={product.name} /> : <ProductPlaceholder grade={product.grade} />}
        <span className={`badge ${product.availability.toLowerCase().replace(/\s+/g, '-')}`}>{product.availability}</span>
      </div>
      <div className="product-body">
        <p className="product-brand">{product.brand || 'Malwa Lubes'}</p>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <dl className="product-meta">
          <div><dt>Category</dt><dd>{product.category}</dd></div>
          <div><dt>Grade</dt><dd>{product.grade || 'N/A'}</dd></div>
          <div><dt>Pack</dt><dd>{product.packSize || 'Ask admin'}</dd></div>
          <div><dt>Price</dt><dd>{product.price}</dd></div>
        </dl>
      </div>
    </article>
  );
}

function ProductPlaceholder({ grade }) {
  return (
    <div className="placeholder-art">
      <div className="bottle-cap" />
      <div className="bottle-body">
        <span>{grade || 'OIL'}</span>
      </div>
      <div className="oil-drop" />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
