/* Natural Mountain — frontend demo (no backend)
   - White/green theme handled in CSS
   - Stores sorted by distance (geolocation + haversine)
   - Cart persisted in localStorage
   - Product cards show image + details
   - Cart shows image + details
   - Product "View" opens a product detail modal
   - Orders saved per store in localStorage (demo admin page)
*/

const LS = {
  storeId: "nm_selected_store_id",
  cart: "nm_cart_v1",
  orders: "nm_orders_v1", // { [storeId]: [order, ...] }
};

// Replace these with your real 8 locations (lat/lng required for distance)
const STORES = [
  {
    id: "s1",
    name: "Natural Mountain — Downtown",
    phone: "012-345-6789",
    address: "Downtown Area",
    lat: 13.7563,
    lng: 100.5018,
    hours: "08:00–20:00",
  },
  {
    id: "s2",
    name: "Natural Mountain — Riverside",
    phone: "012-111-2222",
    address: "Riverside Road",
    lat: 13.72,
    lng: 100.513,
    hours: "09:00–19:00",
  },
  {
    id: "s3",
    name: "Natural Mountain — North Plaza",
    phone: "012-333-4444",
    address: "North Plaza",
    lat: 13.82,
    lng: 100.52,
    hours: "08:00–21:00",
  },
  {
    id: "s4",
    name: "Natural Mountain — East Market",
    phone: "012-555-6666",
    address: "East Market",
    lat: 13.73,
    lng: 100.62,
    hours: "08:00–20:00",
  },
  {
    id: "s5",
    name: "Natural Mountain — West Gate",
    phone: "012-777-8888",
    address: "West Gate",
    lat: 13.74,
    lng: 100.42,
    hours: "10:00–18:00",
  },
  {
    id: "s6",
    name: "Natural Mountain — Central Park",
    phone: "012-999-0000",
    address: "Central Park",
    lat: 13.77,
    lng: 100.51,
    hours: "08:00–20:00",
  },
  {
    id: "s7",
    name: "Natural Mountain — Airport Link",
    phone: "012-121-2121",
    address: "Airport Link",
    lat: 13.69,
    lng: 100.75,
    hours: "08:00–19:00",
  },
  {
    id: "s8",
    name: "Natural Mountain — Campus",
    phone: "012-343-4343",
    address: "Campus Zone",
    lat: 13.85,
    lng: 100.57,
    hours: "09:00–17:00",
  },
];

// Add your real product images under /images
const PRODUCTS = [
  {
    id: "p1",
    name: "Plain Yogurt",
    category: "Yogurt",
    size: "150g",
    price: 35,
    image: "images/yogurt-plain.jpg",
    short: "Smooth and fresh. Great daily probiotic.",
    description:
      "Plain yogurt made from fresh milk. Mild taste, creamy texture. Suitable for breakfast bowls and smoothies.",
  },
  {
    id: "p2",
    name: "Greek Yogurt",
    category: "Yogurt",
    size: "150g",
    price: 45,
    image: "images/yogurt-greek.jpg",
    short: "Thick, high-protein style.",
    description:
      "Strained yogurt for a thicker texture and higher protein. Perfect with fruit, granola, or honey.",
  },
  {
    id: "p3",
    name: "Strawberry Yogurt",
    category: "Yogurt",
    size: "150g",
    price: 40,
    image: "images/yogurt-strawberry.jpg",
    short: "Light sweetness with real fruit flavor.",
    description:
      "Creamy strawberry yogurt with a bright fruit note. Enjoy chilled for a refreshing snack.",
  },
  {
    id: "p4",
    name: "Blueberry Yogurt",
    category: "Yogurt",
    size: "150g",
    price: 40,
    image: "images/yogurt-blueberry.jpg",
    short: "Balanced taste, rich berry aroma.",
    description:
      "Blueberry yogurt with a smooth texture and gentle berry flavor. Great with granola or oats.",
  },
  {
    id: "p5",
    name: "Non-fat Milk",
    category: "Milk",
    size: "1L",
    price: 55,
    image: "images/milk-nonfat-1l.jpg",
    short: "Light and clean taste. Zero fat.",
    description:
      "Non-fat milk with a clean finish. Great for coffee, cereal, and everyday drinking.",
  },
  {
    id: "p6",
    name: "Non-fat Milk",
    category: "Milk",
    size: "500ml",
    price: 35,
    image: "images/milk-nonfat-500.jpg",
    short: "Easy size for on-the-go.",
    description:
      "Non-fat milk in a convenient 500ml size. Perfect for a quick healthy drink.",
  },
  {
    id: "p7",
    name: "Yogurt Bundle (4 pcs)",
    category: "Bundles",
    size: "4 × 150g",
    price: 150,
    image: "images/bundle-yogurt-4.jpg",
    short: "Mix & match (availability depends on store).",
    description:
      "A convenient 4-pack yogurt bundle. The store will confirm available flavors when processing your request.",
  },
  {
    id: "p8",
    name: "Weekly Milk Pack (3L)",
    category: "Bundles",
    size: "3 × 1L",
    price: 150,
    image: "images/bundle-milk-3l.jpg",
    short: "Best value for weekly routine.",
    description:
      "A weekly non-fat milk pack (3 × 1L). Ideal for families and meal prep.",
  },
  {
    id: "p9",
    name: "Low Sugar Yogurt",
    category: "New",
    size: "150g",
    price: 42,
    image: "images/yogurt-low-sugar.jpg",
    short: "Lower sugar, clean taste.",
    description:
      "Low sugar yogurt designed for a lighter sweetness. Store will confirm availability.",
  },
  {
    id: "p10",
    name: "High Protein Yogurt",
    category: "New",
    size: "150g",
    price: 49,
    image: "images/yogurt-high-protein.jpg",
    short: "Extra protein, thick texture.",
    description:
      "High protein yogurt for active lifestyles. Great post-workout snack.",
  },
];

