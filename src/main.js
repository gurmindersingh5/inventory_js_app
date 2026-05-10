import { products } from './data/products.js';

function assetUrl(path) {
  if (!path) return '';
  return path;
}

// State
let query = '';
let category = 'All';
let availability = 'All';

// DOM elements
const root = document.getElementById('root');

// Render function
function render() {
  // Clear root
  root.innerHTML = '';

  // Compute derived state
  const categories = ['All', ...new Set(products.map(item => item.category).filter(Boolean))];
  const availabilityOptions = ['All', ...new Set(products.map(item => item.availability).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const term = query.trim().toLowerCase();
    const searchText = `${product.name} ${product.brand} ${product.category} ${product.grade} ${product.packSize} ${product.description}`.toLowerCase();
    return (
      (!term || searchText.includes(term)) &&
      (category === 'All' || product.category === category) &&
      (availability === 'All' || product.availability === availability)
    );
  });

  const stats = {
    total: products.length,
    inStock: products.filter(item => item.availability === 'In stock').length,
    categories: categories.length - 1,
  };

  // Create main
  const main = document.createElement('main');

  // Header
  const header = document.createElement('header');
  header.className = 'topbar';
  const brandBlock = document.createElement('div');
  brandBlock.className = 'brand-block';
  const brandMark = document.createElement('div');
  brandMark.className = 'brand-mark';
  brandMark.textContent = 'ML';
  const brandText = document.createElement('div');
  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Online product catalog';
  const h1 = document.createElement('h1');
  h1.textContent = 'Malwa Lubes Inventory';
  brandText.appendChild(eyebrow);
  brandText.appendChild(h1);
  brandBlock.appendChild(brandMark);
  brandBlock.appendChild(brandText);
  header.appendChild(brandBlock);
  main.appendChild(header);

  // Hero
  const hero = document.createElement('section');
  hero.className = 'hero';
  const heroCopy = document.createElement('div');
  heroCopy.className = 'hero-copy';
  const heroEyebrow = document.createElement('p');
  heroEyebrow.className = 'eyebrow';
  heroEyebrow.textContent = 'Engine oils, gear oils, hydraulic oils and lubricants';
  const h2 = document.createElement('h2');
  h2.textContent = 'Find the right lubricant fast.';
  const heroP = document.createElement('p');
  heroP.textContent = 'Search by product name, grade, pack size, brand, or use case. Every product listed here is stored with the deployed website, so customers see the same catalog online.';
  heroCopy.appendChild(heroEyebrow);
  heroCopy.appendChild(h2);
  heroCopy.appendChild(heroP);
  const heroVisual = document.createElement('div');
  heroVisual.className = 'hero-visual';
  heroVisual.setAttribute('aria-hidden', 'true');
  const canRed = document.createElement('div');
  canRed.className = 'oil-can can-red';
  canRed.innerHTML = '<span>15W-40</span>';
  const canYellow = document.createElement('div');
  canYellow.className = 'oil-can can-yellow';
  canYellow.innerHTML = '<span>5W-30</span>';
  const canBlue = document.createElement('div');
  canBlue.className = 'oil-can can-blue';
  canBlue.innerHTML = '<span>AW 68</span>';
  heroVisual.appendChild(canRed);
  heroVisual.appendChild(canYellow);
  heroVisual.appendChild(canBlue);
  hero.appendChild(heroCopy);
  hero.appendChild(heroVisual);
  main.appendChild(hero);

  // Controls
  const controls = document.createElement('section');
  controls.className = 'controls';
  controls.setAttribute('aria-label', 'Catalog controls');

  // Search box
  const searchLabel = document.createElement('label');
  searchLabel.className = 'search-box';
  const searchIcon = document.createElement('span');
  searchIcon.textContent = '🔍';
  const searchInput = document.createElement('input');
  searchInput.value = query;
  searchInput.placeholder = 'Search products, grade, brand, pack size...';
  searchInput.addEventListener('input', (e) => {
    query = e.target.value;
    render();
  });
  searchLabel.appendChild(searchIcon);
  searchLabel.appendChild(searchInput);

  // Category select
  const categoryLabel = document.createElement('label');
  categoryLabel.className = 'select-box';
  const filterIcon = document.createElement('span');
  filterIcon.textContent = '⚙️';
  const categorySelect = document.createElement('select');
  categorySelect.value = category;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
  categorySelect.addEventListener('change', (e) => {
    category = e.target.value;
    render();
  });
  const chevron1 = document.createElement('span');
  chevron1.textContent = '▼';
  categoryLabel.appendChild(filterIcon);
  categoryLabel.appendChild(categorySelect);
  categoryLabel.appendChild(chevron1);

  // Availability select
  const availLabel = document.createElement('label');
  availLabel.className = 'select-box';
  const checkIcon = document.createElement('span');
  checkIcon.textContent = '✅';
  const availSelect = document.createElement('select');
  availSelect.value = availability;
  availabilityOptions.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt;
    option.textContent = opt;
    availSelect.appendChild(option);
  });
  availSelect.addEventListener('change', (e) => {
    availability = e.target.value;
    render();
  });
  const chevron2 = document.createElement('span');
  chevron2.textContent = '▼';
  availLabel.appendChild(checkIcon);
  availLabel.appendChild(availSelect);
  availLabel.appendChild(chevron2);

  controls.appendChild(searchLabel);
  controls.appendChild(categoryLabel);
  controls.appendChild(availLabel);
  main.appendChild(controls);

  // Stats
  const statsSection = document.createElement('section');
  statsSection.className = 'stats';
  statsSection.setAttribute('aria-label', 'Inventory summary');
  const totalDiv = document.createElement('div');
  totalDiv.innerHTML = `<strong>${stats.total}</strong><span>Total products</span>`;
  const inStockDiv = document.createElement('div');
  inStockDiv.innerHTML = `<strong>${stats.inStock}</strong><span>In stock</span>`;
  const catDiv = document.createElement('div');
  catDiv.innerHTML = `<strong>${stats.categories}</strong><span>Categories</span>`;
  statsSection.appendChild(totalDiv);
  statsSection.appendChild(inStockDiv);
  statsSection.appendChild(catDiv);
  main.appendChild(statsSection);

  // Catalog
  const catalog = document.createElement('section');
  catalog.className = 'catalog';
  catalog.setAttribute('aria-live', 'polite');
  if (filteredProducts.length) {
    filteredProducts.forEach(product => {
      const card = createProductCard(product);
      catalog.appendChild(card);
    });
  } else {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <span>🔍</span>
      <h3>No products found</h3>
      <p>Try a different product name, grade, category, or availability filter.</p>
    `;
    catalog.appendChild(empty);
  }
  main.appendChild(catalog);

  root.appendChild(main);
}

function createProductCard(product) {
  const article = document.createElement('article');
  article.className = 'product-card';

  const imageDiv = document.createElement('div');
  imageDiv.className = 'product-image';
  if (product.image) {
    const img = document.createElement('img');
    img.src = assetUrl(product.image);
    img.alt = product.name;
    imageDiv.appendChild(img);
  } else {
    const placeholder = createPlaceholder(product.grade);
    imageDiv.appendChild(placeholder);
  }
  const badge = document.createElement('span');
  badge.className = `badge ${product.availability.toLowerCase().replace(/\s+/g, '-')}`;
  badge.textContent = product.availability;
  imageDiv.appendChild(badge);

  const body = document.createElement('div');
  body.className = 'product-body';
  const brand = document.createElement('p');
  brand.className = 'product-brand';
  brand.textContent = product.brand || 'Malwa Lubes';
  const h3 = document.createElement('h3');
  h3.textContent = product.name;
  const desc = document.createElement('p');
  desc.className = 'product-description';
  desc.textContent = product.description;
  const dl = document.createElement('dl');
  dl.className = 'product-meta';
  const divs = [
    { dt: 'Category', dd: product.category },
    { dt: 'Grade', dd: product.grade || 'N/A' },
    { dt: 'Pack', dd: product.packSize || 'Ask admin' },
    { dt: 'Price', dd: product.price },
  ];
  divs.forEach(item => {
    const div = document.createElement('div');
    const dt = document.createElement('dt');
    dt.textContent = item.dt;
    const dd = document.createElement('dd');
    dd.textContent = item.dd;
    div.appendChild(dt);
    div.appendChild(dd);
    dl.appendChild(div);
  });

  body.appendChild(brand);
  body.appendChild(h3);
  body.appendChild(desc);
  body.appendChild(dl);

  article.appendChild(imageDiv);
  article.appendChild(body);

  return article;
}

function createPlaceholder(grade) {
  const div = document.createElement('div');
  div.className = 'placeholder-art';
  div.innerHTML = `
    <div class="bottle-cap"></div>
    <div class="bottle-body"><span>${grade || 'OIL'}</span></div>
    <div class="oil-drop"></div>
  `;
  return div;
}

// Initial render
render();
