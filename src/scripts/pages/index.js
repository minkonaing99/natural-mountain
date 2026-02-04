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
  checkoutDraft: "nm_checkout_draft_v1",
  couponGuard: "nm_coupon_guard_v1",
};

const COUPON = {
  code: "87654321",
  discountPercent: 5,
  lockMs: 24 * 60 * 60 * 1000,
};

// Myanmar store list (add lat/lng to enable accurate distance sorting)
let STORES = [
  {
    id: "s1",
    name: "Natural Mountain — Main Branch",
    phone: "09449372253",
    address: "Corner of 61B Street & 111 Street, Mandalay, Myanmar",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s2",
    name: "စိန်ပဒေသာ",
    phone: "09-400 015 130",
    address: "၁၃၆လမ်း နှင့် ၆၂လမ်း၊ ပြည်ကြီးတံခွန်မြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s3",
    name: "Thar Gyi",
    phone: "09-259 959 595",
    address: "၆၅လမ်း နှင့် ၄၁လမ်း၊ မဟာအောင်မြေမြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s4",
    name: "ရွှေကမ္ဘာ",
    phone: "09-889 910 002",
    address: "၈၅လမ်း နှင့် ၃၅လမ်း၊ ချမ်းအေးသာဇံမြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s5",
    name: "နိုင်စတိုး",
    phone: "09-967 786 687",
    address: "၈၂လမ်း၊ ၂၆လမ်း နှင့် ၂၇လမ်းကြား၊ ချမ်းအေးသာဇံမြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s6",
    name: "ဇဗ္ဗူအောင်",
    phone: "09-443 581 710",
    address: "၁၃၃လမ်း နှင့် ၅၆လမ်း၊ ပြည်ကြီးတံခွန်မြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s7",
    name: "ကိုဇော်လတ်",
    phone: "09-443 679 044",
    address: "၇၃လမ်း၊ ၉လမ်း နှင့် ၁၀လမ်းကြား၊ အောင်မြေသာဇံမြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s8",
    name: "ယမင်း",
    phone: "09-772 088 464",
    address: "၆၄လမ်း နှင့် ၄၀လမ်း၊ မဟာအောင်မြေမြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s9",
    name: "လွင်",
    phone: "09-258 377 033",
    address: "ပုသိမ်ကြီးမြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s10",
    name: "ပြည့်ဝ",
    phone: "09-964 640 398",
    address: "ပုသိမ်ကြီးမြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s11",
    name: "ကောင်းသစ်စံ",
    phone: "09-402 546 920",
    address: "ပုသိမ်ကြီးမြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s12",
    name: "မြကံသာ",
    phone: "09-453 801 523",
    address: "၆၂လမ်း နှင့် ၁၉လမ်း၊ အောင်မြေသာဇံမြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s13",
    name: "To To Mart",
    phone: "09-788 782 034",
    address: "၅၅လမ်း၊ ၄၂လမ်း နှင့် ၄၃လမ်းကြား၊ မဟာအောင်မြေမြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s14",
    name: "ရွှေပြည့်ဖြိုး",
    phone: "09-444 021 979",
    address: "၃၀လမ်း၊ ၆၆လမ်း နှင့် ၆၇လမ်းကြား၊ ချမ်းအေးသာဇံမြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s15",
    name: "88 Mart",
    phone: "09-787 558 558",
    address: "၅၈လမ်း၊ ၄၂လမ်း နှင့် ၄၃လမ်းကြား၊ မဟာအောင်မြေမြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s16",
    name: "အောင်ဟိန်း",
    phone: "09-402 013 618",
    address: "၆၂လမ်း၊ ၁၁၅လမ်း နှင့် ၁၁၆လမ်းကြား၊ ပြည်ကြီးတံခွန်မြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
  {
    id: "s17",
    name: "စိမ့်စိမ့်",
    phone: "09-940 554 266",
    address: "၆၅လမ်း နှင့် ၁၀၉လမ်း၊ ချမ်းမြသာစည်မြို့နယ်။",
    lat: null,
    lng: null,
    hours: "08:00-20:00",
  },
];

// Add your real product images under /images
let PRODUCTS = [
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
  selectedTownship: "All",
  isSubmittingOrder: false,
  coupon: {
    applied: false,
    code: "",
    phone: "",
  },
};

// ---------- DOM ----------
const els = {
  // store bar
  selectedStoreName: document.getElementById("selectedStoreName"),
  selectedStorePhone: document.getElementById("selectedStorePhone"),
  headerStoreStatus: document.getElementById("headerStoreStatus"),
  headerStoreName: document.getElementById("headerStoreName"),
  storeBar: document.getElementById("storeBar"),

  // store modal
  btnOpenStores: document.getElementById("btnOpenStores"),
  btnChangeStore: document.getElementById("btnChangeStore"),
  storeModal: document.getElementById("storeModal"),
  btnCloseStores: document.getElementById("btnCloseStores"),
  btnUseLocation: document.getElementById("btnUseLocation"),
  btnManual: document.getElementById("btnManual"),
  btnRetryLocation: document.getElementById("btnRetryLocation"),
  locationStatus: document.getElementById("locationStatus"),
  townshipTags: document.getElementById("townshipTags"),
  storeList: document.getElementById("storeList"),

  // products
  categoryChips: document.getElementById("categoryChips"),
  categorySelect: document.getElementById("categorySelect"),
  sortSelect: document.getElementById("sortSelect"),
  searchInput: document.getElementById("searchInput"),
  activeFilters: document.getElementById("activeFilters"),
  btnClearFilters: document.getElementById("btnClearFilters"),
  productGrid: document.getElementById("productGrid"),

  // cart
  cartModal: document.getElementById("cartModal"),
  btnOpenCart: document.getElementById("btnOpenCart"),
  btnBottomCart: document.getElementById("btnBottomCart"),
  btnCloseCart: document.getElementById("btnCloseCart"),
  cartBadge: document.getElementById("cartBadge"),
  cartItems: document.getElementById("cartItems"),
  cartSelectedCount: document.getElementById("cartSelectedCount"),
  cartSubtotalAmount: document.getElementById("cartSubtotalAmount"),
  cartDeliveryAmount: document.getElementById("cartDeliveryAmount"),
  cartDiscountAmount: document.getElementById("cartDiscountAmount"),
  cartTotalAmount: document.getElementById("cartTotalAmount"),
  trustStorePhone: document.getElementById("trustStorePhone"),
  cartStoreLine: document.getElementById("cartStoreLine"),
  bottomBar: document.getElementById("bottomBar"),
  bottomTitle: document.getElementById("bottomTitle"),
  bottomSubtitle: document.getElementById("bottomSubtitle"),
  btnClearCart: document.getElementById("btnClearCart"),
  btnSendOrder: document.getElementById("btnSendOrder"),

  // customer fields
  custName: document.getElementById("custName"),
  custNameError: document.getElementById("custNameError"),
  custPhone: document.getElementById("custPhone"),
  custPhoneError: document.getElementById("custPhoneError"),
  couponCode: document.getElementById("couponCode"),
  btnApplyCoupon: document.getElementById("btnApplyCoupon"),
  couponError: document.getElementById("couponError"),
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
  orderSuccessMark: document.getElementById("orderSuccessMark"),

  // promo
  promoTrack: document.getElementById("promoTrack"),
  promoDots: document.getElementById("promoDots"),
  promoPrev: document.getElementById("promoPrev"),
  promoNext: document.getElementById("promoNext"),

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

async function init() {
  await loadCatalogData();
  initCarousel();
  initCategories();
  restoreCheckoutDraft();
  updateCouponLockState();
  renderStoreBar();
  renderProducts();
  renderCartBadge();
  updateSendButtonState();

  // Store modal handlers
  els.btnOpenStores?.addEventListener("click", () => openStoresModal());
  els.btnChangeStore?.addEventListener("click", () => openStoresModal());
  els.btnCloseStores?.addEventListener("click", () => els.storeModal?.close());
  els.btnUseLocation?.addEventListener("click", () => requestLocationAndSort());
  els.btnRetryLocation?.addEventListener("click", () => requestLocationAndSort());
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
  els.sortSelect?.addEventListener("change", renderProducts);
  els.btnClearFilters?.addEventListener("click", clearFilters);

  // Product detail modal handlers
  els.btnCloseProduct?.addEventListener("click", () =>
    els.productModal?.close(),
  );
  els.pdGoCart?.addEventListener("click", () => {
    els.productModal?.close();
    openCart();
  });

  // Checkout validation
  els.custName?.addEventListener("input", () => {
    saveCheckoutDraft();
    validateCheckout({ showErrors: false });
    updateSendButtonState();
  });
  els.custPhone?.addEventListener("input", () => {
    const currentPhone = normalizePhone(els.custPhone?.value || "");
    if (state.coupon.applied && state.coupon.phone !== currentPhone) {
      resetCouponState();
    }
    updateCouponLockState();
    saveCheckoutDraft();
    validateCheckout({ showErrors: false });
    updateSendButtonState();
  });
  els.couponCode?.addEventListener("input", () => {
    if (els.couponError) els.couponError.textContent = "";
    saveCheckoutDraft();
  });
  els.btnApplyCoupon?.addEventListener("click", applyCouponCode);
  els.fulfillment?.addEventListener("change", () => {
    saveCheckoutDraft();
    renderCartSummary(cartToItems());
  });
  els.preferredTime?.addEventListener("input", saveCheckoutDraft);
  els.notes?.addEventListener("input", saveCheckoutDraft);

  // Carousel CTA scroll
  document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget;
      const id = target.getAttribute("data-scroll-to");
      const cat = target.getAttribute("data-cat");
      const q = target.getAttribute("data-query");
      if (cat && els.categorySelect) {
        els.categorySelect.value = cat;
      }
      if (els.searchInput) {
        els.searchInput.value = q || "";
      }
      if (els.sortSelect) els.sortSelect.value = "popular";
      renderProducts();
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

async function loadCatalogData() {
  const [storesData, productsData] = await Promise.all([
    fetchJsonSafe("./data/stores.json"),
    fetchJsonSafe("./data/products.json"),
  ]);

  if (Array.isArray(storesData) && storesData.length) {
    STORES = storesData;
  }
  if (Array.isArray(productsData) && productsData.length) {
    PRODUCTS = productsData;
  }

  // Clear stale selected store if it no longer exists in external data
  if (
    state.selectedStoreId &&
    !STORES.some((s) => s.id === state.selectedStoreId)
  ) {
    state.selectedStoreId = null;
    localStorage.removeItem(LS.storeId);
  }
}

async function fetchJsonSafe(path) {
  try {
    const r = await fetch(path, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch (err) {
    console.warn(`[Natural Mountain] Could not load ${path}, using in-code fallback.`);
    return null;
  }
}

function openStoresModal(firstTime = false) {
  els.storeModal?.showModal();
  updateLocationButtonVisual();
  if (firstTime) {
    els.locationStatus.textContent =
      "To show the nearest store first and display distance, allow location. Or choose manually.";
  }
  renderTownshipTags();
  renderStoreList();
}

// ---------- CAROUSEL ----------
function initCarousel() {
  if (!els.promoTrack || !els.promoDots) return;

  const slideCount = els.promoTrack.children.length;
  let idx = 0;
  let autoTimer = null;

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
    idx = (i + slideCount) % slideCount;
    els.promoTrack.style.transform = `translateX(-${idx * 100}%)`;
    setDots();
  }

  els.promoPrev?.addEventListener("click", () => setSlide(idx - 1));
  els.promoNext?.addEventListener("click", () => setSlide(idx + 1));

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
    if (dx < 0) setSlide(idx + 1);
    else setSlide(idx - 1);
  });

  // Auto-advance (pause on hover)
  const startAuto = () => {
    if (autoTimer) return;
    autoTimer = setInterval(() => {
      setSlide(idx + 1);
    }, 6500);
  };
  const stopAuto = () => {
    if (!autoTimer) return;
    clearInterval(autoTimer);
    autoTimer = null;
  };
  startAuto();
  els.promoTrack.addEventListener("mouseenter", stopAuto);
  els.promoTrack.addEventListener("mouseleave", startAuto);

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

function clearFilters() {
  if (els.searchInput) els.searchInput.value = "";
  if (els.categorySelect) els.categorySelect.value = "All";
  if (els.sortSelect) els.sortSelect.value = "popular";
  renderProducts();
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
    updateLocationButtonVisual();
    computeDistances();
    renderStoreList();

    // Auto-select nearest if none selected
    if (!state.selectedStoreId) {
      const nearest = getSortedStores()[0];
      if (nearest) selectStore(nearest.id, { silent: true });
    }
  } catch (err) {
    els.locationStatus.textContent =
      "Location denied/unavailable. Retry location or choose manually.";
    state.userPos = null;
    state.storeDistances.clear();
    updateLocationButtonVisual();
    renderStoreList();
  }
}

function updateLocationButtonVisual() {
  els.btnUseLocation?.classList.toggle("active", !!state.userPos);
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
    if (typeof s.lat !== "number" || typeof s.lng !== "number") continue;
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

  const stores = getSortedStores().filter((s) => {
    const township = getTownshipFromAddress(s.address);
    return state.selectedTownship === "All" || township === state.selectedTownship;
  });
  els.storeList.innerHTML = "";

  if (!stores.length) {
    els.storeList.innerHTML =
      '<div class="muted">No stores found for this township filter.</div>';
    return;
  }

  for (const s of stores) {
    const km = state.storeDistances.get(s.id);
    const kmLabel = km != null ? `${km.toFixed(1)} km` : "";
    const township = getTownshipFromAddress(s.address);

    const card = document.createElement("div");
    card.className = "storeCard";

    const left = document.createElement("div");
    const mapUrl = buildStoreMapUrl(s);
    left.innerHTML = `
      <strong><a class="storeMapLink" href="${escapeAttr(mapUrl)}" target="_blank" rel="noopener">${escapeHtml(s.name)}</a></strong>
      <div class="meta">
        ${escapeHtml(s.address)}<br/>
        <span class="muted">Phone:</span> ${escapeHtml(s.phone)} ·
        <span class="muted">Hours:</span> ${escapeHtml(s.hours)} ·
        <span class="muted">Township:</span> ${escapeHtml(township)}
      </div>
    `;

    const right = document.createElement("div");
    right.style.display = "grid";
    right.style.gap = "10px";
    right.style.justifyItems = "end";
    right.innerHTML = `
      <div class="km">${escapeHtml(kmLabel)}</div>
      <button class="btn btnGhost${state.selectedStoreId === s.id ? " is-selected" : ""}">${state.selectedStoreId === s.id ? "Selected" : "Select"}</button>
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

function renderTownshipTags() {
  if (!els.townshipTags) return;
  const allTownships = ["All", ...new Set(STORES.map((s) => getTownshipFromAddress(s.address)))];
  els.townshipTags.innerHTML = allTownships
    .map(
      (t) =>
        `<button class="chip${state.selectedTownship === t ? " active" : ""}${containsMyanmar(t) ? " mm" : ""}" data-township="${escapeAttr(t)}">${escapeHtml(
          t,
        )}</button>`,
    )
    .join("");
  els.townshipTags.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedTownship = btn.getAttribute("data-township") || "All";
      renderTownshipTags();
      renderStoreList();
    });
  });
}

function selectStore(storeId, { silent = false } = {}) {
  state.selectedStoreId = storeId;
  localStorage.setItem(LS.storeId, storeId);
  renderStoreBar();
  renderCartBadge();
  updateSendButtonState();
  if (!silent) els.storeModal?.close();
}

function renderStoreBar() {
  const s = STORES.find((x) => x.id === state.selectedStoreId);
  if (!s) {
    els.selectedStoreName.textContent = "Choose a store";
    els.selectedStorePhone.textContent = "";
    els.selectedStorePhone.href = "#";
    if (els.headerStoreName) els.headerStoreName.textContent = "Store not selected";
    els.headerStoreStatus?.classList.remove("active");
    if (els.trustStorePhone) els.trustStorePhone.textContent = "-";
    updateSendButtonState();
    return;
  }
  els.selectedStoreName.textContent = s.name;
  els.selectedStorePhone.textContent = s.phone;
  els.selectedStorePhone.href = `tel:${s.phone}`;
  if (els.headerStoreName) els.headerStoreName.textContent = s.name;
  els.headerStoreStatus?.classList.add("active");
  if (els.trustStorePhone) els.trustStorePhone.textContent = s.phone;
  updateSendButtonState();
}

// ---------- PRODUCTS ----------
function renderProducts() {
  if (!els.productGrid) return;

  const q = (els.searchInput?.value || "").trim().toLowerCase();
  const cat = els.categorySelect?.value || "All";
  const sortBy = els.sortSelect?.value || "popular";

  const filtered = PRODUCTS.filter((p) => {
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.short || "").toLowerCase().includes(q);
    const matchC = cat === "All" || p.category === cat;
    return matchQ && matchC;
  });
  const sorted = sortProducts(filtered, sortBy);
  renderFilterPills({ q, cat, sortBy });
  updateCategoryChipActive(cat);

  els.productGrid.innerHTML = "";
  if (!sorted.length) {
    els.productGrid.innerHTML =
      '<div class="muted">No products found. Try another filter or clear all.</div>';
    return;
  }

  for (const p of sorted) {
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

function sortProducts(items, sortBy) {
  const list = [...items];
  if (sortBy === "price") return list.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
  if (sortBy === "new") {
    return list.sort((a, b) => {
      const aNew = a.category === "New" ? 0 : 1;
      const bNew = b.category === "New" ? 0 : 1;
      if (aNew !== bNew) return aNew - bNew;
      return getProductIndex(b.id) - getProductIndex(a.id);
    });
  }
  return list.sort((a, b) => getProductIndex(a.id) - getProductIndex(b.id));
}

function renderFilterPills({ q, cat, sortBy }) {
  if (!els.activeFilters || !els.btnClearFilters) return;
  const pills = [];
  if (cat !== "All") pills.push({ type: "category", label: `${cat} ×` });
  if (q) pills.push({ type: "search", label: `Search: ${q} ×` });
  if (sortBy !== "popular")
    pills.push({
      type: "sort",
      label: `Sort: ${sortBy === "price" ? "Price" : "New"} ×`,
    });

  els.activeFilters.innerHTML = pills
    .map(
      (p) =>
        `<button class="filterPill" data-filter="${escapeAttr(p.type)}" type="button">${escapeHtml(
          p.label,
        )}</button>`,
    )
    .join("");
  els.btnClearFilters.style.display = pills.length ? "inline-flex" : "none";

  els.activeFilters.querySelectorAll(".filterPill").forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      if (filter === "category" && els.categorySelect) els.categorySelect.value = "All";
      if (filter === "search" && els.searchInput) els.searchInput.value = "";
      if (filter === "sort" && els.sortSelect) els.sortSelect.value = "popular";
      renderProducts();
    });
  });
}

function updateCategoryChipActive(cat) {
  els.categoryChips?.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.getAttribute("data-cat") === cat);
  });
}

function getProductIndex(productId) {
  const idx = PRODUCTS.findIndex((p) => p.id === productId);
  return idx === -1 ? 9999 : idx;
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
  if (els.trustStorePhone) {
    els.trustStorePhone.textContent = s ? s.phone : "-";
  }

  renderCartItems();
  updateCouponLockState();
  validateCheckout({ showErrors: false });
  updateSendButtonState();
  els.cartModal?.showModal();
}

function renderCartItems() {
  if (!els.cartItems) return;

  const items = cartToItems();
  els.cartItems.innerHTML = "";
  renderCartSummary(items);

  if (items.length === 0) {
    els.cartItems.innerHTML = `
      <div class="emptyState">
        <div class="muted">No items yet. Add products to continue checkout.</div>
        <button class="btn btnGhost btnSm" id="btnStartShopping" type="button">Start shopping</button>
      </div>
    `;
    els.cartItems.querySelector("#btnStartShopping")?.addEventListener("click", () => {
      els.cartModal?.close();
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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

function renderCartSummary(items) {
  const selectedCount = items.reduce((sum, it) => sum + it.qty, 0);
  const subtotal = items.reduce((sum, it) => sum + it.qty * it.price, 0);
  const delivery = 0;
  const discount = getAppliedDiscount(subtotal);
  const total = subtotal + delivery - discount;

  if (els.cartSelectedCount) els.cartSelectedCount.textContent = String(selectedCount);
  if (els.cartSubtotalAmount) els.cartSubtotalAmount.textContent = `฿${subtotal}`;
  if (els.cartDeliveryAmount) els.cartDeliveryAmount.textContent = `฿${delivery}`;
  if (els.cartDiscountAmount) els.cartDiscountAmount.textContent = `฿${discount}`;
  if (els.cartTotalAmount) els.cartTotalAmount.textContent = `฿${total}`;
  updateSendButtonState();
}

function setCartQty(productId, qty) {
  if (qty <= 0) delete state.cart[productId];
  else state.cart[productId] = qty;
  saveCart();
  renderCartBadge();
  updateSendButtonState();
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
  updateSendButtonState();
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

function validateCheckout({ showErrors = false } = {}) {
  const name = (els.custName?.value || "").trim();
  const phoneRaw = (els.custPhone?.value || "").trim();
  const phoneDigits = phoneRaw.replace(/\D/g, "");

  const validName = name.length >= 2;
  const validPhone = phoneDigits.length >= 7;

  if (els.custNameError) {
    if (!validName && (showErrors || name.length > 0))
      els.custNameError.textContent = "Please enter your full name.";
    else els.custNameError.textContent = "";
  }
  if (els.custPhoneError) {
    if (!validPhone && (showErrors || phoneRaw.length > 0))
      els.custPhoneError.textContent = "Please enter a valid phone number.";
    else els.custPhoneError.textContent = "";
  }

  return validName && validPhone;
}

function updateSendButtonState() {
  if (!els.btnSendOrder) return;
  const hasStore = !!state.selectedStoreId;
  const hasItems = cartItemCount() > 0;
  const validForm = validateCheckout({ showErrors: false });
  els.btnSendOrder.disabled = state.isSubmittingOrder || !(hasStore && hasItems && validForm);
}

function applyCouponCode() {
  const phoneDigits = normalizePhone(els.custPhone?.value || "");
  if (phoneDigits.length < 7) {
    if (els.couponError)
      els.couponError.textContent = "Enter phone first, then apply coupon.";
    return;
  }
  if (isCouponLocked(phoneDigits)) {
    updateCouponLockState();
    return;
  }

  const code = (els.couponCode?.value || "").trim();
  if (code === COUPON.code) {
    state.coupon = { applied: true, code, phone: phoneDigits };
    clearCouponAttempts(phoneDigits);
    if (els.couponError) {
      els.couponError.style.color = "var(--green)";
      els.couponError.textContent = `Coupon applied: -${COUPON.discountPercent}%`;
    }
    saveCheckoutDraft();
    renderCartSummary(cartToItems());
    return;
  }

  registerCouponFailure(phoneDigits);
  resetCouponState({ keepCode: true });
  if (isCouponLocked(phoneDigits)) {
    updateCouponLockState();
    return;
  }
  if (els.couponError) {
    const left = Math.max(0, 3 - getCouponFailureCount(phoneDigits));
    els.couponError.style.color = "var(--danger)";
    els.couponError.textContent = `Invalid coupon. ${left} attempt${left === 1 ? "" : "s"} left.`;
  }
}

function resetCouponState({ keepCode = false } = {}) {
  state.coupon.applied = false;
  state.coupon.code = "";
  state.coupon.phone = "";
  if (!keepCode && els.couponCode) els.couponCode.value = "";
  if (els.couponError) {
    els.couponError.style.color = "var(--danger)";
  }
  renderCartSummary(cartToItems());
  saveCheckoutDraft();
}

function getAppliedDiscount(subtotal) {
  if (!state.coupon.applied) return 0;
  const phoneDigits = normalizePhone(els.custPhone?.value || "");
  if (!phoneDigits || phoneDigits !== state.coupon.phone) return 0;
  return Math.round((subtotal * COUPON.discountPercent) / 100);
}

function normalizePhone(v) {
  return String(v || "").replace(/\D/g, "");
}

function loadCouponGuard() {
  try {
    const raw = localStorage.getItem(LS.couponGuard);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCouponGuard(data) {
  localStorage.setItem(LS.couponGuard, JSON.stringify(data));
}

function getCouponFailureCount(phoneDigits) {
  const data = loadCouponGuard();
  return data[phoneDigits]?.fails || 0;
}

function isCouponLocked(phoneDigits) {
  if (!phoneDigits) return false;
  const data = loadCouponGuard();
  const lockUntil = data[phoneDigits]?.lockUntil || 0;
  return lockUntil > Date.now();
}

function clearCouponAttempts(phoneDigits) {
  if (!phoneDigits) return;
  const data = loadCouponGuard();
  if (!data[phoneDigits]) return;
  data[phoneDigits].fails = 0;
  data[phoneDigits].lockUntil = 0;
  saveCouponGuard(data);
}

function registerCouponFailure(phoneDigits) {
  if (!phoneDigits) return;
  const data = loadCouponGuard();
  const entry = data[phoneDigits] || { fails: 0, lockUntil: 0 };
  if (entry.lockUntil > Date.now()) {
    data[phoneDigits] = entry;
    saveCouponGuard(data);
    return;
  }
  entry.fails += 1;
  if (entry.fails >= 3) {
    entry.lockUntil = Date.now() + COUPON.lockMs;
    entry.fails = 0;
  }
  data[phoneDigits] = entry;
  saveCouponGuard(data);
}

function updateCouponLockState() {
  const phoneDigits = normalizePhone(els.custPhone?.value || "");
  const locked = isCouponLocked(phoneDigits);

  if (els.couponCode) els.couponCode.disabled = locked;
  if (els.btnApplyCoupon) els.btnApplyCoupon.disabled = locked;

  if (!els.couponError) return;
  if (locked) {
    const data = loadCouponGuard();
    const until = new Date(data[phoneDigits].lockUntil);
    els.couponError.style.color = "var(--danger)";
    els.couponError.textContent = `Coupon disabled for this phone until ${until.toLocaleString()}.`;
  } else if (!state.coupon.applied) {
    els.couponError.style.color = "var(--danger)";
    els.couponError.textContent = "";
  } else {
    els.couponError.style.color = "var(--green)";
    els.couponError.textContent = `Coupon applied: -${COUPON.discountPercent}%`;
  }
}

// ---------- ORDER SUBMISSION (demo) ----------
async function submitOrder() {
  if (state.isSubmittingOrder) return;

  // Edge case: no store
  if (!state.selectedStoreId) {
    els.cartStoreLine.textContent = "Please select a store before sending request.";
    els.cartModal?.close();
    openStoresModal();
    return;
  }

  if (!validateCheckout({ showErrors: true })) {
    updateSendButtonState();
    return;
  }
  const name = (els.custName?.value || "").trim();
  const phone = (els.custPhone?.value || "").trim();

  const items = cartToItems();
  if (items.length === 0) {
    els.cartStoreLine.textContent = "Your cart is empty. Add products before checkout.";
    updateSendButtonState();
    return;
  }

  setSendOrderMicrostate("loading");
  await sleep(550);
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const couponDiscount = getAppliedDiscount(subtotal);

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
    coupon: state.coupon.applied ? { code: state.coupon.code, discount: couponDiscount } : null,
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

  // Save order to JSON via local API
  try {
    await saveOrder(order);
  } catch (err) {
    setSendOrderMicrostate("idle");
    els.cartStoreLine.textContent =
      "Could not save order. Please try again (make sure local server is running).";
    return;
  }

  // Show confirmation
  setSendOrderMicrostate("success");
  await sleep(350);
  els.cartModal?.close();
  if (els.confirmLine)
    els.confirmLine.textContent = `Sent to ${store.name}. They will contact you to confirm.`;
  if (els.orderNumber) els.orderNumber.textContent = orderId;
  if (els.btnCallStore) els.btnCallStore.href = `tel:${store.phone}`;
  els.confirmModal?.showModal();

  // Clear cart after sending (per blueprint)
  state.cart = {};
  saveCart();
  clearCheckoutDraft();
  renderCartBadge();
  renderProducts();
  renderCartItems();
  setSendOrderMicrostate("idle");
  updateSendButtonState();

  // Confirmation modal buttons
  els.btnCloseConfirm &&
    (els.btnCloseConfirm.onclick = () => els.confirmModal?.close());
  els.btnContinueShopping &&
    (els.btnContinueShopping.onclick = () => els.confirmModal?.close());
}

function setSendOrderMicrostate(mode) {
  if (!els.btnSendOrder) return;
  state.isSubmittingOrder = mode === "loading";
  els.btnSendOrder.classList.toggle("is-loading", mode === "loading");
  els.btnSendOrder.classList.toggle("is-success", mode === "success");
  const label = els.btnSendOrder.querySelector(".btnLabel");
  if (label) {
    if (mode === "loading") label.textContent = "Sending…";
    else if (mode === "success") label.textContent = "Request Sent";
    else label.textContent = "Send Request";
  }
  updateSendButtonState();
}

function saveCheckoutDraft() {
  const draft = {
    name: els.custName?.value || "",
    phone: els.custPhone?.value || "",
    couponCode: els.couponCode?.value || "",
    couponApplied: state.coupon.applied,
    couponPhone: state.coupon.phone || "",
    fulfillment: els.fulfillment?.value || "pickup",
    preferredTime: els.preferredTime?.value || "",
    notes: els.notes?.value || "",
  };
  localStorage.setItem(LS.checkoutDraft, JSON.stringify(draft));
}

function restoreCheckoutDraft() {
  try {
    const raw = localStorage.getItem(LS.checkoutDraft);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (els.custName) els.custName.value = d.name || "";
    if (els.custPhone) els.custPhone.value = d.phone || "";
    if (els.couponCode) els.couponCode.value = d.couponCode || "";
    const phoneDigits = normalizePhone(d.phone || "");
    if (d.couponApplied && d.couponCode === COUPON.code && phoneDigits && phoneDigits === d.couponPhone) {
      state.coupon = { applied: true, code: d.couponCode, phone: d.couponPhone };
      if (els.couponError) {
        els.couponError.style.color = "var(--green)";
        els.couponError.textContent = `Coupon applied: -${COUPON.discountPercent}%`;
      }
    }
    if (els.fulfillment) els.fulfillment.value = d.fulfillment || "pickup";
    if (els.preferredTime) els.preferredTime.value = d.preferredTime || "";
    if (els.notes) els.notes.value = d.notes || "";
    renderCartSummary(cartToItems());
  } catch {
    // ignore invalid draft
  }
}

function clearCheckoutDraft() {
  localStorage.removeItem(LS.checkoutDraft);
  if (els.custName) els.custName.value = "";
  if (els.custPhone) els.custPhone.value = "";
  if (els.couponCode) els.couponCode.value = "";
  if (els.fulfillment) els.fulfillment.value = "pickup";
  if (els.preferredTime) els.preferredTime.value = "";
  if (els.notes) els.notes.value = "";
  if (els.custNameError) els.custNameError.textContent = "";
  if (els.custPhoneError) els.custPhoneError.textContent = "";
  if (els.couponError) els.couponError.textContent = "";
  state.coupon = { applied: false, code: "", phone: "" };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function saveOrder(order) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error(`Failed to save order: ${res.status}`);
}

function makeOrderId() {
  const part = Math.random().toString(16).slice(2, 6).toUpperCase();
  const time = Date.now().toString().slice(-5);
  return `NM-${time}-${part}`;
}

// ---------- UTILS ----------
function getTownshipFromAddress(address = "") {
  const m = address.match(/([^\s၊,]+မြို့နယ်)/);
  return m?.[1] || "Other";
}

function buildStoreMapUrl(store) {
  if (store.mapUrl && typeof store.mapUrl === "string") {
    return store.mapUrl;
  }
  if (typeof store.lat === "number" && typeof store.lng === "number") {
    return `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
  }
  // Demo fallback location (Mandalay center) until per-store coordinates are added
  const demoLat = 21.9588;
  const demoLng = 96.0891;
  const label = encodeURIComponent(`${store.name}, Mandalay, Myanmar`);
  return `https://www.google.com/maps/search/?api=1&query=${demoLat},${demoLng}(${label})`;
}

function containsMyanmar(text = "") {
  return /[\u1000-\u109F]/.test(text);
}

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