const state = {
  userPos: null,
  storeDistances: new Map(), // storeId -> km
  selectedStoreId: localStorage.getItem(LS.storeId) || null,
  cart: loadCart(),
};

// ---------- DOM ----------
const els = {
  // store bar
  selectedStoreName: document.getElementById("selectedStoreName"),
  selectedStorePhone: document.getElementById("selectedStorePhone"),
  storeBar: document.getElementById("storeBar"),

  // store modal
  btnOpenStores: document.getElementById("btnOpenStores"),
  btnChangeStore: document.getElementById("btnChangeStore"),
  storeModal: document.getElementById("storeModal"),
  btnCloseStores: document.getElementById("btnCloseStores"),
  btnUseLocation: document.getElementById("btnUseLocation"),
  btnManual: document.getElementById("btnManual"),
  locationStatus: document.getElementById("locationStatus"),
  storeList: document.getElementById("storeList"),

  // products
  categoryChips: document.getElementById("categoryChips"),
  categorySelect: document.getElementById("categorySelect"),
  searchInput: document.getElementById("searchInput"),
  productGrid: document.getElementById("productGrid"),

  // cart
  cartModal: document.getElementById("cartModal"),
  btnOpenCart: document.getElementById("btnOpenCart"),
  btnBottomCart: document.getElementById("btnBottomCart"),
  btnCloseCart: document.getElementById("btnCloseCart"),
  cartBadge: document.getElementById("cartBadge"),
  cartItems: document.getElementById("cartItems"),
  cartStoreLine: document.getElementById("cartStoreLine"),
  bottomBar: document.getElementById("bottomBar"),
  bottomTitle: document.getElementById("bottomTitle"),
  bottomSubtitle: document.getElementById("bottomSubtitle"),
  btnClearCart: document.getElementById("btnClearCart"),
  btnSendOrder: document.getElementById("btnSendOrder"),

  // customer fields
  custName: document.getElementById("custName"),
  custPhone: document.getElementById("custPhone"),
  fulfillment: document.getElementById("fulfillment"),
  preferredTime: document.getElementById("preferredTime"),
  notes: document.getElementById("notes"),

  // confirmation
  confirmModal: document.getElementById("confirmModal"),
  btnCloseConfirm: document.getElementById("btnCloseConfirm"),
  confirmLine: document.getElementById("confirmLine"),
  orderNumber: document.getElementById("orderNumber"),
  btnCallStore: document.getElementById("btnCallStore"),
  btnContinueShopping: document.getElementById("btnContinueShopping"),

  // promo
  promoTrack: document.getElementById("promoTrack"),
  promoDots: document.getElementById("promoDots"),

  // product detail modal
  productModal: document.getElementById("productModal"),
  btnCloseProduct: document.getElementById("btnCloseProduct"),
  pdName: document.getElementById("pdName"),
  pdMeta: document.getElementById("pdMeta"),
  pdImg: document.getElementById("pdImg"),
  pdCategory: document.getElementById("pdCategory"),
  pdSize: document.getElementById("pdSize"),
  pdPrice: document.getElementById("pdPrice"),
  pdDesc: document.getElementById("pdDesc"),
  pdDec: document.getElementById("pdDec"),
  pdInc: document.getElementById("pdInc"),
  pdQty: document.getElementById("pdQty"),
  pdGoCart: document.getElementById("pdGoCart"),
};

