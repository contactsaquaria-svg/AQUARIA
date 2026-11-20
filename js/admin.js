/**
 * AQUARIA — Backend CMS Application Logic
 */

// ==========================================
// AUTH — Token stored in sessionStorage
// ==========================================
const ADMIN_TOKEN_KEY = 'aquaria_admin_token';

function getToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

function authHeaders(extra) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...extra };
}

/** Wraps fetch; on 401 wipes token and shows login overlay */
async function authFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) }
  });
  if (res.status === 401) {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    showLoginOverlay('Session expired. Please sign in again.');
    throw new Error('Unauthorised');
  }
  return res;
}

function showLoginOverlay(msg) {
  const overlay = document.getElementById('adminLoginOverlay');
  if (overlay) overlay.style.display = 'flex';
  const errEl = document.getElementById('loginError');
  if (errEl) { errEl.textContent = msg || ''; errEl.style.display = msg ? 'block' : 'none'; }
  const inp = document.getElementById('adminPasswordInput');
  if (inp) { inp.value = ''; inp.focus(); }
}

window.handleAdminLogin = async function(e) {
  e.preventDefault();
  const password = document.getElementById('adminPasswordInput').value;
  const btn = document.getElementById('loginSubmitBtn');
  const errEl = document.getElementById('loginError');

  btn.disabled = true;
  btn.textContent = 'Signing in…';
  errEl.style.display = 'none';

  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (res.ok) {
      const { token } = await res.json();
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
      document.getElementById('adminLoginOverlay').style.display = 'none';
      await loadAdminData();
    } else {
      errEl.textContent = 'Incorrect password. Try again.';
      errEl.style.display = 'block';
    }
  } catch {
    errEl.textContent = 'Could not reach server. Try again.';
    errEl.style.display = 'block';
  }

  btn.disabled = false;
  btn.textContent = 'Sign In';
};

// ==========================================

let siteData = {};
let activeSection = 'dashboard';
let editingProductId = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) {
    showLoginOverlay();
    return;
  }
  loadAdminData();
  setupNavigation();
});

async function loadAdminData() {
  setupNavigation();
  try {
    // GET /api/data is public (products, hero, etc.) — no auth needed
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error('Could not fetch data');
    siteData = await res.json();

    // GET /api/orders is protected (customer PII)
    try {
      const ordRes = await authFetch('/api/orders');
      if (ordRes.ok) siteData.orders = await ordRes.json();
    } catch { /* if 401, authFetch already showed login */ }

    populateAllFields();
    renderProductsTable();
    renderOrdersTable();
    updateStats();
  } catch (err) {
    console.error('Error loading data:', err);
    if (!err.message.includes('Unauthorised')) {
      showToast('Failed to connect to backend server.');
    }
  }
}

function showToast(msg) {
  const toast = document.getElementById('adminToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}

// Navigation between tabs
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.getAttribute('data-target');
      switchSection(sectionId);
    });
  });
}

function switchSection(sectionId) {
  activeSection = sectionId;
  document.querySelectorAll('.nav-item').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-target') === sectionId);
  });
  document.querySelectorAll('.admin-section-view').forEach(view => {
    view.style.display = view.id === `section-${sectionId}` ? 'block' : 'none';
  });
}

