/**
 * AQUARIA – Core Application Logic
 * Bags & Handmade Footwear Atelier
 * Supports both dynamic backend API (/api/data) and static fallback
 */

// Application State
const AppState = {
  cart: [],
  wishlist: [],
  activeDepartment: 'all', // 'all' | 'bags' | 'footwear'
  activeCategory: 'all',
  activeSort: 'featured',
  searchQuery: '',
  appliedPromo: null,
  activeQuickViewProduct: null,
  quickViewSelectedColor: null,
  quickViewSelectedSize: null,
  quickViewQuantity: 1
};

const STORAGE_KEYS = {
  CART: 'aquaria_fashion_cart_v2',
  WISHLIST: 'aquaria_fashion_wishlist_v2'
};

function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

// Toast System
function showToast(message, iconSvg = null) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toast-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

  toast.innerHTML = `
    ${iconSvg || defaultIcon}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Initialize on Load — Fetch dynamic data from backend API
document.addEventListener('DOMContentLoaded', async () => {
  loadSavedState();
  await loadDynamicSiteData();
  renderHeroContent();
  renderDepartmentBanners();
  renderNewArrivals();
  renderProducts();
  renderStoryContent();
  renderWhyAquaria();
  renderReviews();
  renderStyleDiary();
  renderContactDetails();
  renderPolicies();
  setupEventListeners();
  updateCartUI();
  updateWishlistUI();
});

// Load live dynamic data from Node backend
async function loadDynamicSiteData() {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const liveData = await res.json();
      if (liveData && liveData.products) {
        // Merge live backend data into AQUARIA_DATA
        Object.assign(AQUARIA_DATA, liveData);
      }
    }
  } catch (err) {
    // Graceful fallback to static products.js data when running without server
    console.log('Running in static fallback mode.');
  }
}

function loadSavedState() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) AppState.cart = JSON.parse(savedCart);

    const savedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (savedWishlist) AppState.wishlist = JSON.parse(savedWishlist);
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
}

function saveCartState() {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(AppState.cart));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
  updateCartUI();
}

function saveWishlistState() {
  try {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(AppState.wishlist));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
  updateWishlistUI();
}

// Render Hero Content dynamically
function renderHeroContent() {
  if (!AQUARIA_DATA.hero) return;
  const h = AQUARIA_DATA.hero;

  const tag = document.querySelector('.hero-tag');
  const title = document.querySelector('.hero-title');
  const desc = document.querySelector('.hero-description');
  const img = document.querySelector('.hero-bg img');
  const btn1 = document.querySelector('.hero-buttons a:first-child');
  const btn2 = document.querySelector('.hero-buttons a:last-child');
  const announce = document.querySelector('.announcement-bar span');

  if (tag && h.tag) tag.textContent = h.tag;
  if (title && h.title) title.innerHTML = h.title.replace(/\n/g, '<br>');
  if (desc && h.description) desc.textContent = h.description;
  if (img && h.image) img.src = h.image;
  if (btn1 && h.btnBagsText) btn1.textContent = h.btnBagsText;
  if (btn2 && h.btnFootwearText) btn2.textContent = h.btnFootwearText;
  if (announce && AQUARIA_DATA.brand && AQUARIA_DATA.brand.announcement) {
    announce.textContent = AQUARIA_DATA.brand.announcement;
  }
}

// Render Story Content dynamically
function renderStoryContent() {
  if (!AQUARIA_DATA.story) return;
  const s = AQUARIA_DATA.story;

  const tag = document.querySelector('.story-tag');
  const heading = document.querySelector('.story-heading');
  const p1 = document.querySelector('.story-text:first-of-type');
  const p2 = document.querySelector('.story-text:nth-of-type(2)');
  const img1 = document.querySelector('.story-collage-img1 img');
  const img2 = document.querySelector('.story-collage-img2 img');

  if (tag && s.tag) tag.textContent = s.tag;
  if (heading && s.heading) heading.textContent = s.heading;
  if (p1 && s.paragraph1) p1.textContent = s.paragraph1;
  if (p2 && s.paragraph2) p2.textContent = s.paragraph2;
  if (img1 && s.image1) img1.src = s.image1;
  if (img2 && s.image2) img2.src = s.image2;
}

// Render Contact Details dynamically
function renderContactDetails() {
  const c = AQUARIA_DATA.contactDetails;
  if (!c) return;

  const phoneDisplay = document.getElementById('contactPhoneDisplay');
  const phoneLink = document.getElementById('contactPhoneLink');
  const waLink = document.getElementById('contactWhatsappLink');
  const waDisplay = document.getElementById('contactWhatsappDisplay');
  const emailDisplay = document.getElementById('contactEmailDisplay');
  const emailLink = document.getElementById('contactEmailLink');
  const addressDisplay = document.getElementById('contactAddressDisplay');
  const hoursDisplay = document.getElementById('contactHoursDisplay');
  const noteDisplay = document.getElementById('contactNoteDisplay');

  if (phoneDisplay && c.phone) phoneDisplay.textContent = c.phone;
  if (phoneLink && c.phone) phoneLink.href = `tel:${c.phone.replace(/\s+/g, '')}`;
  if (waLink && c.whatsapp) waLink.href = `https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}`;
  if (waDisplay && c.whatsapp) waDisplay.textContent = `Chat on WhatsApp (${c.whatsapp})`;
  if (emailDisplay && c.email) emailDisplay.textContent = c.email;
  if (emailLink && c.email) emailLink.href = `mailto:${c.email}`;
  if (addressDisplay && c.address) addressDisplay.textContent = c.address;
  if (hoursDisplay && c.hours) hoursDisplay.textContent = c.hours;
  if (noteDisplay && c.supportNote) noteDisplay.textContent = c.supportNote;
}

// Render Two Main Shopping Departments
function renderDepartmentBanners() {
  const bagsContainer = document.getElementById('deptBagsContainer');
  const shoesContainer = document.getElementById('deptShoesContainer');

  const bagsData = AQUARIA_DATA.departments.bags;
  const shoesData = AQUARIA_DATA.departments.footwear;

  if (bagsContainer && bagsData) {
    bagsContainer.innerHTML = `
      <div class="department-banner-card">
        <div class="dept-media">
          <img src="${bagsData.image}" alt="${bagsData.title}" loading="lazy">
          <span class="dept-badge badge-bag">Department One · Handbags</span>
        </div>
        <div class="dept-details">
          <span class="dept-sub">${bagsData.subtitle || 'AQUARIA Handbags'}</span>
          <h3 class="dept-title">${bagsData.title}</h3>
          <p class="dept-desc">${bagsData.description}</p>
          <div class="dept-subcategories-grid">
            ${(bagsData.categories || []).map(c => `
              <div class="subcat-pill" onclick="filterByDeptAndCategory('bags', '${c.id}')">
                <span class="subcat-name">${c.name}</span>
              </div>
            `).join('')}
          </div>
          <div>
            <button class="btn btn-primary" onclick="filterByDepartment('bags')">
              Explore All Bags
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (shoesContainer && shoesData) {
    shoesContainer.innerHTML = `
      <div class="department-banner-card reverse footwear-atelier-card">
        <div class="dept-media">
          <img src="${shoesData.image}" alt="${shoesData.title}" loading="lazy">
          <span class="dept-badge badge-footwear">Department Two · Handmade Footwear</span>
        </div>
        <div class="dept-details">
          <span class="dept-sub">${shoesData.subtitle || 'Handmade Footwear Atelier'}</span>
          <h3 class="dept-title">${shoesData.title}</h3>
          <p class="dept-desc">${shoesData.description}</p>
          <div class="dept-subcategories-grid">
            ${(shoesData.categories || []).map(c => `
              <div class="subcat-pill" onclick="filterByDeptAndCategory('footwear', '${c.id}')">
                <span class="subcat-name">${c.name}</span>
              </div>
            `).join('')}
          </div>
          <div>
            <button class="btn btn-secondary" style="border-color: var(--color-espresso); color: var(--color-espresso);" onclick="filterByDepartment('footwear')">
              Discover Handmade Footwear
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

// Render New Arrivals: "Fresh Finds at AQUARIA"
function renderNewArrivals() {
  const container = document.getElementById('newArrivalsGrid');
  if (!container) return;

  const newPieces = (AQUARIA_DATA.products || []).filter(p => p.isNew || p.badge === 'New Arrival').slice(0, 4);
  const displayPieces = newPieces.length > 0 ? newPieces : (AQUARIA_DATA.products || []).slice(0, 4);

  container.innerHTML = displayPieces.map(product => renderProductCardHTML(product, true)).join('');
}

// Render Bestsellers / Main Edit Grid
function renderProducts() {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  let filtered = [...(AQUARIA_DATA.products || [])];

  // Department filter
  if (AppState.activeDepartment !== 'all') {
    filtered = filtered.filter(p => p.department === AppState.activeDepartment);
  }

  // Category filter
  if (AppState.activeCategory !== 'all') {
    filtered = filtered.filter(p => p.category === AppState.activeCategory);
  }

  // Sorting
  if (AppState.activeSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (AppState.activeSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (AppState.activeSort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <p style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-espresso);">No items found in this selection.</p>
        <button class="btn btn-secondary" style="margin-top: 16px;" onclick="resetFilters()">View All Collections</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => renderProductCardHTML(product)).join('');
}

function renderProductCardHTML(product) {
  const isWishlisted = AppState.wishlist.includes(product.id);
  const primaryColor = (product.colors && product.colors[0]?.name) || 'Signature';
  const isFootwear = product.department === 'footwear';

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image-container" onclick="openQuickView('${product.id}')">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        
        <span class="product-dept-badge ${isFootwear ? 'badge-footwear' : 'badge-bag'}">
          ${isFootwear ? 'Footwear' : 'Bag'}
        </span>

        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" 
                onclick="event.stopPropagation(); toggleWishlist('${product.id}')" 
                title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <div class="product-actions-bar">
          <button class="quickview-btn" onclick="event.stopPropagation(); openQuickView('${product.id}')">
            Quick View
          </button>
          <button class="card-add-btn" onclick="event.stopPropagation(); ${isFootwear ? `openQuickView('${product.id}')` : `addToCart('${product.id}', '${primaryColor}', null, 1)`}">
            ${isFootwear ? 'Select Size' : 'Add to Bag'}
          </button>
        </div>
      </div>

      <div class="product-info">
        <div class="product-category-row">
          <span class="product-category-label">${product.categoryName || product.category}</span>
          <span class="product-department-tag">${isFootwear ? 'Handcrafted' : 'AQUARIA Bag'}</span>
        </div>

        <h3 class="product-title" onclick="openQuickView('${product.id}')">${product.name}</h3>

        <div class="product-price-row">
          <span class="product-price">${formatINR(product.price)}</span>
          ${product.originalPrice ? `<span class="product-original-price">${formatINR(product.originalPrice)}</span>` : ''}
        </div>

        ${isFootwear && product.sizes ? `
          <div class="footwear-sizes-row" title="Available Footwear Sizes">
            <span style="font-size: 0.7rem; color: var(--color-espresso-light); margin-right: 2px;">Sizes:</span>
            ${product.sizes.map(s => `<span class="size-pill-tag">${s}</span>`).join('')}
          </div>
        ` : ''}

        <div class="color-swatches" title="Available Colours">
          ${(product.colors || [{ name: 'Royal Burgundy', hex: '#642D40' }]).map((c, idx) => `
            <span class="swatch-dot ${idx === 0 ? 'active' : ''}" 
                  style="background-color: ${c.hex};" 
                  title="${c.name}"
                  onclick="switchCardColor('${product.id}', '${c.name}', this)">
            </span>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

window.switchCardColor = function(productId, colorName, element) {
  const card = element.closest('.product-card');
  if (!card) return;
  card.querySelectorAll('.swatch-dot').forEach(el => el.classList.remove('active'));
  element.classList.add('active');
};

window.filterByDepartment = function(department) {
  AppState.activeDepartment = department;
  AppState.activeCategory = 'all';

  document.querySelectorAll('.dept-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-dept') === department);
  });

  renderProducts();

  const target = document.getElementById('bestsellers');
  if (target) {
    const headerOffset = 90;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
};