// ---------- INIT ----------
init();

function init() {
  initCarousel();
  initCategories();
  renderStoreBar();
  renderProducts();
  renderCartBadge();

  // Store modal handlers
  els.btnOpenStores?.addEventListener("click", () => openStoresModal());
  els.btnChangeStore?.addEventListener("click", () => openStoresModal());
  els.btnCloseStores?.addEventListener("click", () => els.storeModal?.close());
  els.btnUseLocation?.addEventListener("click", () => requestLocationAndSort());
  els.btnManual?.addEventListener("click", () => renderStoreList());

  // Cart handlers
  els.btnOpenCart?.addEventListener("click", () => openCart());
  els.btnBottomCart?.addEventListener("click", () => openCart());
  els.btnCloseCart?.addEventListener("click", () => els.cartModal?.close());
  els.btnClearCart?.addEventListener("click", clearCart);
  els.btnSendOrder?.addEventListener("click", submitOrder);

  // Filters
  els.searchInput?.addEventListener("input", renderProducts);
  els.categorySelect?.addEventListener("change", renderProducts);

  // Product detail modal handlers
  els.btnCloseProduct?.addEventListener("click", () =>
    els.productModal?.close(),
  );
  els.pdGoCart?.addEventListener("click", () => {
    els.productModal?.close();
    openCart();
  });

  // Carousel CTA scroll
  document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-scroll-to");
      const node = document.getElementById(id);
      node?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // If no store selected, prompt immediately
  if (!state.selectedStoreId) {
    openStoresModal(true);
  } else {
    renderStoreList();
  }
}

function openStoresModal(firstTime = false) {
  els.storeModal?.showModal();
  if (firstTime) {
    els.locationStatus.textContent =
      "To show the nearest store first and display distance, allow location. Or choose manually.";
  }
  renderStoreList();
}

// ---------- CAROUSEL ----------
function initCarousel() {
  if (!els.promoTrack || !els.promoDots) return;

  const slideCount = els.promoTrack.children.length;
  let idx = 0;

  els.promoDots.innerHTML = "";
  for (let i = 0; i < slideCount; i++) {
    const b = document.createElement("button");
    b.className = "dotBtn" + (i === 0 ? " active" : "");
    b.addEventListener("click", () => setSlide(i));
    els.promoDots.appendChild(b);
  }

  const setDots = () => {
    [...els.promoDots.children].forEach((d, i) =>
      d.classList.toggle("active", i === idx),
    );
  };

  function setSlide(i) {
    idx = i;
    els.promoTrack.style.transform = `translateX(-${idx * 100}%)`;
    setDots();
  }

  // Swipe support
  let startX = null;
  els.promoTrack.addEventListener(
    "touchstart",
    (e) => (startX = e.touches[0].clientX),
    { passive: true },
  );
  els.promoTrack.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    startX = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) setSlide(Math.min(slideCount - 1, idx + 1));
    else setSlide(Math.max(0, idx - 1));
  });

  // Auto-advance
  setInterval(() => {
    idx = (idx + 1) % slideCount;
    els.promoTrack.style.transform = `translateX(-${idx * 100}%)`;
    setDots();
  }, 6500);

  window.__setPromoSlide = setSlide;
}

// ---------- CATEGORIES ----------
function initCategories() {
  if (!els.categorySelect || !els.categoryChips) return;

  const cats = ["All", ...new Set(PRODUCTS.map((p) => p.category))];

  els.categorySelect.innerHTML = cats
    .map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
    .join("");

  // chips exclude "All"
  els.categoryChips.innerHTML = cats
    .filter((c) => c !== "All")
    .map(
      (c) =>
        `<button class="chip" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`,
    )
    .join("");

  [...els.categoryChips.querySelectorAll(".chip")].forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = btn.getAttribute("data-cat");
      els.categorySelect.value = c;
      renderProducts();
      document
        .getElementById("shop")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// ---------- STORES + LOCATION ----------
async function requestLocationAndSort() {
  if (!els.locationStatus) return;

  els.locationStatus.textContent = "Requesting location…";
  try {
    const pos = await getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    });
    state.userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    els.locationStatus.textContent =
      "Location enabled. Showing nearest stores first.";
    computeDistances();
    renderStoreList();

    // Auto-select nearest if none selected
    if (!state.selectedStoreId) {
      const nearest = getSortedStores()[0];
      if (nearest) selectStore(nearest.id, { silent: true });
    }
  } catch (err) {
    els.locationStatus.textContent =
      "Location denied/unavailable. Please choose a store manually.";
    state.userPos = null;
    state.storeDistances.clear();
    renderStoreList();
  }
}

