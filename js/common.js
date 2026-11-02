/* Shared UI: icons, header/nav, toast, sheets, persistent cart store */

const ICONS = {
  logo: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M10 6h28M10 42h22M6 10v28M42 10v20" opacity=".9"/>
    <path d="M14 38C18 28 24 20 36 12"/>
    <path d="M20 29c-4-1-6-4-6-8 4 0 6 3 6 8z" fill="currentColor" fill-opacity=".25"/>
    <path d="M24 24c0-4 2-7 6-8 0 4-2 7-6 8z" fill="currentColor" fill-opacity=".25"/>
    <path d="M27 21c-3-2-4-5-3-9 3 1 4 5 3 9z" fill="currentColor" fill-opacity=".25"/>
    <path d="M31 18c2-3 5-4 8-3-1 3-4 4-8 3z" fill="currentColor" fill-opacity=".25"/>
    <path d="M18 33c3 2 7 2 10 0-3-2-7-2-10 0z" fill="currentColor" fill-opacity=".25"/>
    <circle cx="35" cy="24" r="1.4" fill="currentColor"/><circle cx="38" cy="28" r="1.1" fill="currentColor"/><circle cx="15" cy="16" r="1.2" fill="currentColor"/>
  </svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`,
  tray: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17h16M6 17a6 6 0 0 1 12 0M12 9V7M10 7h4"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v8a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M8 13v8M16 21V3c-2 1-3 4-3 8h3"/></svg>`,
  shop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10l2 4H5l2-4z"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"/><path d="M10 12h4"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  bean: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><ellipse cx="12" cy="12" rx="6" ry="8.5" transform="rotate(30 12 12)"/><path d="M9 6c3 3 3 9 6 12"/></svg>`,
  truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>`,
  fire: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c4 0 7-3 7-7 0-5-5-7-5-11-3 2-4 5-4 7-1-1-2-2-2-4-2 2-3 5-3 8 0 4 3 7 7 7z"/></svg>`,
  gift: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="12" rx="1"/><path d="M12 9v12M3 13h18M12 9C10 5 6 5 7 8c.5 1 5 1 5 1zm0 0c2-4 6-4 5-1-.5 1-5 1-5 1z"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19 13 11"/></svg>`,
};

const TAG_LABEL = { signature: "★ Signature", fasting: "Fasting", veg: "Veg", spicy: "Spicy" };