window.filterByDeptAndCategory = function(department, category) {
  AppState.activeDepartment = department;
  AppState.activeCategory = category;

  document.querySelectorAll('.dept-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-dept') === department);
  });

  renderProducts();

  const target = document.getElementById('bestsellers');
  if (target) {
    const headerOffset = 90;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
};

window.resetFilters = function() {
  AppState.activeDepartment = 'all';
  AppState.activeCategory = 'all';
  document.querySelectorAll('.dept-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-dept') === 'all');
  });
  renderProducts();
};

function handleSortChange(e) {
  AppState.activeSort = e.target.value;
  renderProducts();
}

// Render Why AQUARIA (4 Highlights)
function renderWhyAquaria() {
  const container = document.getElementById('whyAquariaGrid');
  if (!container || !AQUARIA_DATA.whyAquaria) return;

  const iconMap = {
    diamond: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"></path></svg>`,
    hammer: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2l6 6L6 22H2v-4z"></path></svg>`,
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"></path></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
  };

  container.innerHTML = AQUARIA_DATA.whyAquaria.map(item => `
    <div class="why-card">
      <div class="why-icon">${iconMap[item.icon] || iconMap.sparkles}</div>
      <h4>${item.title}</h4>
      <p>${item.description}</p>
    </div>
  `).join('');
}

