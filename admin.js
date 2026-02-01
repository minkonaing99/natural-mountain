const LS = {
  orders: "nm_orders_v1",
};

const STORES = [
  { id: "s1", name: "Natural Mountain — Downtown" },
  { id: "s2", name: "Natural Mountain — Riverside" },
  { id: "s3", name: "Natural Mountain — North Plaza" },
  { id: "s4", name: "Natural Mountain — East Market" },
  { id: "s5", name: "Natural Mountain — West Gate" },
  { id: "s6", name: "Natural Mountain — Central Park" },
  { id: "s7", name: "Natural Mountain — Airport Link" },
  { id: "s8", name: "Natural Mountain — Campus" },
];

const els = {
  storeSelect: document.getElementById("storeSelect"),
  btnRefresh: document.getElementById("btnRefresh"),
  ordersList: document.getElementById("ordersList"),
  countLine: document.getElementById("countLine"),
};

init();

function init() {
  els.storeSelect.innerHTML = STORES.map(
    (s) => `<option value="${s.id}">${s.name}</option>`,
  ).join("");
  els.btnRefresh.addEventListener("click", render);
  els.storeSelect.addEventListener("change", render);
  render();
}

function render() {
  const storeId = els.storeSelect.value;
  const all = loadOrders();
  const list = all[storeId] || [];
  els.countLine.textContent = `${list.length} order(s)`;

  els.ordersList.innerHTML = "";
  if (list.length === 0) {
    els.ordersList.innerHTML = `<div class="muted">No orders yet.</div>`;
    return;
  }

  for (const o of list) {
    const card = document.createElement("div");
    card.className = "storeCard";
    const itemsText = o.items
      .map((it) => `${it.qty} × ${it.name}`)
      .join("<br/>");

    card.innerHTML = `
      <div>
        <strong>${escapeHtml(o.id)} • ${escapeHtml(o.status)}</strong>
        <div class="meta">
          <span class="muted">Customer:</span> ${escapeHtml(o.customer.name)} • ${escapeHtml(o.customer.phone)}<br/>
          <span class="muted">Fulfillment:</span> ${escapeHtml(o.fulfillment)} ${o.preferredTime ? "• " + escapeHtml(o.preferredTime) : ""}<br/>
          <span class="muted">Items:</span><br/>${itemsText}<br/>
          ${o.notes ? `<span class="muted">Notes:</span> ${escapeHtml(o.notes)}<br/>` : ""}
          <span class="muted">Time:</span> ${escapeHtml(new Date(o.createdAt).toLocaleString())}
        </div>
      </div>
      <div style="display:grid; gap:10px; justify-items:end;">
        <a class="btn btnGhost" href="tel:${escapeHtml(o.customer.phone)}">Call</a>
      </div>
    `;
    els.ordersList.appendChild(card);
  }
}

function loadOrders() {
  try {
    const raw = localStorage.getItem(LS.orders);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