const fmt = (n) => (n == null ? "Ask staff" : n.toLocaleString("en-US"));
const priceHTML = (n) => (n == null ? `<span class="price">Ask staff</span>` : `<span class="price">${fmt(n)}<small>ETB</small></span>`);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Header + bottom nav ---------- */
function mountChrome(active, { actionIcon, actionLabel } = {}) {
  const links = [
    { id: "menu", href: "index.html", label: "Menu", icon: ICONS.menu },
    { id: "shop", href: "shop.html", label: "Coffee Shop", icon: ICONS.shop },
  ];
  const header = document.createElement("header");
  header.className = "topbar";
  header.innerHTML = `
    <div class="container">
      <a class="brand" href="index.html" aria-label="LIMU Coffee home">
        <span class="brand-mark">${ICONS.logo}</span>
        <span class="brand-text"><b>LIMU</b><small>COFFEE</small></span>
      </a>
      <nav class="top-links" aria-label="Primary">
        ${links.map((l) => `<a href="${l.href}" class="${l.id === active ? "active" : ""}">${l.label}</a>`).join("")}
      </nav>
      <div class="top-actions">
        ${actionIcon ? `<button class="icon-btn" id="headerAction" aria-label="${actionLabel}">${actionIcon}<span class="badge-count" id="headerCount">0</span></button>` : ""}
      </div>
    </div>`;
  document.body.prepend(header);

  const bottom = document.createElement("nav");
  bottom.className = "bottom-nav";
  bottom.setAttribute("aria-label", "Primary");
  bottom.innerHTML = links
    .map((l) => `<a href="${l.href}" class="${l.id === active ? "active" : ""}">${l.icon}<span>${l.label.replace("Coffee ", "")}</span></a>`)
    .join("");
  document.body.append(bottom);

  const onScroll = () => header.classList.toggle("solid", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  setTimeout(setupReveal, 0); // after page scripts render their content
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  let t = $(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    document.body.append(t);
  }
  t.innerHTML = `${ICONS.check}<span>${esc(msg)}</span>`;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- Bottom sheet ---------- */
const Sheet = (() => {
  let scrim, sheet, onClose;
  function ensure() {
    if (sheet) return;
    scrim = document.createElement("div");
    scrim.className = "scrim";
    sheet = document.createElement("div");
    sheet.className = "sheet";
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    document.body.append(scrim, sheet);
    scrim.addEventListener("click", close);
    addEventListener("keydown", (e) => e.key === "Escape" && close());
    // swipe down to dismiss (mobile)
    let y0 = null;
    sheet.addEventListener("touchstart", (e) => { if (sheet.scrollTop <= 0) y0 = e.touches[0].clientY; }, { passive: true });
    sheet.addEventListener("touchmove", (e) => {
      if (y0 == null) return;
      const dy = e.touches[0].clientY - y0;
      if (dy > 0 && innerWidth < 720) sheet.style.transform = `translateY(${dy}px)`;
    }, { passive: true });
    sheet.addEventListener("touchend", (e) => {
      if (y0 == null) return;
      const dy = e.changedTouches[0].clientY - y0;
      sheet.style.transform = "";
      y0 = null;
      if (dy > 110 && innerWidth < 720) close();
    });
  }
  function open(html, closeCb) {
    ensure();
    sheet.innerHTML = `<div class="sheet-grip"></div><button class="sheet-close" aria-label="Close">${ICONS.close}</button>${html}`;
    sheet.scrollTop = 0;
    $(".sheet-close", sheet).onclick = close;
    onClose = closeCb;
    requestAnimationFrame(() => { scrim.classList.add("open"); sheet.classList.add("open"); });
    document.body.classList.add("locked");
    return sheet;
  }
  function close() {
    if (!sheet || !sheet.classList.contains("open")) return;
    scrim.classList.remove("open");
    sheet.classList.remove("open");
    document.body.classList.remove("locked");
    onClose && onClose();
  }
  return { open, close, get el() { return sheet; }, isOpen: () => !!sheet && sheet.classList.contains("open") };
})();

/* ---------- Persistent cart ---------- */
function createStore(key) {
  let items = [];
  try { items = JSON.parse(localStorage.getItem(key)) || []; } catch (e) { items = []; }
  const subs = new Set();
  const save = () => {
    try { localStorage.setItem(key, JSON.stringify(items)); } catch (e) { /* storage unavailable */ }
    subs.forEach((fn) => fn(items));
  };
  return {
    get items() { return items; },
    count: () => items.reduce((a, i) => a + i.qty, 0),
    total: () => items.reduce((a, i) => a + (i.price || 0) * i.qty, 0),
    qtyOf: (id) => items.filter((i) => i.id === id).reduce((a, i) => a + i.qty, 0),
    add(item, qty = 1) {
      const found = items.find((i) => i.key === item.key);
      if (found) found.qty += qty; else items.push({ ...item, qty });
      save();
    },
    setQty(key, qty) {
      const it = items.find((i) => i.key === key);
      if (!it) return;
      it.qty = qty;
      if (qty <= 0) items = items.filter((i) => i.key !== key);
      save();
    },
    clear() { items = []; save(); },
    subscribe(fn) { subs.add(fn); fn(items); },
  };
}

function bindCountBadge(store, el) {
  let last = store.count();
  store.subscribe(() => {
    const c = store.count();
    el.textContent = c;
    el.classList.toggle("show", c > 0);
    if (c > last) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    last = c;
  });
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$(".reveal").forEach((e) => io.observe(e));
}

function footerHTML() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="brand-mark">${ICONS.logo}</div>
      <p class="script">Thank you</p>
      <p class="sub">for coming · LIMU Coffee</p>
      <div class="footer-links">
        <a class="btn btn-ghost" href="index.html">Menu</a>
        <a class="btn btn-ghost" href="shop.html">Coffee Shop</a>
      </div>
      <div class="divider">${ICONS.bean}</div>
      <small>Prices in Ethiopian Birr (ETB) · Menu and prices may change<br>Food photos: Unsplash &amp; Wikimedia Commons (CC BY / CC BY-SA) — see CREDITS.md</small>
    </div>
  </footer>`;
}