function getCurrentPosition(options) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation)
      return reject(new Error("Geolocation not supported"));
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function computeDistances() {
  state.storeDistances.clear();
  if (!state.userPos) return;
  for (const s of STORES) {
    const km = haversineKm(state.userPos.lat, state.userPos.lng, s.lat, s.lng);
    state.storeDistances.set(s.id, km);
  }
}

function getSortedStores() {
  const list = [...STORES];
  if (!state.userPos) return list;
  return list.sort(
    (a, b) =>
      (state.storeDistances.get(a.id) ?? 1e9) -
      (state.storeDistances.get(b.id) ?? 1e9),
  );
}

function renderStoreList() {
  if (!els.storeList) return;

  const stores = getSortedStores();
  els.storeList.innerHTML = "";

  for (const s of stores) {
    const km = state.storeDistances.get(s.id);
    const kmLabel = km != null ? `${km.toFixed(1)} km` : "";

    const card = document.createElement("div");
    card.className = "storeCard";

    const left = document.createElement("div");
    left.innerHTML = `
      <strong>${escapeHtml(s.name)}</strong>
      <div class="meta">
        ${escapeHtml(s.address)}<br/>
        <span class="muted">Phone:</span> ${escapeHtml(s.phone)} ·
        <span class="muted">Hours:</span> ${escapeHtml(s.hours)}
      </div>
    `;

    const right = document.createElement("div");
    right.style.display = "grid";
    right.style.gap = "10px";
    right.style.justifyItems = "end";
    right.innerHTML = `
      <div class="km">${escapeHtml(kmLabel)}</div>
      <button class="btn btnGhost">${state.selectedStoreId === s.id ? "Selected" : "Select"}</button>
    `;

    const btn = right.querySelector("button");
    btn.addEventListener("click", () => {
      // If changing store with items in cart, confirm
      if (
        state.selectedStoreId &&
        state.selectedStoreId !== s.id &&
        cartItemCount() > 0
      ) {
        const ok = confirm(
          "Change store? Your cart may not match availability at the new store.\n\nOK = change store (keep cart)\nCancel = stay on current store",
        );
        if (!ok) return;
      }
      selectStore(s.id);
    });

    card.appendChild(left);
    card.appendChild(right);
    els.storeList.appendChild(card);
  }
}

function selectStore(storeId, { silent = false } = {}) {
  state.selectedStoreId = storeId;
  localStorage.setItem(LS.storeId, storeId);
  renderStoreBar();
  renderCartBadge();
  if (!silent) els.storeModal?.close();
}

function renderStoreBar() {
  const s = STORES.find((x) => x.id === state.selectedStoreId);
  if (!s) {
    els.selectedStoreName.textContent = "Choose a store";
    els.selectedStorePhone.textContent = "";
    els.selectedStorePhone.href = "#";
    return;
  }
  els.selectedStoreName.textContent = s.name;
  els.selectedStorePhone.textContent = s.phone;
  els.selectedStorePhone.href = `tel:${s.phone}`;
}