function updateStats() {
  const products = siteData.products || [];
  const bags = products.filter(p => p.department === 'bags').length;
  const shoes = products.filter(p => p.department === 'footwear').length;
  const orders = siteData.orders || [];

  const totalRev = orders.reduce((sum, o) => {
    const val = parseInt(o.total || 0, 10);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const elProducts = document.getElementById('statTotalProducts');
  const elBags = document.getElementById('statTotalBags');
  const elShoes = document.getElementById('statTotalShoes');
  const elOrders = document.getElementById('statTotalOrders');

  if (elProducts) elProducts.textContent = products.length;
  if (elBags) elBags.textContent = bags;
  if (elShoes) elShoes.textContent = shoes;
  if (elOrders) elOrders.textContent = orders.length;
}

// Populate fields from siteData
function populateAllFields() {
  // Brand & Announcement
  if (siteData.brand) {
    setValue('brandAnnouncement', siteData.brand.announcement);
    setValue('brandTagline', siteData.brand.tagline);
    setValue('brandShippingThreshold', siteData.brand.freeShippingThreshold);
  }

  // Hero Section
  if (siteData.hero) {
    setValue('heroTag', siteData.hero.tag);
    setValue('heroTitle', siteData.hero.title);
    setValue('heroDescription', siteData.hero.description);
    setValue('heroImage', siteData.hero.image);
    setValue('heroBtnBags', siteData.hero.btnBagsText);
    setValue('heroBtnFootwear', siteData.hero.btnFootwearText);
    setPreview('heroImagePreview', siteData.hero.image);
  }

  // Departments
  if (siteData.departments) {
    if (siteData.departments.bags) {
      const b = siteData.departments.bags;
      setValue('deptBagsTitle', b.title);
      setValue('deptBagsSubtitle', b.subtitle);
      setValue('deptBagsDesc', b.description);
      setValue('deptBagsImage', b.image);
      setPreview('deptBagsImagePreview', b.image);
    }
    if (siteData.departments.footwear) {
      const f = siteData.departments.footwear;
      setValue('deptShoesTitle', f.title);
      setValue('deptShoesSubtitle', f.subtitle);
      setValue('deptShoesDesc', f.description);
      setValue('deptShoesImage', f.image);
      setPreview('deptShoesImagePreview', f.image);
    }
  }

  // Brand Story
  if (siteData.story) {
    const s = siteData.story;
    setValue('storyTag', s.tag);
    setValue('storyHeading', s.heading);
    setValue('storyPara1', s.paragraph1);
    setValue('storyPara2', s.paragraph2);
    setValue('storyImage1', s.image1);
    setValue('storyImage2', s.image2);
    setPreview('storyImage1Preview', s.image1);
    setPreview('storyImage2Preview', s.image2);
  }

  // Why AQUARIA
  if (siteData.whyAquaria && siteData.whyAquaria.length >= 4) {
    siteData.whyAquaria.forEach((item, i) => {
      setValue(`whyTitle${i+1}`, item.title);
      setValue(`whyDesc${i+1}`, item.description);
    });
  }

  // Style Diary
  if (siteData.styleDiary) {
    const diaryContainer = document.getElementById('diaryInputsContainer');
    if (diaryContainer) {
      diaryContainer.innerHTML = siteData.styleDiary.map((item, idx) => `
        <div class="admin-card" style="margin-bottom: 16px; padding: 18px;">
          <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: 10px;">Tile #${idx + 1} — ${item.tag}</h4>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Tag / Category</label>
              <input type="text" class="form-input" id="diaryTag_${idx}" value="${item.tag}">
            </div>
            <div class="form-group">
              <label class="form-label">Caption</label>
              <input type="text" class="form-input" id="diaryCaption_${idx}" value="${item.caption}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Photo URL</label>
            <input type="text" class="form-input" id="diaryImg_${idx}" value="${item.image}" oninput="setPreview('diaryPreview_${idx}', this.value)">
          </div>
          <div class="image-uploader-box">
            <img id="diaryPreview_${idx}" src="${item.image}" class="image-preview" style="max-height: 120px;">
            <input type="file" accept="image/*" onchange="uploadImageForField(this, 'diaryImg_${idx}', 'diaryPreview_${idx}')">
          </div>
        </div>
      `).join('');
    }
  }

  // Reviews
  if (siteData.sampleReviews) {
    const revContainer = document.getElementById('reviewsInputsContainer');
    if (revContainer) {
      revContainer.innerHTML = siteData.sampleReviews.map((rev, idx) => `
        <div class="admin-card" style="margin-bottom: 16px; padding: 18px;">
          <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: 10px;">Review #${idx + 1} by ${rev.author}</h4>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Author Name</label>
              <input type="text" class="form-input" id="revAuthor_${idx}" value="${rev.author}">
            </div>
            <div class="form-group">
              <label class="form-label">City</label>
              <input type="text" class="form-input" id="revCity_${idx}" value="${rev.city}">
            </div>
            <div class="form-group">
              <label class="form-label">Product Name / Set</label>
              <input type="text" class="form-input" id="revProd_${idx}" value="${rev.productName}">
            </div>
            <div class="form-group">
              <label class="form-label">Headline</label>
              <input type="text" class="form-input" id="revTitle_${idx}" value="${rev.title}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Review Text</label>
            <textarea class="form-textarea" rows="2" id="revContent_${idx}">${rev.content}</textarea>
          </div>
        </div>
      `).join('');
    }
  }

  // Contact Details
  if (siteData.contactDetails) {
    const c = siteData.contactDetails;
    setValue('contactPhone', c.phone);
    setValue('contactWhatsapp', c.whatsapp);
    setValue('contactEmail', c.email);
    setValue('contactAddress', c.address);
    setValue('contactHours', c.hours);
    setValue('contactSupportNote', c.supportNote);
  }

  // Policies & Guides
  if (siteData.policies) {
    const pol = siteData.policies;
    if (pol.sizeGuide) {
      setValue('policyEdit_sizeTitle', pol.sizeGuide.title);
      setValue('policyEdit_sizeSubtitle', pol.sizeGuide.subtitle);
      setValue('policyEdit_sizeIntro', pol.sizeGuide.intro);
      setValue('policyEdit_sizeTip', pol.sizeGuide.fittingTip);
      setValue('policyEdit_sizeBagGuide', pol.sizeGuide.bagGuide);
    }
    if (pol.shipping) {
      setValue('policyEdit_shipTitle', pol.shipping.title);
      setValue('policyEdit_shipSubtitle', pol.shipping.subtitle);
      setValue('policyEdit_shipContent', pol.shipping.content);
    }
    if (pol.returns) {
      setValue('policyEdit_retTitle', pol.returns.title);
      setValue('policyEdit_retSubtitle', pol.returns.subtitle);
      setValue('policyEdit_retContent', pol.returns.content);
    }
    if (pol.privacy) {
      setValue('policyEdit_privTitle', pol.privacy.title);
      setValue('policyEdit_privSubtitle', pol.privacy.subtitle);
      setValue('policyEdit_privContent', pol.privacy.content);
    }
  }
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.value = val;
}

function setPreview(imgId, url) {
  const el = document.getElementById(imgId);
  if (el && url) el.src = url;
}

// File Upload to /api/upload
window.uploadImageForField = async function(fileInput, inputId, previewId) {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64Data = e.target.result;
    try {
      showToast('Uploading photo to server...');
      const res = await authFetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, data: base64Data })
      });
      const json = await res.json();
      if (json.success && json.url) {
        setValue(inputId, json.url);
        setPreview(previewId, json.url);
        showToast('Photo uploaded and applied successfully!');
      } else {
        showToast('Upload failed.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Upload error.');
    }
  };
  reader.readAsDataURL(file);
};

