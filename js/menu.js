/* Menu page */
const order = createStore("limu-order");
mountChrome("menu", { actionIcon: ICONS.tray, actionLabel: "My selection" });
$$("[data-icon]").forEach((el) => (el.innerHTML = ICONS[el.dataset.icon]));
$("#footer").outerHTML = footerHTML();

// give every item a stable id + category reference
const ALL = MENU.flatMap((cat) => cat.items.map((it, i) => Object.assign(it, { id: `${cat.id}-${i}`, cat })));
const byId = Object.fromEntries(ALL.map((i) => [i.id, i]));

/* ---------- Hero stats ---------- */
$("#heroStats").innerHTML = `
  <div><b>${ALL.length}</b><span>Dishes &amp; drinks</span></div>
  <div><b>${MENU.length}</b><span>Categories</span></div>
  <div><b>100%</b><span>Ethiopian coffee</span></div>`;

/* ---------- Signatures rail ---------- */
const signatures = ALL.filter((i) => i.tags?.includes("signature") && i.img);
$("#signatureRail").innerHTML = signatures.map((i) => `
  <button class="sig-card" data-id="${i.id}">
    <img src="${IMG(i.img)}" alt="" loading="lazy">
    <div class="sig-info">
      <span class="chip-tag">${esc(i.cat.title)}</span>
      <h3>${esc(i.name)}</h3>
      ${priceHTML(i.price)}
    </div>
  </button>`).join("");

/* ---------- Sections ---------- */
const tagsHTML = (tags = []) => tags.length
  ? `<div class="item-tags">${tags.map((t) => `<span class="chip-tag ${t}">${TAG_LABEL[t]}</span>`).join("")}</div>` : "";
const addBtn = (i) => i.price == null ? "" :
  `<span class="add" role="button" tabindex="0" data-add="${i.id}" aria-label="Add ${esc(i.name)}">${ICONS.plus}</span>`;

function cardHTML(i, n) {
  return `
  <article class="item" data-id="${i.id}" style="animation-delay:${Math.min(n, 8) * 40}ms" tabindex="0">
    <div class="item-img"><img src="${IMG(i.img)}" alt="" loading="lazy"></div>
    <div class="item-body">
      <h3>${esc(i.name)}</h3>
      ${i.desc ? `<p>${esc(i.desc)}</p>` : ""}
      ${tagsHTML(i.tags)}
      <div class="item-foot">${priceHTML(i.price)}${addBtn(i)}</div>
    </div>
  </article>`;
}
function rowHTML(i) {
  const star = i.tags?.includes("signature") ? `<span class="chip-tag">★</span>` : "";
  return `
  <div class="row" data-id="${i.id}" tabindex="0">
    <div class="row-img"><img src="${IMG(i.img)}" alt="" loading="lazy"></div>
    <div class="name"><span>${esc(i.name)}</span>${star}</div>
    <i class="dots"></i>
    ${priceHTML(i.price)}${addBtn(i)}
  </div>`;
}
function extraHTML(i) {
  return `<div class="extra" data-id="${i.id}"><span>${esc(i.name)}</span>${priceHTML(i.price)}${addBtn(i)}</div>`;
}

$("#menuSections").innerHTML = MENU.map((cat) => {
  const body =
    cat.layout === "cards" ? `<div class="grid">${cat.items.map(cardHTML).join("")}</div>` :
    cat.layout === "list" ? `<div class="list">${cat.items.map(rowHTML).join("")}</div>` :
    `<div class="extras">${cat.items.map(extraHTML).join("")}</div>`;
  const banner = cat.cover
    ? `<div class="menu-banner reveal"><img src="${IMG(cat.cover)}" alt="" loading="lazy"><div class="txt">
         <span class="count">${cat.items.length} items</span><h2>${esc(cat.title)}</h2><p>${esc(cat.subtitle)}</p></div></div>`
    : `<div class="section-head reveal"><div><span class="eyebrow">${esc(cat.subtitle)}</span><h2 class="h2">${esc(cat.title)}</h2></div></div>`;
  return `<section class="menu-section" id="${cat.id}" data-cat="${cat.id}">${banner}${body}</section>`;
}).join("");