// ---------- PRODUCTS ----------
function renderProducts() {
  if (!els.productGrid) return;

  const q = (els.searchInput?.value || "").trim().toLowerCase();
  const cat = els.categorySelect?.value || "All";

  const filtered = PRODUCTS.filter((p) => {
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.short || "").toLowerCase().includes(q);
    const matchC = cat === "All" || p.category === cat;
    return matchQ && matchC;
  });

  els.productGrid.innerHTML = "";
  for (const p of filtered) {
    const qty = state.cart[p.id] || 0;

    const card = document.createElement("div");
    card.className = "productCard";

    card.innerHTML = `
      <div class="productMedia">
        <img class="productImg" src="${escapeHtml(p.image || "")}" alt="${escapeHtml(p.name)}"
             onerror="this.style.display='none'"/>
        <div style="min-width:0; width:100%;">
          <div class="productTop">
            <div style="min-width:0;">
              <div class="productName">${escapeHtml(p.name)}</div>
              <div class="productMeta">
                ${escapeHtml(p.category)} • ${escapeHtml(p.size)}<br/>
                ${escapeHtml(p.short || "")}
              </div>
            </div>
            <div class="price">฿${p.price}</div>
          </div>

          <div class="qtyRow">
            <div class="qtyCtrl" role="group" aria-label="Quantity selector">
              <button class="qtyBtn" data-action="dec" aria-label="Decrease">–</button>
              <div class="qtyVal" id="qty_${escapeAttr(p.id)}">${qty}</div>
              <button class="qtyBtn" data-action="inc" aria-label="Increase">+</button>
            </div>
            <button class="btn btnGhost" data-action="viewDetail">View</button>
          </div>
        </div>
      </div>
    `;

    const qtyVal = card.querySelector(`#qty_${CSS.escape(p.id)}`);
    card.querySelectorAll(".qtyBtn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-action");
        const next = Math.max(
          0,
          (state.cart[p.id] || 0) + (action === "inc" ? 1 : -1),
        );
        setCartQty(p.id, next);
        qtyVal.textContent = String(next);
      });
    });

    card
      .querySelector('[data-action="viewDetail"]')
      .addEventListener("click", () => openProductDetail(p.id));

    els.productGrid.appendChild(card);
  }
}

// ---------- PRODUCT DETAIL MODAL ----------
function openProductDetail(productId) {
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p || !els.productModal) return;

  els.pdName.textContent = p.name;
  els.pdMeta.textContent = `${p.category} • ${p.size}`;
  els.pdCategory.textContent = p.category;
  els.pdSize.textContent = p.size;
  els.pdPrice.textContent = `฿${p.price}`;
  els.pdDesc.textContent = p.description || p.short || "";

  els.pdImg.src = p.image || "";
  els.pdImg.onerror = () => {
    els.pdImg.style.display = "none";
  };
  els.pdImg.style.display = "";

  const refreshQty = () => {
    els.pdQty.textContent = String(state.cart[p.id] || 0);
  };
  refreshQty();

  els.pdDec.onclick = () => {
    const next = Math.max(0, (state.cart[p.id] || 0) - 1);
    setCartQty(p.id, next);
    refreshQty();
    renderProducts();
  };
  els.pdInc.onclick = () => {
    const next = (state.cart[p.id] || 0) + 1;
    setCartQty(p.id, next);
    refreshQty();
    renderProducts();
  };

  els.productModal.showModal();
}

// ---------- CART ----------
function openCart() {
  const s = STORES.find((x) => x.id === state.selectedStoreId);
  els.cartStoreLine.textContent = s
    ? `Store: ${s.name} • ${s.phone}`
    : "Store not selected (please select a store first)";

  renderCartItems();
  els.cartModal?.showModal();
}

function renderCartItems() {
  if (!els.cartItems) return;

  const items = cartToItems();
  els.cartItems.innerHTML = "";

  if (items.length === 0) {
    els.cartItems.innerHTML = `<div class="muted">Your cart is empty. Add products with +.</div>`;
    return;
  }

  for (const it of items) {
    const row = document.createElement("div");
    row.className = "cartItem";

    row.innerHTML = `
      <div class="cartLeftWrap">
        <img class="cartThumb" src="${escapeHtml(it.image || "")}" alt="${escapeHtml(it.name)}"
             onerror="this.style.display='none'"/>
        <div class="left" style="min-width:0;">
          <div class="title">${escapeHtml(it.name)}</div>
          <div class="sub">
            ${escapeHtml(it.category)} • ${escapeHtml(it.size)} • ฿${it.price} each<br/>
            ${escapeHtml(it.short || "")}
          </div>
        </div>
      </div>
      <div class="qtyCtrl">
        <button class="qtyBtn" data-action="dec" aria-label="Decrease">–</button>
        <div class="qtyVal">${it.qty}</div>
        <button class="qtyBtn" data-action="inc" aria-label="Increase">+</button>
      </div>
    `;

    row.querySelector('[data-action="dec"]').addEventListener("click", () => {
      setCartQty(it.id, Math.max(0, it.qty - 1));
      renderCartItems();
      renderProducts();
    });
    row.querySelector('[data-action="inc"]').addEventListener("click", () => {
      setCartQty(it.id, it.qty + 1);
      renderCartItems();
      renderProducts();
    });

    // tap product area to open detail modal
    row
      .querySelector(".cartLeftWrap")
      .addEventListener("click", () => openProductDetail(it.id));

    els.cartItems.appendChild(row);
  }
}