// Save Hero & Announcement
window.saveHeroSettings = async function(e) {
  if (e) e.preventDefault();
  siteData.brand.announcement = document.getElementById('brandAnnouncement').value;
  siteData.brand.tagline = document.getElementById('brandTagline').value;
  siteData.brand.freeShippingThreshold = parseInt(document.getElementById('brandShippingThreshold').value, 10) || 1999;

  siteData.hero.tag = document.getElementById('heroTag').value;
  siteData.hero.title = document.getElementById('heroTitle').value;
  siteData.hero.description = document.getElementById('heroDescription').value;
  siteData.hero.image = document.getElementById('heroImage').value;
  siteData.hero.btnBagsText = document.getElementById('heroBtnBags').value;
  siteData.hero.btnFootwearText = document.getElementById('heroBtnFootwear').value;

  await sendSaveRequest({ brand: siteData.brand, hero: siteData.hero }, 'Hero banner and announcement updated!');
};

// Save Department Banners
window.saveDepartments = async function(e) {
  if (e) e.preventDefault();
  siteData.departments.bags.title = document.getElementById('deptBagsTitle').value;
  siteData.departments.bags.subtitle = document.getElementById('deptBagsSubtitle').value;
  siteData.departments.bags.description = document.getElementById('deptBagsDesc').value;
  siteData.departments.bags.image = document.getElementById('deptBagsImage').value;

  siteData.departments.footwear.title = document.getElementById('deptShoesTitle').value;
  siteData.departments.footwear.subtitle = document.getElementById('deptShoesSubtitle').value;
  siteData.departments.footwear.description = document.getElementById('deptShoesDesc').value;
  siteData.departments.footwear.image = document.getElementById('deptShoesImage').value;

  await sendSaveRequest({ departments: siteData.departments }, 'Department banners & posters updated!');
};