$("#catNav").innerHTML = MENU.map((c) =>
  `<a href="#${c.id}" data-cat="${c.id}">${esc(c.title.split(/ [&,] /)[0])}<span>${c.items.length}</span></a>`).join("");

/* ---------- Search + filter ---------- */
let query = "", filter = "all";
function applyFilter() {
  const q = query.trim().toLowerCase();
  let shown = 0;
  MENU.forEach((cat) => {
    let visible = 0;
    cat.items.forEach((i) => {
      const hay = `${i.name} ${i.desc || ""} ${cat.title}`.toLowerCase();
      const ok = (!q || hay.includes(q)) && (filter === "all" || i.tags?.includes(filter));
      $$(`[data-id="${i.id}"]`, $("#menuSections")).forEach((el) => (el.style.display = ok ? "" : "none"));
      if (ok) visible++;
    });
    $(`#${cat.id}`).style.display = visible ? "" : "none";
    $(`#catNav [data-cat="${cat.id}"]`).style.display = visible ? "" : "none";
    shown += visible;
  });
  $("#empty").classList.toggle("show", shown === 0);
}
$("#search").addEventListener("input", (e) => {
  query = e.target.value;
  $("#searchBox").classList.toggle("has-value", !!query);
  applyFilter();
});
$("#search").addEventListener("focus", () => {
  const top = $("#menu").getBoundingClientRect().top + scrollY - 0;
  if (scrollY < top - 10) scrollTo({ top, behavior: "smooth" });
});
$("#clearSearch").addEventListener("click", (e) => {
  e.preventDefault();
  $("#search").value = ""; query = "";
  $("#searchBox").classList.remove("has-value");
  applyFilter();
});
$$("[data-filter]").forEach((b) => b.addEventListener("click", () => {
  $$("[data-filter]").forEach((x) => x.classList.toggle("active", x === b));
  filter = b.dataset.filter;
  applyFilter();
  scrollTo({ top: $("#menu").offsetTop, behavior: "smooth" });
}));

/* ---------- Scroll-spy for category nav ---------- */
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const id = e.target.id;
    $$("#catNav a").forEach((a) => a.classList.toggle("active", a.dataset.cat === id));
    const active = $(`#catNav a[data-cat="${id}"]`);
    if (active) $("#catNav").scrollTo({ left: active.offsetLeft - 40, behavior: "smooth" });
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$(".menu-section").forEach((s) => spy.observe(s));

/* ---------- Interactions ---------- */
function addToOrder(item, qty = 1) {
  order.add({ key: item.id, id: item.id, name: item.name, price: item.price, img: item.img || null }, qty);
  toast(`${qty > 1 ? qty + " × " : ""}${item.name} added`);
}

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) {
    e.stopPropagation();
    addToOrder(byId[add.dataset.add]);
    add.classList.add("in");
    add.innerHTML = ICONS.check;
    setTimeout(() => { add.classList.remove("in"); add.innerHTML = ICONS.plus; }, 900);
    return;
  }
  const card = e.target.closest("[data-id]");
  if (card && byId[card.dataset.id] && !card.classList.contains("extra")) openDetail(byId[card.dataset.id]);
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = e.target;
  if (t.matches("[data-add], .item, .row")) { e.preventDefault(); t.click(); }
});

function openDetail(i) {
  let qty = 1;
  const sheet = Sheet.open(`
    ${i.img ? `<div class="detail-img"><img src="${IMG(i.img)}" alt="${esc(i.name)}"></div>` : `<div style="height:40px"></div>`}
    <div class="detail-body">
      <span class="eyebrow">${esc(i.cat.title)}</span>
      <h3>${esc(i.name)}</h3>
      ${i.desc ? `<p>${esc(i.desc)}</p>` : ""}
      ${tagsHTML(i.tags)}
      <div style="margin:16px 0 18px">${priceHTML(i.price)}</div>
      ${i.price == null ? `<p>Please ask our staff for today's price.</p>` : `
      <div class="detail-actions">
        <div class="qty"><button data-q="-1" aria-label="Less">−</button><output>1</output><button data-q="1" aria-label="More">+</button></div>
        <button class="btn btn-dark" id="detailAdd">Add · <span id="detailSum">${fmt(i.price)}</span> ETB</button>
      </div>`}
      <p class="note-sm">Photos are for illustration — presentation may vary.</p>
    </div>`);
  $$("[data-q]", sheet).forEach((b) => b.onclick = () => {
    qty = Math.max(1, qty + +b.dataset.q);
    $("output", sheet).textContent = qty;
    $("#detailSum").textContent = fmt(i.price * qty);
  });
  const btn = $("#detailAdd", sheet);
  if (btn) btn.onclick = () => { addToOrder(i, qty); Sheet.close(); };
}

