import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  CheckCircle2,
  ChevronDown,
  Download,
  Edit3,
  Filter,
  ImagePlus,
  LogOut,
  PackagePlus,
  Search,
  Settings,
  Shield,
  Trash2,
  Upload,
  UserCircle,
  X,
} from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'malwa-lubes-products-v1';
const PASSWORD_KEY = 'malwa-lubes-admin-password-v1';
const DEFAULT_PASSWORD = 'malwa123';

const seedProducts = [
  {
    id: 'seed-1',
    name: 'Premium 15W-40 Diesel Engine Oil',
    brand: 'Malwa Lubes',
    category: 'Engine Oil',
    grade: '15W-40',
    packSize: '5 L / 20 L',
    price: 'Contact for price',
    availability: 'In stock',
    description: 'Heavy-duty multigrade oil for diesel engines, fleet vehicles, tractors, and commercial use.',
    image: '',
  },
  {
    id: 'seed-2',
    name: 'Synthetic 5W-30 Passenger Car Oil',
    brand: 'Malwa Lubes',
    category: 'Engine Oil',
    grade: '5W-30',
    packSize: '1 L / 4 L',
    price: 'Contact for price',
    availability: 'In stock',
    description: 'Low-friction synthetic blend for modern petrol and diesel passenger vehicles.',
    image: '',
  },
  {
    id: 'seed-3',
    name: 'Hydraulic Oil AW 68',
    brand: 'Industrial Series',
    category: 'Hydraulic Oil',
    grade: 'AW 68',
    packSize: '20 L / 210 L',
    price: 'Contact for price',
    availability: 'Limited',
    description: 'Anti-wear hydraulic fluid for lifts, presses, industrial machines, and farm equipment.',
    image: '',
  },
  {
    id: 'seed-4',
    name: 'Gear Oil EP 90',
    brand: 'Drive Guard',
    category: 'Gear Oil',
    grade: 'EP 90',
    packSize: '1 L / 5 L / 20 L',
    price: 'Contact for price',
    availability: 'In stock',
    description: 'Extreme-pressure gear lubricant for gearboxes, differentials, and manual transmissions.',
    image: '',
  },
];

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedProducts;
  } catch {
    return seedProducts;
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function getAdminPassword() {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
}

const emptyProduct = {
  id: '',
  name: '',
  brand: '',
  category: 'Engine Oil',
  grade: '',
  packSize: '',
  price: 'Contact for price',
  availability: 'In stock',
  description: '',
  image: '',
};

function App() {
  const [products, setProducts] = useState(loadProducts);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [availability, setAvailability] = useState('All');
  const [isAdminOpen, setAdminOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [editing, setEditing] = useState(null);
  const [formProduct, setFormProduct] = useState(emptyProduct);
  const [newPassword, setNewPassword] = useState('');
  const importInputRef = useRef(null);

  const categories = useMemo(() => ['All', ...new Set(products.map((item) => item.category).filter(Boolean))], [products]);
  const availabilityOptions = useMemo(() => ['All', ...new Set(products.map((item) => item.availability).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      const searchText = `${product.name} ${product.brand} ${product.category} ${product.grade} ${product.packSize} ${product.description}`.toLowerCase();
      const matchesSearch = !term || searchText.includes(term);
      const matchesCategory = category === 'All' || product.category === category;
      const matchesAvailability = availability === 'All' || product.availability === availability;
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, query, category, availability]);

  const stats = useMemo(() => ({
    total: products.length,
    inStock: products.filter((item) => item.availability === 'In stock').length,
    categories: categories.length - 1,
  }), [products, categories]);

  function persist(nextProducts) {
    setProducts(nextProducts);
    saveProducts(nextProducts);
  }

  function handleLogin(event) {
    event.preventDefault();
    if (loginPassword === getAdminPassword()) {
      setLoggedIn(true);
      setLoginPassword('');
      setLoginError('');
      return;
    }
    setLoginError('Incorrect password');
  }

  function openNewProduct() {
    setEditing('new');
    setFormProduct({ ...emptyProduct, id: crypto.randomUUID() });
  }

  function openEditProduct(product) {
    setEditing(product.id);
    setFormProduct(product);
  }

  function closeEditor() {
    setEditing(null);
    setFormProduct(emptyProduct);
  }

  function updateField(field, value) {
    setFormProduct((current) => ({ ...current, [field]: value }));
  }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField('image', reader.result);
    reader.readAsDataURL(file);
  }

  function submitProduct(event) {
    event.preventDefault();
    const cleanProduct = {
      ...formProduct,
      name: formProduct.name.trim(),
      brand: formProduct.brand.trim(),
      category: formProduct.category.trim() || 'Other',
      grade: formProduct.grade.trim(),
      packSize: formProduct.packSize.trim(),
      price: formProduct.price.trim() || 'Contact for price',
      availability: formProduct.availability.trim() || 'In stock',
      description: formProduct.description.trim(),
    };

    const exists = products.some((item) => item.id === cleanProduct.id);
    const nextProducts = exists
      ? products.map((item) => (item.id === cleanProduct.id ? cleanProduct : item))
      : [cleanProduct, ...products];

    persist(nextProducts);
    closeEditor();
  }

  function deleteProduct(productId) {
    persist(products.filter((item) => item.id !== productId));
    if (editing === productId) closeEditor();
  }

  function exportCatalog() {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'malwa-lubes-catalog.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  function importCatalog(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) throw new Error('Catalog must be an array');
        persist(parsed.map((item) => ({ ...emptyProduct, ...item, id: item.id || crypto.randomUUID() })));
      } catch {
        alert('Could not import this catalog file.');
      }
    };
    reader.readAsText(file);
  }

  function changePassword(event) {
    event.preventDefault();
    if (newPassword.trim().length < 4) return;
    localStorage.setItem(PASSWORD_KEY, newPassword.trim());
    setNewPassword('');
  }

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
        <button className="avatar-button" type="button" onClick={() => setAdminOpen(true)} aria-label="Open admin panel">
          <UserCircle size={28} />
        </button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Engine oils, gear oils, hydraulic oils and lubricants</p>
          <h2>Find the right lubricant fast.</h2>
          <p>Search by product name, grade, pack size, brand, or use case. Share this page with customers as a simple live catalog.</p>
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
          <ProductCard
            key={product.id}
            product={product}
            isLoggedIn={isLoggedIn}
            onEdit={() => openEditProduct(product)}
            onDelete={() => deleteProduct(product.id)}
          />
        )) : (
          <div className="empty-state">
            <Search size={34} />
            <h3>No products found</h3>
            <p>Try a different product name, grade, category, or availability filter.</p>
          </div>
        )}
      </section>

      {isAdminOpen && (
        <aside className="admin-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setAdminOpen(false)}>
          <section className="admin-panel" aria-label="Admin panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Admin tools</p>
                <h2>Catalog manager</h2>
              </div>
              <button className="icon-button" type="button" onClick={() => setAdminOpen(false)} aria-label="Close admin panel">
                <X size={20} />
              </button>
            </div>

            {!isLoggedIn ? (
              <form className="login-card" onSubmit={handleLogin}>
                <Shield size={30} />
                <h3>Enter admin password</h3>
                <p>Default password is <strong>malwa123</strong>. Change it after logging in.</p>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="Admin password"
                />
                {loginError && <span className="form-error">{loginError}</span>}
                <button className="primary-button" type="submit">Unlock</button>
              </form>
            ) : (
              <div className="admin-content">
                <div className="admin-actions">
                  <button className="primary-button" type="button" onClick={openNewProduct}>
                    <PackagePlus size={18} /> Add product
                  </button>
                  <button className="secondary-button" type="button" onClick={exportCatalog}>
                    <Download size={18} /> Export
                  </button>
                  <button className="secondary-button" type="button" onClick={() => importInputRef.current?.click()}>
                    <Upload size={18} /> Import
                  </button>
                  <button className="ghost-button" type="button" onClick={() => setLoggedIn(false)}>
                    <LogOut size={18} /> Lock
                  </button>
                  <input
                    ref={importInputRef}
                    className="hidden-input"
                    type="file"
                    accept="application/json"
                    onChange={(event) => importCatalog(event.target.files?.[0])}
                  />
                </div>

                <p className="static-note">
                  GitHub Pages is static: uploads save in this browser. Use Export/Import to move a catalog between browsers or keep a backup.
                </p>

                {editing && (
                  <ProductForm
                    product={formProduct}
                    onChange={updateField}
                    onImageUpload={handleImageUpload}
                    onSubmit={submitProduct}
                    onCancel={closeEditor}
                  />
                )}

                <form className="password-form" onSubmit={changePassword}>
                  <Settings size={18} />
                  <input
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="New admin password"
                  />
                  <button className="secondary-button" type="submit">Update password</button>
                </form>
              </div>
            )}
          </section>
        </aside>
      )}
    </main>
  );
}