// Save Brand Story
window.saveStorySettings = async function(e) {
  if (e) e.preventDefault();
  siteData.story.tag = document.getElementById('storyTag').value;
  siteData.story.heading = document.getElementById('storyHeading').value;
  siteData.story.paragraph1 = document.getElementById('storyPara1').value;
  siteData.story.paragraph2 = document.getElementById('storyPara2').value;
  siteData.story.image1 = document.getElementById('storyImage1').value;
  siteData.story.image2 = document.getElementById('storyImage2').value;

  await sendSaveRequest({ story: siteData.story }, 'Brand Story & Philosophy updated!');
};

// Save Why AQUARIA
window.saveWhyAquaria = async function(e) {
  if (e) e.preventDefault();
  for (let i = 0; i < 4; i++) {
    siteData.whyAquaria[i].title = document.getElementById(`whyTitle${i+1}`).value;
    siteData.whyAquaria[i].description = document.getElementById(`whyDesc${i+1}`).value;
  }
  await sendSaveRequest({ whyAquaria: siteData.whyAquaria }, 'Why AQUARIA highlights updated!');
};

// Save Style Diary
window.saveStyleDiary = async function(e) {
  if (e) e.preventDefault();
  siteData.styleDiary = siteData.styleDiary.map((item, idx) => ({
    ...item,
    tag: document.getElementById(`diaryTag_${idx}`).value,
    caption: document.getElementById(`diaryCaption_${idx}`).value,
    image: document.getElementById(`diaryImg_${idx}`).value
  }));
  await sendSaveRequest({ styleDiary: siteData.styleDiary }, 'Style Diary lookbook updated!');
};

// Save Customer Reviews
window.saveReviews = async function(e) {
  if (e) e.preventDefault();
  siteData.sampleReviews = siteData.sampleReviews.map((rev, idx) => ({
    ...rev,
    author: document.getElementById(`revAuthor_${idx}`).value,
    city: document.getElementById(`revCity_${idx}`).value,
    productName: document.getElementById(`revProd_${idx}`).value,
    title: document.getElementById(`revTitle_${idx}`).value,
    content: document.getElementById(`revContent_${idx}`).value
  }));
  await sendSaveRequest({ sampleReviews: siteData.sampleReviews }, 'Customer reviews updated!');
};

// Save Contact & Atelier Details
window.saveContactDetails = async function(e) {
  if (e) e.preventDefault();
  siteData.contactDetails = {
    phone: document.getElementById('contactPhone').value,
    whatsapp: document.getElementById('contactWhatsapp').value,
    email: document.getElementById('contactEmail').value,
    address: document.getElementById('contactAddress').value,
    hours: document.getElementById('contactHours').value,
    supportNote: document.getElementById('contactSupportNote').value
  };
  await sendSaveRequest({ contactDetails: siteData.contactDetails }, 'Contact & Atelier information updated successfully!');
};

// Save Store Policies & Fitting Guides
window.savePolicies = async function(e) {
  if (e) e.preventDefault();
  siteData.policies = {
    sizeGuide: {
      title: document.getElementById('policyEdit_sizeTitle').value,
      subtitle: document.getElementById('policyEdit_sizeSubtitle').value,
      intro: document.getElementById('policyEdit_sizeIntro').value,
      fittingTip: document.getElementById('policyEdit_sizeTip').value,
      bagGuide: document.getElementById('policyEdit_sizeBagGuide').value
    },
    shipping: {
      title: document.getElementById('policyEdit_shipTitle').value,
      subtitle: document.getElementById('policyEdit_shipSubtitle').value,
      content: document.getElementById('policyEdit_shipContent').value
    },
    returns: {
      title: document.getElementById('policyEdit_retTitle').value,
      subtitle: document.getElementById('policyEdit_retSubtitle').value,
      content: document.getElementById('policyEdit_retContent').value
    },
    privacy: {
      title: document.getElementById('policyEdit_privTitle').value,
      subtitle: document.getElementById('policyEdit_privSubtitle').value,
      content: document.getElementById('policyEdit_privContent').value
    }
  };
  await sendSaveRequest({ policies: siteData.policies }, 'Store Policies & Fitting Guides updated successfully!');
};

async function sendSaveRequest(payload, successMsg) {
  try {
    const res = await authFetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast(successMsg);
    } else {
      showToast('Error saving changes to server.');
    }
  } catch (err) {
    if (!err.message.includes('Unauthorised')) {
      console.error(err);
      showToast('Failed to save to server.');
    }
  }
}