function setCartQty(productId, qty) {
  if (qty <= 0) delete state.cart[productId];
  else state.cart[productId] = qty;
  saveCart();
  renderCartBadge();
}

function saveCart() {
  localStorage.setItem(LS.cart, JSON.stringify(state.cart));
}

function loadCart() {
  try {
    const raw = localStorage.getItem(LS.cart);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function clearCart() {
  const ok = confirm("Clear all items from cart?");
  if (!ok) return;
  state.cart = {};
  saveCart();
  renderCartBadge();
  renderCartItems();
  renderProducts();
}

function cartItemCount() {
  return Object.values(state.cart).reduce((a, b) => a + b, 0);
}

function cartToItems() {
  const items = [];
  for (const [pid, qty] of Object.entries(state.cart)) {
    const p = PRODUCTS.find((x) => x.id === pid);
    if (!p) continue;
    items.push({ ...p, qty });
  }
  return items;
}

function renderCartBadge() {
  const count = cartItemCount();
  if (els.cartBadge) els.cartBadge.textContent = String(count);
  if (els.bottomTitle)
    els.bottomTitle.textContent = `${count} item${count === 1 ? "" : "s"}`;

  const s = STORES.find((x) => x.id === state.selectedStoreId);
  if (els.bottomSubtitle) {
    els.bottomSubtitle.textContent = s
      ? `Selected store: ${s.name}`
      : "Select a store to send order";
  }
}

// ---------- ORDER SUBMISSION (demo) ----------
function submitOrder() {
  // Edge case: no store
  if (!state.selectedStoreId) {
    alert("Please select a store first.");
    els.cartModal?.close();
    openStoresModal();
    return;
  }

  const name = (els.custName?.value || "").trim();
  const phone = (els.custPhone?.value || "").trim();
  if (!name || !phone) {
    alert("Please fill in Name and Phone.");
    return;
  }

  const items = cartToItems();
  if (items.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const store = STORES.find((s) => s.id === state.selectedStoreId);

  // Create order object
  const orderId = makeOrderId();
  const createdAt = new Date().toISOString();
  const order = {
    id: orderId,
    storeId: state.selectedStoreId,
    storeName: store?.name || "",
    storePhone: store?.phone || "",
    customer: { name, phone },
    fulfillment: els.fulfillment?.value || "pickup",
    preferredTime: (els.preferredTime?.value || "").trim(),
    notes: (els.notes?.value || "").trim(),
    items: items.map((i) => ({
      productId: i.id,
      name: i.name,
      qty: i.qty,
      price: i.price,
      size: i.size,
    })),
    status: "New",
    createdAt,
  };

  // Save order to localStorage (demo store inbox)
  const all = loadOrders();
  if (!all[order.storeId]) all[order.storeId] = [];
  all[order.storeId].unshift(order);
  localStorage.setItem(LS.orders, JSON.stringify(all));

  // Show confirmation
  els.cartModal?.close();
  if (els.confirmLine)
    els.confirmLine.textContent = `Sent to ${store.name}. They will contact you to confirm.`;
  if (els.orderNumber) els.orderNumber.textContent = orderId;
  if (els.btnCallStore) els.btnCallStore.href = `tel:${store.phone}`;
  els.confirmModal?.showModal();

  // Clear cart after sending (per blueprint)
  state.cart = {};
  saveCart();
  renderCartBadge();
  renderProducts();

  // Confirmation modal buttons
  els.btnCloseConfirm &&
    (els.btnCloseConfirm.onclick = () => els.confirmModal?.close());
  els.btnContinueShopping &&
    (els.btnContinueShopping.onclick = () => els.confirmModal?.close());
}

function loadOrders() {
  try {
    const raw = localStorage.getItem(LS.orders);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function makeOrderId() {
  const part = Math.random().toString(16).slice(2, 6).toUpperCase();
  const time = Date.now().toString().slice(-5);
  return `NM-${time}-${part}`;
}

// ---------- UTILS ----------
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function toRad(x) {
  return (x * Math.PI) / 180;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(str) {
  // safe-ish for ids/attributes in templates
  return String(str)
    .replaceAll('"', "")
    .replaceAll("'", "")
    .replaceAll("<", "")
    .replaceAll(">", "");
}