function ProductCard({ product, isLoggedIn, onEdit, onDelete }) {
  return (
    <article className="product-card">
      <div className="product-image">
        {product.image ? <img src={product.image} alt={product.name} /> : <ProductPlaceholder grade={product.grade} />}
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
        {isLoggedIn && (
          <div className="card-actions">
            <button className="secondary-button" type="button" onClick={onEdit}><Edit3 size={16} /> Edit</button>
            <button className="danger-button" type="button" onClick={onDelete}><Trash2 size={16} /> Delete</button>
          </div>
        )}
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

function ProductForm({ product, onChange, onImageUpload, onSubmit, onCancel }) {
  return (
    <form className="product-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label>Product name<input required value={product.name} onChange={(event) => onChange('name', event.target.value)} /></label>
        <label>Brand<input value={product.brand} onChange={(event) => onChange('brand', event.target.value)} /></label>
        <label>Category<input value={product.category} onChange={(event) => onChange('category', event.target.value)} /></label>
        <label>Grade<input value={product.grade} onChange={(event) => onChange('grade', event.target.value)} /></label>
        <label>Pack size<input value={product.packSize} onChange={(event) => onChange('packSize', event.target.value)} /></label>
        <label>Price<input value={product.price} onChange={(event) => onChange('price', event.target.value)} /></label>
        <label>Availability
          <select value={product.availability} onChange={(event) => onChange('availability', event.target.value)}>
            <option>In stock</option>
            <option>Limited</option>
            <option>Out of stock</option>
            <option>Coming soon</option>
          </select>
        </label>
        <label className="image-picker">
          <ImagePlus size={18} /> Upload product photo
          <input type="file" accept="image/*" onChange={(event) => onImageUpload(event.target.files?.[0])} />
        </label>
        <label className="full-width">Description<textarea value={product.description} onChange={(event) => onChange('description', event.target.value)} /></label>
      </div>
      {product.image && <img className="form-preview" src={product.image} alt="Product preview" />}
      <div className="form-actions">
        <button className="primary-button" type="submit">Save product</button>
        <button className="ghost-button" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

createRoot(document.getElementById('root')).render(<App />);