// ==========================================
// Product Catalog Operations
// ==========================================

function renderProductsTable(filterDept = 'all') {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  let products = siteData.products || [];
  if (filterDept !== 'all') {
    products = products.filter(p => p.department === filterDept);
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <img src="${p.image}" class="table-thumb" alt="${p.name}">
      </td>
      <td>
        <strong>${p.name}</strong>
        <div style="font-size: 0.74rem; color: var(--admin-muted);">${p.categoryName || p.category}</div>
      </td>
      <td>
        <span class="badge-tag ${p.department === 'footwear' ? 'badge-footwear' : 'badge-bags'}">
          ${p.department === 'footwear' ? 'Footwear' : 'Bag'}
        </span>
      </td>
      <td>
        <strong style="color: var(--admin-burgundy);">₹${p.price.toLocaleString('en-IN')}</strong>
        ${p.originalPrice ? `<span style="font-size: 0.74rem; text-decoration: line-through; color: var(--admin-muted); margin-left: 4px;">₹${p.originalPrice}</span>` : ''}
      </td>
      <td>
        ${p.department === 'footwear' && p.sizes ? p.sizes.map(s => `<span style="font-size: 0.7rem; border: 1px solid #DDD; padding: 1px 4px; border-radius: 2px; margin-right: 2px;">${s}</span>`).join('') : '—'}
      </td>
      <td>
        <button class="admin-btn admin-btn-secondary" style="padding: 6px 12px; font-size: 0.72rem; margin-right: 4px;" onclick="openEditProductModal('${p.id}')">
          Edit
        </button>
        <button class="admin-btn admin-btn-danger" style="padding: 6px 12px; font-size: 0.72rem;" onclick="deleteProduct('${p.id}')">
          Delete
        </button>
      </td>
    </tr>
  `).join('');
}

window.filterCatalog = function(dept) {
  renderProductsTable(dept);
};

window.openNewProductModal = function() {
  editingProductId = null;
  document.getElementById('modalProductTitle').textContent = 'Add New Product (Bag or Footwear)';
  document.getElementById('prodForm').reset();
  setValue('prodId', '');
  setValue('prodDept', 'bags');
  onDeptChange();
  setPreview('prodImagePreview', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80');
  document.getElementById('productModal').classList.add('active');
};

window.openEditProductModal = function(id) {
  const p = (siteData.products || []).find(item => item.id === id);
  if (!p) return;

  editingProductId = p.id;
  document.getElementById('modalProductTitle').textContent = `Edit Product: ${p.name}`;

  setValue('prodId', p.id);
  setValue('prodDept', p.department);
  setValue('prodName', p.name);
  setValue('prodCategory', p.category);
  setValue('prodPrice', p.price);
  setValue('prodOrigPrice', p.originalPrice || '');
  setValue('prodBadge', p.badge || '');
  setValue('prodImage', p.image);
  setValue('prodDesc', p.description);
  setValue('prodMaterial', p.material);
  setValue('prodDimensions', p.dimensions || p.heelHeight || '');
  setValue('prodColors', p.colors ? p.colors.map(c => c.name).join(', ') : '');
  setValue('prodSizes', p.sizes ? p.sizes.join(', ') : '');

  onDeptChange();
  setPreview('prodImagePreview', p.image);
  document.getElementById('productModal').classList.add('active');
};

window.closeProductModal = function() {
  document.getElementById('productModal').classList.remove('active');
};

window.onDeptChange = function() {
  const dept = document.getElementById('prodDept').value;
  const sizeGroup = document.getElementById('footwearSizesGroup');
  const catSelect = document.getElementById('prodCategory');

  if (dept === 'footwear') {
    sizeGroup.style.display = 'block';
    catSelect.innerHTML = `
      <option value="fancy-sandals">Handmade Fancy Sandals</option>
      <option value="embellished-footwear">Embellished Footwear</option>
      <option value="handmade-flats">Handmade Flats</option>
      <option value="party-wear">Party Wear Footwear</option>
      <option value="ethnic-footwear">Ethnic Footwear</option>
      <option value="occasion-wear">Occasion Wear</option>
    `;
  } else {
    sizeGroup.style.display = 'none';
    catSelect.innerHTML = `
      <option value="handbags">Handbags</option>
      <option value="tote-bags">Tote Bags</option>
      <option value="shoulder-bags">Shoulder Bags</option>
      <option value="crossbody-bags">Crossbody Bags</option>
      <option value="office-bags">Office Bags</option>
      <option value="travel-bags">Travel Bags</option>
    `;
  }
};

window.saveProductForm = async function(e) {
  e.preventDefault();
  const dept = document.getElementById('prodDept').value;
  const name = document.getElementById('prodName').value;
  const cat = document.getElementById('prodCategory').value;
  const catName = document.getElementById('prodCategory').options[document.getElementById('prodCategory').selectedIndex].text;
  const price = parseInt(document.getElementById('prodPrice').value, 10);
  const origPriceVal = document.getElementById('prodOrigPrice').value;
  const origPrice = origPriceVal ? parseInt(origPriceVal, 10) : null;
  const badge = document.getElementById('prodBadge').value;
  const image = document.getElementById('prodImage').value;
  const desc = document.getElementById('prodDesc').value;
  const material = document.getElementById('prodMaterial').value;
  const dim = document.getElementById('prodDimensions').value;
  const colorsRaw = document.getElementById('prodColors').value;
  const sizesRaw = document.getElementById('prodSizes').value;

  const colorList = colorsRaw.split(',').map(c => c.trim()).filter(Boolean).map(c => ({
    name: c,
    hex: c.toLowerCase().includes('burgundy') ? '#642D40' : c.toLowerCase().includes('blush') ? '#F2DDE0' : c.toLowerCase().includes('gold') ? '#C4A477' : '#35272A'
  }));

  const sizeList = sizesRaw.split(',').map(s => s.trim()).filter(Boolean);

  const productData = {
    name,
    department: dept,
    category: cat,
    categoryName: catName,
    price,
    originalPrice: origPrice,
    badge,
    image,
    description: desc,
    material,
    colors: colorList.length > 0 ? colorList : [{ name: "Royal Burgundy", hex: "#642D40" }]
  };

  if (dept === 'footwear') {
    productData.sizes = sizeList.length > 0 ? sizeList : ["36", "37", "38", "39", "40", "41"];
    productData.heelHeight = dim;
  } else {
    productData.dimensions = dim;
  }

  try {
    if (editingProductId) {
      // Update existing
      const res = await authFetch(`/api/products/${editingProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        showToast(`Product "${name}" updated successfully!`);
      }
    } else {
      // Add new
      const res = await authFetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        showToast(`New product "${name}" added to catalog!`);
      }
    }

    closeProductModal();
    await loadAdminData();
  } catch (err) {
    if (!err.message.includes('Unauthorised')) {
      console.error(err);
      showToast('Failed to save product.');
    }
  }
};

