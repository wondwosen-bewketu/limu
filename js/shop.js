/* Coffee shop page (demo checkout — nothing is charged or sent) */
const cart = createStore("limu-cart");
mountChrome("shop", { actionIcon: ICONS.bag, actionLabel: "Your bag" });
$$("[data-icon]").forEach((el) => (el.innerHTML = ICONS[el.dataset.icon]));
$("#footer").outerHTML = footerHTML();

const product = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

$("#productGrid").innerHTML = PRODUCTS.map((p, n) => `
  <article class="product" style="animation-delay:${n * 70}ms">
    <div class="product-media">
      ${p.badge ? `<span class="chip-tag">${esc(p.badge)}</span>` : ""}
      <img src="${IMG(p.img)}" alt="${esc(p.name)}" loading="lazy" class="${p.img.startsWith("menu-") ? "cover" : ""}">
    </div>
    <div class="product-body">
      <span class="size">${esc(p.size)}</span>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.desc)}</p>
      ${p.options ? `<select aria-label="Grind" data-opt="${p.id}">${p.options.map((o) => `<option>${esc(o)}</option>`).join("")}</select>` : ""}
      <div class="product-foot">
        ${priceHTML(p.price)}
        <button class="btn btn-dark" data-buy="${p.id}">${ICONS.plus} Add</button>
      </div>
    </div>
  </article>`).join("");

$("#productGrid").addEventListener("click", (e) => {
  const b = e.target.closest("[data-buy]");
  if (!b) return;
  const p = product[b.dataset.buy];
  const opt = $(`[data-opt="${p.id}"]`)?.value;
  cart.add({ key: `${p.id}|${opt || ""}`, id: p.id, name: `${p.name} · ${p.size}`, option: opt, price: p.price, img: p.img });
  toast(`${p.size} added to your bag`);
  b.innerHTML = `${ICONS.check} Added`;
  setTimeout(() => (b.innerHTML = `${ICONS.plus} Add`), 1100);
});

/* ---------- Cart + checkout ---------- */
function cartHTML() {
  if (!cart.items.length) return `
    <div class="sheet-head"><h3>Your bag</h3></div>
    <div class="sheet-empty">${ICONS.bag}<p>Your bag is empty.</p>
    <button class="btn btn-dark" onclick="Sheet.close()">Shop coffee</button></div>`;
  return `
    <div class="sheet-head"><h3>Your bag</h3></div>
    <div class="line-items">${cart.items.map((it) => `
      <div class="line">
        <img src="${IMG(it.img)}" alt="">
        <div><h4>${esc(it.name)}</h4><span class="sub">${esc(it.option || "")}</span></div>
        <div class="r">
          <b>${fmt(it.price * it.qty)}</b>
          <div class="qty sm"><button data-k="${esc(it.key)}" data-d="-1" aria-label="Less">−</button><output>${it.qty}</output><button data-k="${esc(it.key)}" data-d="1" aria-label="More">+</button></div>
        </div>
      </div>`).join("")}
    </div>
    <div class="totals">
      <div class="t"><span>Subtotal</span><span>${fmt(cart.total())} ETB</span></div>
      <div class="t grand"><span>Total</span><span>${fmt(cart.total())} ETB</span></div>
    </div>
    <form class="form" id="checkout" novalidate>
      <div class="field"><label for="cName">Name</label><input id="cName" required autocomplete="name" placeholder="Your name"></div>
      <div class="field"><label for="cPhone">Phone</label><input id="cPhone" required type="tel" autocomplete="tel" placeholder="09…"></div>
      <div class="seg" role="radiogroup" aria-label="Fulfilment">
        <label><input type="radio" name="ful" value="pickup" checked><span>Pickup</span></label>
        <label><input type="radio" name="ful" value="delivery"><span>Delivery</span></label>
      </div>
      <div class="field" id="addrField" hidden><label for="cAddr">Address</label><textarea id="cAddr" placeholder="Area, building, landmark"></textarea></div>
      <button class="btn btn-gold btn-block" type="submit">Place order · ${fmt(cart.total())} ETB</button>
      <p class="note-sm">Demo checkout — no payment is taken and nothing is sent.</p>
    </form>`;
}

function openCart() {
  const sheet = Sheet.open(cartHTML());
  const bind = () => {
    $$("[data-k]", sheet).forEach((b) => b.onclick = () => {
      const it = cart.items.find((x) => x.key === b.dataset.k);
      cart.setQty(b.dataset.k, it.qty + +b.dataset.d);
      refresh();
    });
    $$('input[name="ful"]', sheet).forEach((r) => r.onchange = () => ($("#addrField").hidden = r.value !== "delivery" || !r.checked));
    const form = $("#checkout", sheet);
    if (form) form.onsubmit = (e) => {
      e.preventDefault();
      const name = $("#cName").value.trim(), phone = $("#cPhone").value.trim();
      if (!name || phone.replace(/\D/g, "").length < 9) { toast("Please add your name and phone"); return; }
      const ref = "LM-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      const pickup = $('input[name="ful"]:checked').value === "pickup";
      cart.clear();
      const keep = $(".sheet-close", sheet);
      sheet.innerHTML = `<div class="sheet-grip"></div>
        <div class="success">
          <div class="tick">${ICONS.check}</div>
          <h3>Thank you, ${esc(name.split(" ")[0])}!</h3>
          <p>Order <b>${ref}</b> received.<br>${pickup ? "We'll have it ready at the counter." : "We'll call you to arrange delivery."}</p>
          <button class="btn btn-dark" onclick="Sheet.close()">Continue</button>
          <p class="note-sm">(Demo — this order was not actually placed.)</p>
        </div>`;
      sheet.prepend(keep);
    };
  };
  const refresh = () => {
    const keep = $(".sheet-close", sheet);
    sheet.innerHTML = `<div class="sheet-grip"></div>` + cartHTML();
    sheet.prepend(keep);
    bind();
  };
  bind();
}

$("#viewCart").onclick = openCart;
$("#headerAction").onclick = openCart;
bindCountBadge(cart, $("#headerCount"));
cart.subscribe(() => {
  const c = cart.count();
  $("#cartBar").classList.toggle("show", c > 0);
  $("#barCount").textContent = c;
  $("#barTotal").innerHTML = `${fmt(cart.total())} ETB<small>Your bag · ${c} item${c === 1 ? "" : "s"}</small>`;
});