// Render Reviews
function renderReviews() {
  const container = document.getElementById('reviewsGrid');
  if (!container || !AQUARIA_DATA.sampleReviews) return;

  container.innerHTML = AQUARIA_DATA.sampleReviews.map(r => `
    <div class="review-card">
      <div class="review-stars">
        ${Array(r.rating || 5).fill(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        `).join('')}
      </div>
      <h4 class="review-title">“${r.title}”</h4>
      <p class="review-content">${r.content}</p>
      <div class="review-author-row">
        <div class="author-info">
          <h5>${r.author}</h5>
          <span>${r.city}</span>
        </div>
        <span class="review-product-tag">${r.productName}</span>
      </div>
    </div>
  `).join('');
}

// Render Style Diary
function renderStyleDiary() {
  const container = document.getElementById('styleDiaryGrid');
  if (!container || !AQUARIA_DATA.styleDiary) return;

  container.innerHTML = AQUARIA_DATA.styleDiary.map(item => `
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="instagram-item">
      <img src="${item.image}" alt="${item.caption}" loading="lazy">
      <div class="instagram-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
        <span>${item.tag}</span>
      </div>
    </a>
  `).join('');
}

// ==========================================================================
// Cart Operations
// ==========================================================================

window.addToCart = function(productId, colorName, sizeName = null, quantity = 1) {
  const product = (AQUARIA_DATA.products || []).find(p => p.id === productId);
  if (!product) return;

  const chosenColor = colorName || (product.colors && product.colors[0]?.name) || 'Signature';
  const isFootwear = product.department === 'footwear';

  if (isFootwear && !sizeName) {
    sizeName = product.sizes ? product.sizes[0] : '38';
  }

  const existingIndex = AppState.cart.findIndex(
    item => item.productId === productId && item.color === chosenColor && item.size === sizeName
  );

  if (existingIndex > -1) {
    AppState.cart[existingIndex].quantity += quantity;
  } else {
    AppState.cart.push({
      productId: product.id,
      name: product.name,
      department: product.department,
      price: product.price,
      image: product.image,
      color: chosenColor,
      size: isFootwear ? sizeName : null,
      quantity: quantity
    });
  }

  saveCartState();
  showToast(`Added ${product.name} to your Shopping Bag.`);
  openCartDrawer();
};

window.updateCartQty = function(index, change) {
  if (!AppState.cart[index]) return;
  AppState.cart[index].quantity += change;

  if (AppState.cart[index].quantity <= 0) {
    AppState.cart.splice(index, 1);
  }

  saveCartState();
};

window.removeFromCart = function(index) {
  if (!AppState.cart[index]) return;
  const removedName = AppState.cart[index].name;
  AppState.cart.splice(index, 1);
  saveCartState();
  showToast(`Removed ${removedName} from your Bag.`);
};

function updateCartUI() {
  const totalCount = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.getElementById('cartBadge');
  if (cartBadge) {
    cartBadge.textContent = totalCount;
    cartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
  }

  const listContainer = document.getElementById('cartItemsList');
  const footerContainer = document.getElementById('cartFooter');
  const shippingInfo = document.getElementById('shippingBar');

  if (!listContainer || !footerContainer) return;

  if (AppState.cart.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; margin: auto; padding: 40px 20px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-gold); margin-bottom: 16px;">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <h4 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-espresso); margin-bottom: 8px;">Your Shopping Bag is Empty</h4>
        <p style="font-size: 0.88rem; color: var(--color-espresso-muted); margin-bottom: 24px;">Discover our collection of stylish bags and handmade fancy footwear.</p>
        <button class="btn btn-primary" onclick="closeCartDrawer(); filterByDepartment('all');">Explore Collections</button>
      </div>
    `;
    footerContainer.style.display = 'none';
    if (shippingInfo) shippingInfo.style.display = 'none';
    return;
  }

  footerContainer.style.display = 'block';
  if (shippingInfo) shippingInfo.style.display = 'block';

  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const threshold = (AQUARIA_DATA.brand && AQUARIA_DATA.brand.freeShippingThreshold) || 1999;
  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const diff = threshold - subtotal;

  if (shippingInfo) {
    shippingInfo.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>${diff > 0 ? `Add <strong>${formatINR(diff)}</strong> more for complimentary shipping` : `✓ Unlocked <strong>Complimentary Express Shipping</strong>`}</span>
        <span>${progressPercent}%</span>
      </div>
      <div class="shipping-progress-track">
        <div class="shipping-progress-fill" style="width: ${progressPercent}%;"></div>
      </div>
    `;
  }

  listContainer.innerHTML = AppState.cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <h5>${item.name}</h5>
        <div class="cart-item-meta">
          Colour: ${item.color} ${item.size ? `· Size: EU ${item.size}` : ''}
        </div>
        <div class="cart-item-price">${formatINR(item.price)}</div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
        <button class="cart-item-remove" onclick="removeFromCart(${idx})" title="Remove">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateCartQty(${idx}, -1)">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQty(${idx}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');

  const shippingFee = subtotal >= threshold ? 0 : 250;
  let discountAmount = 0;
  if (AppState.appliedPromo === 'AQUARIA10') {
    discountAmount = Math.round(subtotal * 0.10);
  }

  const finalTotal = subtotal + shippingFee - discountAmount;

  document.getElementById('cartSubtotalValue').textContent = formatINR(subtotal);
  document.getElementById('cartShippingValue').textContent = shippingFee === 0 ? 'Complimentary' : formatINR(shippingFee);
  document.getElementById('cartTotalValue').textContent = formatINR(finalTotal);

  const discountRow = document.getElementById('cartDiscountRow');
  if (discountRow) {
    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      document.getElementById('cartDiscountValue').textContent = `-${formatINR(discountAmount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }
}

window.applyPromoCode = function() {
  const input = document.getElementById('cartPromoInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === 'AQUARIA10') {
    AppState.appliedPromo = 'AQUARIA10';
    showToast('Promo voucher AQUARIA10 applied: 10% Luxury Discount');
    updateCartUI();
  } else if (code === '') {
    showToast('Please enter a voucher code.');
  } else {
    showToast('Invalid voucher code. Try AQUARIA10.');
  }
};

window.toggleWishlist = function(productId) {
  const index = AppState.wishlist.indexOf(productId);
  const product = (AQUARIA_DATA.products || []).find(p => p.id === productId);

  if (index > -1) {
    AppState.wishlist.splice(index, 1);
    showToast(`Removed from your Wishlist.`);
  } else {
    AppState.wishlist.push(productId);
    showToast(`Saved ${product ? product.name : 'item'} to your Wishlist.`);
  }

  saveWishlistState();
  renderProducts();
  renderNewArrivals();
};

function updateWishlistUI() {
  const badge = document.getElementById('wishlistBadge');
  if (badge) {
    const count = AppState.wishlist.length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Quick View Modal
window.openQuickView = function(productId) {
  const product = (AQUARIA_DATA.products || []).find(p => p.id === productId);
  if (!product) return;

  AppState.activeQuickViewProduct = product;
  AppState.quickViewSelectedColor = (product.colors && product.colors[0]?.name) || 'Signature';
  AppState.quickViewSelectedSize = product.sizes ? product.sizes[0] : null;
  AppState.quickViewQuantity = 1;

  const modal = document.getElementById('quickViewModal');
  const content = document.getElementById('quickViewContent');
  if (!modal || !content) return;

  const galleryList = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const isFootwear = product.department === 'footwear';

  content.innerHTML = `
    <div class="quickview-layout">
      <div class="quickview-gallery">
        <div class="quickview-main-image">
          <img id="qvMainImg" src="${galleryList[0]}" alt="${product.name}">
        </div>
        ${galleryList.length > 1 ? `
          <div class="quickview-thumbs">
            ${galleryList.map((img, i) => `
              <div class="thumb-item ${i === 0 ? 'active' : ''}" onclick="switchQuickViewImage('${img}', this)">
                <img src="${img}" alt="${product.name} thumbnail">
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="quickview-details">
        <span class="modal-category-tag">${isFootwear ? 'Handmade Footwear Atelier' : 'AQUARIA Handbag Collection'} · ${product.categoryName || product.category}</span>
        <h2 class="modal-product-title">${product.name}</h2>
        <div class="modal-product-price">${formatINR(product.price)}</div>
        <p style="font-size: 0.92rem; color: var(--color-espresso-muted); line-height: 1.7; margin-bottom: 20px;">
          ${product.description}
        </p>

        <!-- Colour Selection -->
        <div style="margin-bottom: 18px;">
          <h4 style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 600; color: var(--color-espresso); margin-bottom: 8px;">
            Select Shade: <span id="qvSelectedColorLabel" style="font-weight: 400; color: var(--color-burgundy);">${AppState.quickViewSelectedColor}</span>
          </h4>
          <div style="display: flex; gap: 8px;">
            ${(product.colors || [{ name: 'Royal Burgundy', hex: '#642D40' }]).map((c, i) => `
              <div class="modal-color-option ${i === 0 ? 'active' : ''}" onclick="selectQuickViewColor('${c.name}', this)" style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border: 1px solid var(--color-porcelain-dark); border-radius: 20px; font-size: 0.78rem; cursor: pointer;">
                <span style="width: 12px; height: 12px; border-radius: 50%; background-color: ${c.hex}; display: inline-block; border: 1px solid rgba(0,0,0,0.2);"></span>
                <span>${c.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Footwear Size Selection (If Footwear) -->
        ${isFootwear && product.sizes ? `
          <div class="size-selector-block">
            <div class="size-header-row">
              <h4 style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 600; color: var(--color-espresso);">
                Select Shoe Size: <span id="qvSelectedSizeLabel" style="color: var(--color-burgundy);">EU ${AppState.quickViewSelectedSize}</span>
              </h4>
              <span class="size-guide-link" onclick="openSizeGuideModal()">Size Guide</span>
            </div>
            <div class="size-options-grid">
              ${product.sizes.map((s, idx) => `
                <button class="size-btn ${idx === 0 ? 'active' : ''}" onclick="selectQuickViewSize('${s}', this)">
                  EU ${s}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Details & Specifications -->
        <div style="margin-bottom: 22px;">
          <h4 style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 600; color: var(--color-espresso); margin-bottom: 8px;">
            ${isFootwear ? 'Artisanal Specifications & Care' : 'Dimensions & Material Details'}
          </h4>
          <ul style="padding-left: 18px; font-size: 0.85rem; color: var(--color-espresso-muted); line-height: 1.8; list-style: disc;">
            ${isFootwear ? `
              <li><strong>Handmade Note:</strong> ${product.handmadeNote || 'Crafted with double memory foam cushioning.'}</li>
              <li><strong>Heel Profile:</strong> ${product.heelHeight || 'Standard'}</li>
              <li><strong>Material:</strong> ${product.material}</li>
              <li><strong>Care:</strong> ${product.careInstructions || 'Store carefully.'}</li>
            ` : `
              <li><strong>Dimensions:</strong> ${product.dimensions || 'Standard Luxury Proportions'}</li>
              <li><strong>Strap:</strong> ${product.strapDrop || 'Adjustable'}</li>
              <li><strong>Material:</strong> ${product.material}</li>
              <li><strong>Care:</strong> ${product.careInstructions || 'Wipe with soft cloth.'}</li>
            `}
          </ul>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 16px; align-items: center; margin-top: auto;">
          <div class="qty-control" style="height: 44px;">
            <button class="qty-btn" style="width: 36px; height: 100%;" onclick="changeQVQty(-1)">−</button>
            <span id="qvQtyDisplay" class="qty-value" style="width: 40px; font-size: 0.95rem;">1</span>
            <button class="qty-btn" style="width: 36px; height: 100%;" onclick="changeQVQty(1)">+</button>
          </div>
          <button class="btn btn-primary" style="flex: 1; height: 44px;" onclick="addQuickViewToBag()">
            Add to Bag
          </button>
        </div>

      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.switchQuickViewImage = function(src, el) {
  const mainImg = document.getElementById('qvMainImg');
  if (mainImg) mainImg.src = src;
  document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
};

window.selectQuickViewColor = function(colorName, el) {
  AppState.quickViewSelectedColor = colorName;
  const label = document.getElementById('qvSelectedColorLabel');
  if (label) label.textContent = colorName;
  document.querySelectorAll('.modal-color-option').forEach(o => o.classList.remove('active'));
  if (el) el.classList.add('active');
};

window.selectQuickViewSize = function(sizeVal, el) {
  AppState.quickViewSelectedSize = sizeVal;
  const label = document.getElementById('qvSelectedSizeLabel');
  if (label) label.textContent = `EU ${sizeVal}`;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
};

window.changeQVQty = function(delta) {
  AppState.quickViewQuantity = Math.max(1, AppState.quickViewQuantity + delta);
  const display = document.getElementById('qvQtyDisplay');
  if (display) display.textContent = AppState.quickViewQuantity;
};

window.addQuickViewToBag = function() {
  if (!AppState.activeQuickViewProduct) return;
  addToCart(
    AppState.activeQuickViewProduct.id,
    AppState.quickViewSelectedColor,
    AppState.quickViewSelectedSize,
    AppState.quickViewQuantity
  );
  closeModal('quickViewModal');
};

// Render Policies dynamically — only overrides HTML if backend data provides content
function renderPolicies() {
  if (!AQUARIA_DATA.policies) return;
  const p = AQUARIA_DATA.policies;

  if (p.sizeGuide) {
    const title = document.getElementById('policySizeTitle');
    const subtitle = document.getElementById('policySizeSubtitle');
    const intro = document.getElementById('policySizeIntro');
    const tip = document.getElementById('policySizeFittingTip');
    const bagGuide = document.getElementById('policySizeBagGuide');

    if (title && p.sizeGuide.title) title.textContent = p.sizeGuide.title;
    if (subtitle && p.sizeGuide.subtitle) subtitle.textContent = p.sizeGuide.subtitle;
    if (intro && p.sizeGuide.intro) intro.textContent = p.sizeGuide.intro;
    if (tip && p.sizeGuide.fittingTip) tip.textContent = p.sizeGuide.fittingTip;
    if (bagGuide && p.sizeGuide.bagGuide) bagGuide.textContent = p.sizeGuide.bagGuide;
  }

  // For Shipping, Returns and Privacy: use innerHTML so rich HTML renders correctly.
  // sanitizeHTML strips scripts and event-handler attributes before rendering.
  function sanitizeHTML(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    // Remove entirely dangerous elements
    tmp.querySelectorAll('script,iframe,object,embed,base,link,meta,form').forEach(el => el.remove());
    // Strip on* event handlers and javascript: hrefs from every remaining node
    tmp.querySelectorAll('*').forEach(node => {
      Array.from(node.attributes).forEach(attr => {
        if (attr.name.startsWith('on') ||
            (attr.name === 'href' && attr.value.trim().toLowerCase().startsWith('javascript:'))) {
          node.removeAttribute(attr.name);
        }
      });
    });
    return tmp.innerHTML;
  }

  function setRichContent(el, data) {
    if (!el || !data) return;
    // If it looks like HTML (contains tags), sanitize then render
    if (data.includes('<') && data.includes('>')) {
      el.innerHTML = sanitizeHTML(data);
    }
    // If it's plain text with newlines, only override if element is currently empty
    else if (data.trim() && el.innerHTML.trim() === '') {
      el.style.whiteSpace = 'pre-line';
      el.textContent = data;
    }
    // Otherwise leave the rich HTML already in the page
  }

  if (p.shipping) {
    const title = document.getElementById('policyShippingTitle');
    const subtitle = document.getElementById('policyShippingSubtitle');
    const content = document.getElementById('policyShippingContent');
    if (title && p.shipping.title) title.textContent = p.shipping.title;
    if (subtitle && p.shipping.subtitle) subtitle.textContent = p.shipping.subtitle;
    setRichContent(content, p.shipping.content);
  }

  if (p.returns) {
    const title = document.getElementById('policyReturnsTitle');
    const subtitle = document.getElementById('policyReturnsSubtitle');
    const content = document.getElementById('policyReturnsContent');
    if (title && p.returns.title) title.textContent = p.returns.title;
    if (subtitle && p.returns.subtitle) subtitle.textContent = p.returns.subtitle;
    setRichContent(content, p.returns.content);
  }

  if (p.privacy) {
    const title = document.getElementById('policyPrivacyTitle');
    const subtitle = document.getElementById('policyPrivacySubtitle');
    const content = document.getElementById('policyPrivacyContent');
    if (title && p.privacy.title) title.textContent = p.privacy.title;
    if (subtitle && p.privacy.subtitle) subtitle.textContent = p.privacy.subtitle;
    setRichContent(content, p.privacy.content);
  }
}

window.openPolicyModal = function(policyKey = 'sizeGuide') {
  const modal = document.getElementById('policiesModal');
  if (!modal) return;
  renderPolicies();
  switchPolicyTab(policyKey);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.switchPolicyTab = function(policyKey) {
  document.querySelectorAll('.policy-tab-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-policy') === policyKey);
  });
  document.querySelectorAll('.policy-tab-pane').forEach(p => {
    p.style.display = p.id === `policyPane_${policyKey}` ? 'block' : 'none';
  });
};

window.openSizeGuideModal = function() {
  openPolicyModal('sizeGuide');
};

// Search Modal
window.openSearchModal = function() {
  const modal = document.getElementById('searchModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  const input = document.getElementById('searchInput');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 100);
  }
  handleSearch('');
};

window.handleSearch = function(query) {
  const container = document.getElementById('searchResultsList');
  if (!container) return;

  const cleanQuery = query.toLowerCase().trim();

  let results = AQUARIA_DATA.products || [];
  if (cleanQuery.length > 0) {
    results = results.filter(p => 
      p.name.toLowerCase().includes(cleanQuery) ||
      (p.department && p.department.toLowerCase().includes(cleanQuery)) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(cleanQuery)) ||
      (p.description && p.description.toLowerCase().includes(cleanQuery))
    );
  }

  if (results.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 10px; color: var(--color-espresso-muted);">
        <p>No results found for “${query}”.</p>
        <span style="font-size: 0.8rem; color: var(--color-gold);">Try searching for "Burgundy", "Heels", "Satchel", "Flats", or "Tote"</span>
      </div>
    `;
    return;
  }

  container.innerHTML = results.map(product => `
    <div class="search-result-item" onclick="closeModal('searchModal'); openQuickView('${product.id}')" style="display: flex; align-items: center; gap: 16px; padding: 10px; cursor: pointer;">
      <div style="width: 52px; height: 52px; border-radius: 2px; overflow: hidden; background: #EEE;">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div>
        <h6 style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--color-espresso);">${product.name}</h6>
        <p style="font-size: 0.82rem; color: var(--color-burgundy); font-weight: 600;">
          ${formatINR(product.price)} · <span style="color: var(--color-gold); font-size: 0.74rem; text-transform: uppercase;">${product.department} / ${product.categoryName || product.category}</span>
        </p>
      </div>
      <div style="margin-left: auto;">
        <span class="btn-text" style="font-size: 0.72rem;">View Piece</span>
      </div>
    </div>
  `).join('');
};

// Checkout & Post Order to Backend API
window.openCheckoutModal = function() {
  if (AppState.cart.length === 0) {
    showToast('Your shopping bag is empty.');
    return;
  }
  closeCartDrawer();

  const modal = document.getElementById('checkoutModal');
  const summary = document.getElementById('checkoutSummaryContent');
  if (!modal || !summary) return;

  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const threshold = (AQUARIA_DATA.brand && AQUARIA_DATA.brand.freeShippingThreshold) || 1999;
  const shippingFee = subtotal >= threshold ? 0 : 250;
  let discountAmount = AppState.appliedPromo === 'AQUARIA10' ? Math.round(subtotal * 0.10) : 0;
  const total = subtotal + shippingFee - discountAmount;

  summary.innerHTML = `
    <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-espresso); margin-bottom: 16px;">
      Order Summary (${AppState.cart.reduce((a, b) => a + b.quantity, 0)} items)
    </h4>
    <div style="max-height: 200px; overflow-y: auto; margin-bottom: 16px; display: flex; flex-direction: column; gap: 10px;">
      ${AppState.cart.map(item => `
        <div style="display: flex; justify-content: space-between; font-size: 0.84rem;">
          <div>
            <strong>${item.name}</strong> × ${item.quantity}
            <div style="font-size: 0.72rem; color: var(--color-espresso-light);">
              ${item.color} ${item.size ? `· Size: EU ${item.size}` : ''}
            </div>
          </div>
          <div>${formatINR(item.price * item.quantity)}</div>
        </div>
      `).join('')}
    </div>
    <div style="border-top: 1px solid var(--color-porcelain-dark); padding-top: 12px; display: flex; flex-direction: column; gap: 6px; font-size: 0.84rem; color: var(--color-espresso-muted);">
      <div style="display: flex; justify-content: space-between;">
        <span>Subtotal</span>
        <span>${formatINR(subtotal)}</span>
      </div>
      ${discountAmount > 0 ? `
        <div style="display: flex; justify-content: space-between; color: var(--color-burgundy); font-weight: 600;">
          <span>Voucher Privilege (10%)</span>
          <span>-${formatINR(discountAmount)}</span>
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between;">
        <span>Shipping</span>
        <span>${shippingFee === 0 ? 'Complimentary' : formatINR(shippingFee)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 600; color: var(--color-burgundy); border-top: 1px solid var(--color-porcelain-dark); margin-top: 8px; padding-top: 8px;">
        <span>Total Amount</span>
        <span>${formatINR(total)}</span>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.handleCheckoutSubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const fullName = form.fullName.value;
  const email = form.email.value;
  const phone = form.phone.value;
  const address = form.address.value;
  const city = form.city.value;
  const pincode = form.pincode.value;

  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const threshold = (AQUARIA_DATA.brand && AQUARIA_DATA.brand.freeShippingThreshold) || 1999;
  const shippingFee = subtotal >= threshold ? 0 : 250;
  const discountAmount = AppState.appliedPromo === 'AQUARIA10' ? Math.round(subtotal * 0.10) : 0;
  const total = subtotal + shippingFee - discountAmount;
  const orderId = 'AQ-' + Math.floor(100000 + Math.random() * 900000);

  const orderPayload = {
    orderId,
    fullName,
    email,
    phone,
    address,
    city,
    pincode,
    items: [...AppState.cart],
    subtotal,
    discount: discountAmount,
    shippingFee,
    total,
    status: 'Confirmed'
  };

  // Send to backend API
  try {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
  } catch (err) {
    console.log('Order saved in local session.');
  }

  AppState.cart = [];
  AppState.appliedPromo = null;
  saveCartState();

  closeModal('checkoutModal');

  setTimeout(() => {
    showToast(`Order Placed! Order ID: ${orderId}.`);
    alert(`Thank you, ${fullName}!\n\nYour AQUARIA order (${orderId}) has been confirmed and saved to the backend.\nA concierge confirmation has been sent to ${email}.\n\n(View in Admin Portal: http://localhost:3000/admin)`);
  }, 300);
};

window.openAccountModal = function() {
  const modal = document.getElementById('accountModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.openContactModal = function() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.handleContactSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  form.reset();
  closeModal('contactModal');
  showToast(`Thank you, ${name}. Your message has been sent to our client concierge.`);
};

window.handleNewsletterSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input[type="email"]');
  if (!input || !input.value) return;
  const email = input.value;
  input.value = '';
  showToast(`Welcome to the AQUARIA Society. A welcome note was sent to ${email}.`);
};

window.openCartDrawer = function() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeCartDrawer = function() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.openMobileNav = function() {
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeMobileNav = function() {
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

function setupEventListeners() {
  const backdrop = document.getElementById('drawerBackdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeCartDrawer();
      closeMobileNav();
    });
  }

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', handleSortChange);
  }

  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeMobileNav();
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });
}