window.deleteProduct = async function(id) {
  if (!confirm('Are you sure you want to delete this product from the website?')) return;
  try {
    const res = await authFetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Product removed.');
      await loadAdminData();
    }
  } catch (err) {
    if (!err.message.includes('Unauthorised')) {
      console.error(err);
      showToast('Error deleting product.');
    }
  }
};

// ==========================================
// Orders Operations
// ==========================================

function renderOrdersTable() {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  const orders = siteData.orders || [];
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-muted); padding: 24px;">No customer orders placed yet. Orders submitted on the storefront will appear here instantly.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map((o, idx) => `
    <tr>
      <td><strong>#${o.orderId || 'AQ-' + (1000 + idx)}</strong></td>
      <td>
        <div><strong>${o.fullName || 'Customer'}</strong></div>
        <div style="font-size: 0.74rem; color: var(--admin-muted);">${o.email || ''} · ${o.phone || ''}</div>
      </td>
      <td>
        <div style="font-size: 0.8rem;">${o.address || ''}, ${o.city || ''} - ${o.pincode || ''}</div>
      </td>
      <td>
        <span style="font-size: 0.8rem;">${(o.items || []).map(i => `${i.name} (${i.color}${i.size ? `, Size ${i.size}` : ''}) × ${i.quantity}`).join('<br>') || 'AQUARIA Accessory'}</span>
      </td>
      <td>
        <strong style="color: var(--admin-burgundy);">₹${(o.total || 0).toLocaleString('en-IN')}</strong>
      </td>
      <td>
        <span class="badge-tag" style="background: #E8F5E9; color: #2E7D32;">${o.status || 'Received'}</span>
      </td>
    </tr>
  `).join('');
}