/* ---------- Order (my selection) ---------- */
function openOrder() {
  const render = () => {
    const items = order.items;
    if (!items.length) return `
      <div class="sheet-head"><h3>My selection</h3></div>
      <div class="sheet-empty">${ICONS.tray}<p>Nothing here yet.<br>Tap <b>+</b> on any dish to build your order.</p>
      <button class="btn btn-dark" onclick="Sheet.close()">Browse the menu</button></div>`;
    return `
      <div class="sheet-head"><h3>My selection</h3></div>
      <div class="line-items">${items.map((it) => `
        <div class="line">
          ${it.img ? `<img src="${IMG(it.img)}" alt="">` : `<span class="ph">${esc(it.name[0])}</span>`}
          <div><h4>${esc(it.name)}</h4><span class="sub">${fmt(it.price)} ETB each</span></div>
          <div class="r">
            <b>${fmt(it.price * it.qty)}</b>
            <div class="qty sm"><button data-k="${it.key}" data-d="-1" aria-label="Less">−</button><output>${it.qty}</output><button data-k="${it.key}" data-d="1" aria-label="More">+</button></div>
          </div>
        </div>`).join("")}
      </div>
      <div class="totals">
        <div class="t"><span>Items</span><span>${order.count()}</span></div>
        <div class="t grand"><span>Estimated total</span><span>${fmt(order.total())} ETB</span></div>
        <button class="btn btn-gold btn-block" id="showWaiter">Show to waiter</button>
        <button class="btn btn-block" id="clearOrder" style="margin-top:8px;color:var(--muted)">Clear selection</button>
        <p class="note-sm">This list helps you order — please confirm with our staff.</p>
      </div>`;
  };
  const sheet = Sheet.open(render());
  const rebind = () => {
    $$("[data-k]", sheet).forEach((b) => b.onclick = () => {
      const it = order.items.find((x) => x.key === b.dataset.k);
      order.setQty(b.dataset.k, it.qty + +b.dataset.d);
      refresh();
    });
    const w = $("#showWaiter", sheet); if (w) w.onclick = showWaiter;
    const c = $("#clearOrder", sheet); if (c) c.onclick = () => { order.clear(); refresh(); };
  };
  const refresh = () => {
    const keep = $(".sheet-close", sheet);
    sheet.innerHTML = `<div class="sheet-grip"></div>` + render();
    sheet.prepend(keep);
    rebind();
  };
  rebind();
}

function showWaiter() {
  Sheet.close();
  const w = $("#waiter");
  w.innerHTML = `
    <span class="eyebrow">LIMU Coffee · Order</span>
    <h2>Hello! We'd like:</h2>
    <ol>${order.items.map((i) => `<li><b>${i.qty}×</b><span>${esc(i.name)}</span><span>${fmt(i.price * i.qty)}</span></li>`).join("")}</ol>
    <div class="grand"><span>Total</span><span>${fmt(order.total())} ETB</span></div>
    <button class="btn btn-gold btn-block" id="closeWaiter">Done</button>`;
  w.classList.add("open");
  document.body.classList.add("locked");
  $("#closeWaiter").onclick = () => { w.classList.remove("open"); document.body.classList.remove("locked"); };
}

$("#viewOrder").onclick = openOrder;
$("#headerAction").onclick = openOrder;
bindCountBadge(order, $("#headerCount"));
order.subscribe(() => {
  const c = order.count();
  $("#orderBar").classList.toggle("show", c > 0);
  $("#barCount").textContent = c;
  $("#barTotal").innerHTML = `${fmt(order.total())} ETB<small>My selection · ${c} item${c === 1 ? "" : "s"}</small>`;
});
