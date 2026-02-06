
const DATA = {
  "pizzaria": {
    "name": "Pizzaria Sabor do Tempero",
    "address": "Rua Treze de Abril, 381 - Vila Industrial - Toledo/PR",
    "rating": "4.9",
    "delivery": "20–30 min",
    "pickup": "15 min",
    "whatsapp": "+55 45 9862-1838"
  },
  "sizes": [
    {
      "id": "g1",
      "name": "Pizza Grande — 1 sabor",
      "slices": "12 pedaços",
      "maxFlavors": 1,
      "basePrice": 35.0
    },
    {
      "id": "g2",
      "name": "Pizza Grande — 2 sabores",
      "slices": "12 pedaços",
      "maxFlavors": 2,
      "basePrice": 40.0
    }
  ],
  "crust": [
    {
      "id": "sem",
      "name": "Sem borda",
      "price": 0.0
    },
    {
      "id": "catupiry",
      "name": "Borda de Catupiry",
      "price": 8.0
    },
    {
      "id": "cheddar",
      "name": "Borda de Cheddar",
      "price": 8.0
    }
  ],
  "flavors": {
    "salgadas": [
      {
        "id": "alema",
        "name": "Alemã",
        "desc": "Molho de tomate, mussarela, calabresa, catupiry, cebola e orégano",
        "price": 35.0
      },
      {
        "id": "bacon",
        "name": "Bacon",
        "desc": "Molho de tomate, mussarela, bacon e orégano",
        "price": 40.0
      },
      {
        "id": "calabresa",
        "name": "Calabresa",
        "desc": "Molho de tomate, mussarela, calabresa e orégano",
        "price": 35.0
      },
      {
        "id": "frango-catupiry",
        "name": "Frango Catupiry",
        "desc": "Molho de tomate, mussarela, frango ao molho, catupiry e orégano",
        "price": 35.0
      },
      {
        "id": "lombinho",
        "name": "Lombinho",
        "desc": "Molho de tomate, catupiry, lombinho defumado, orégano e mussarela",
        "price": 35.0
      },
      {
        "id": "marguerita",
        "name": "Marguerita",
        "desc": "Molho de tomate, mussarela, tomate fatiado, parmesão e manjericão",
        "price": 35.0
      },
      {
        "id": "milho-bacon",
        "name": "Milho com Bacon",
        "desc": "Molho de tomate, mussarela, milho verde, bacon e orégano",
        "price": 35.0
      },
      {
        "id": "milho",
        "name": "Milho Verde",
        "desc": "Molho de tomate, mussarela, milho verde e orégano",
        "price": 35.0
      },
      {
        "id": "mineira",
        "name": "Mineira",
        "desc": "Molho de tomate, mussarela, palmito, ervilha, milho, catupiry e orégano",
        "price": 35.0
      },
      {
        "id": "moda-casa",
        "name": "Moda da Casa",
        "desc": "Molho de tomate, tomate, mussarela, milho, ervilha, palmito, bacon, catupiry e orégano",
        "price": 35.0
      },
      {
        "id": "moda-pizzaiolo",
        "name": "Moda do Pizzaiolo",
        "desc": "Molho de tomate, mussarela, presunto, tomate e orégano",
        "price": 35.0
      }
    ],
    "doces": [
      {
        "id": "beijinho",
        "name": "Beijinho",
        "desc": "Leite condensado, mussarela, chocolate branco e coco ralado",
        "price": 40.0
      },
      {
        "id": "choc-branco",
        "name": "Chocolate Branco",
        "desc": "Leite condensado, mussarela e chocolate branco",
        "price": 40.0
      },
      {
        "id": "choc-preto",
        "name": "Chocolate Preto",
        "desc": "Leite condensado, mussarela e chocolate preto",
        "price": 40.0
      },
      {
        "id": "choquito",
        "name": "Choquito",
        "desc": "Leite condensado, mussarela, chocolate preto e amendoim torrado",
        "price": 40.0
      },
      {
        "id": "prestigio",
        "name": "Prestígio",
        "desc": "Leite condensado, mussarela, chocolate preto e coco ralado",
        "price": 40.0
      }
    ]
  },
  "drinks": [
    {
      "id": "coca2l",
      "name": "Coca Cola 2L",
      "price": 15.0
    },
    {
      "id": "guarana2l",
      "name": "Guaraná Show 2L",
      "price": 8.0
    },
    {
      "id": "schweppes15",
      "name": "Schweppes 1,5L",
      "price": 10.0
    }
  ]
};

const money = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));
const uid = () => (Date.now().toString(36) + Math.random().toString(36).slice(2,8)).toUpperCase();

function loadCart() {
  try { return JSON.parse(localStorage.getItem('pizzaria_cart') || '[]'); } catch(e) { return []; }
}
function saveCart(cart) {
  localStorage.setItem('pizzaria_cart', JSON.stringify(cart));
  renderCart();
}
function addToCart(item) {
  const cart = loadCart();
  cart.push(item);
  saveCart(cart);
}
function removeFromCart(index) {
  const cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
}
function cartTotal(cart) {
  return cart.reduce((sum, it) => sum + (it.total || 0), 0);
}

function computePizzaTotal(sizeId, flavorIds, crustId, qty) {
  const size = DATA.sizes.find(s=>s.id===sizeId);
  const crust = DATA.crust.find(c=>c.id===crustId) || DATA.crust[0];
  const allFlavors = [...DATA.flavors.salgadas, ...DATA.flavors.doces];
  const flavors = flavorIds.map(id => allFlavors.find(f=>f.id===id)).filter(Boolean);

  // Regra: 1 sabor = preço do sabor; 2 sabores = média dos sabores.
  let pizzaPrice = 0;
  if (flavors.length === 1) pizzaPrice = flavors[0].price;
  if (flavors.length === 2) pizzaPrice = (flavors[0].price + flavors[1].price) / 2;

  // fallback
  if (!pizzaPrice) pizzaPrice = (size && size.basePrice) ? size.basePrice : 0;

  const unit = pizzaPrice + crust.price;
  const total = unit * qty;
  return { unit, total, pizzaPrice, crustPrice: crust.price };
}

function renderMenu() {
  const meta = qs('#meta');
  if (meta) {
    meta.innerHTML = `
      <div class="metaRow">
        <div class="metaItem"><span class="dot green"></span><b>Avaliação</b><div>${DATA.pizzaria.rating}</div></div>
        <div class="metaItem"><span class="dot red"></span><b>Entrega</b><div>${DATA.pizzaria.delivery}</div></div>
        <div class="metaItem"><span class="dot"></span><b>Retirada</b><div>${DATA.pizzaria.pickup}</div></div>
      </div>
    `;
  }

  const sizes = qs('#sizes');
  if (sizes) {
    sizes.innerHTML = DATA.sizes.map(s => `
      <button class="card cardBtn" data-size="${s.id}">
        <div class="cardTitle">${s.name}</div>
        <div class="cardSub">${s.slices} • até ${s.maxFlavors} sabor(es)</div>
        <div class="cardPrice">${money(s.basePrice)}</div>
      </button>
    `).join('');
  }

  const buildFlavorCards = (list, mountId) => {
    const el = qs(mountId);
    if (!el) return;
    el.innerHTML = list.map(f => `
      <div class="item">
        <div class="itemMain">
          <div class="itemName">${f.name}</div>
          <div class="itemDesc">${f.desc}</div>
        </div>
        <div class="itemPrice">${money(f.price)}</div>
      </div>
    `).join('');
  };
  buildFlavorCards(DATA.flavors.salgadas, '#flavorsSalgadas');
  buildFlavorCards(DATA.flavors.doces, '#flavorsDoces');

  const drinks = qs('#drinks');
  if (drinks) {
    drinks.innerHTML = DATA.drinks.map(d => `
      <div class="item">
        <div class="itemMain">
          <div class="itemName">${d.name}</div>
        </div>
        <div class="itemRight">
          <div class="itemPrice">${money(d.price)}</div>
          <button class="btn btnSm" data-drink="${d.id}">Adicionar</button>
        </div>
      </div>
    `).join('');
  }
}

function openModal(sizeId) {
  const size = DATA.sizes.find(s=>s.id===sizeId);
  const modal = qs('#modal');
  if (!modal || !size) return;

  qs('#mTitle').textContent = size.name;
  qs('#mHint').textContent = `Selecione ${size.maxFlavors} sabor(es) • ${size.slices}`;

  const tabS = qs('#tabS');
  const tabD = qs('#tabD');
  const list = qs('#mFlavors');

  let current = 'salgadas';
  const all = { salgadas: DATA.flavors.salgadas, doces: DATA.flavors.doces };

  const enforceMax = () => {
    const picks = qsa('.flavorPick', list);
    const checked = picks.filter(p=>p.checked);
    if (checked.length >= size.maxFlavors) {
      picks.filter(p=>!p.checked).forEach(p=>p.disabled=true);
    } else {
      picks.forEach(p=>p.disabled=false);
    }
  };

  const getFlavorIds = () => qsa('.flavorPick', list).filter(p=>p.checked).map(p=>p.value);

  const render = () => {
    tabS.classList.toggle('active', current==='salgadas');
    tabD.classList.toggle('active', current==='doces');
    list.innerHTML = all[current].map(f => `
      <label class="pick">
        <input type="checkbox" value="${f.id}" class="flavorPick">
        <span class="pickText">
          <span class="pickName">${f.name}</span>
          <span class="pickDesc">${f.desc}</span>
        </span>
        <span class="pickPrice">${money(f.price)}</span>
      </label>
    `).join('');
    enforceMax();
    updateSummary();
  };

  const crustSel = qs('#mCrust');
  crustSel.innerHTML = DATA.crust.map(c => `<option value="${c.id}">${c.name}${c.price ? ' + ' + money(c.price) : ''}</option>`).join('');
  crustSel.value = 'sem';

  const qtyEl = qs('#mQty');
  qtyEl.value = 1;

  const updateSummary = () => {
    const ids = getFlavorIds();
    const crustId = crustSel.value;
    const q = Math.max(1, parseInt(qtyEl.value||'1',10));
    const {unit,total} = computePizzaTotal(sizeId, ids, crustId, q);
    qs('#mTotal').textContent = money(total);
    qs('#mUnit').textContent = money(unit);
    qs('#mSel').textContent = `${ids.length} / ${size.maxFlavors}`;
  };

  tabS.onclick = () => { current='salgadas'; render(); };
  tabD.onclick = () => { current='doces'; render(); };
  list.onchange = () => { enforceMax(); updateSummary(); };
  crustSel.onchange = updateSummary;
  qtyEl.oninput = updateSummary;

  qs('#mAdd').onclick = () => {
    const ids = getFlavorIds();
    if (ids.length !== size.maxFlavors) {
      alert(`Selecione exatamente ${size.maxFlavors} sabor(es).`);
      return;
    }
    const q = Math.max(1, parseInt(qtyEl.value||'1',10));
    const crustId = crustSel.value;
    const allFlavors = [...DATA.flavors.salgadas, ...DATA.flavors.doces];
    const flavors = ids.map(id=>allFlavors.find(f=>f.id===id)).filter(Boolean);
    const calc = computePizzaTotal(sizeId, ids, crustId, q);

    addToCart({
      type:'pizza',
      id: uid(),
      sizeId,
      sizeName: size.name,
      crustId,
      crustName: (DATA.crust.find(c=>c.id===crustId)||DATA.crust[0]).name,
      flavors: flavors.map(f=>f.name),
      qty: q,
      unit: calc.unit,
      total: calc.total
    });
    closeModal();
  };

  render();
  modal.classList.add('open');
}
function closeModal() {
  const modal = qs('#modal');
  if (modal) modal.classList.remove('open');
}

function renderCart() {
  const cartEl = qs('#cartItems');
  const cart = loadCart();

  if (cartEl) {
    if (!cart.length) {
      cartEl.innerHTML = `<div class="empty">Seu carrinho está vazio.</div>`;
    } else {
      cartEl.innerHTML = cart.map((it, idx) => {
        const title = it.type === 'pizza'
          ? `${it.sizeName} • ${it.flavors.join(' / ')}`
          : it.name;
        const sub = it.type === 'pizza'
          ? `Borda: ${it.crustName} • Qtd: ${it.qty}`
          : `Qtd: ${it.qty}`;
        return `
          <div class="cartItem">
            <div class="cartMain">
              <div class="cartTitle">${title}</div>
              <div class="cartSub">${sub}</div>
            </div>
            <div class="cartRight">
              <div class="cartPrice">${money(it.total)}</div>
              <button class="link" data-remove="${idx}">remover</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  const total = cartTotal(cart);
  const totalEl = qs('#cartTotal');
  if (totalEl) totalEl.textContent = money(total);

  const badge = qs('#cartBadge');
  if (badge) {
    const qty = cart.reduce((s,it)=>s+(it.qty||1),0);
    badge.textContent = qty;
    badge.style.display = qty ? 'inline-flex' : 'none';
  }
}

function wireIndex() {
  renderMenu();
  renderCart();

  const sizes = qs('#sizes');
  if (sizes) {
    sizes.onclick = (e) => {
      const btn = e.target.closest('[data-size]');
      if (!btn) return;
      openModal(btn.getAttribute('data-size'));
    };
  }

  const drinks = qs('#drinks');
  if (drinks) {
    drinks.onclick = (e) => {
      const btn = e.target.closest('[data-drink]');
      if (!btn) return;
      const d = DATA.drinks.find(x=>x.id===btn.getAttribute('data-drink'));
      if (!d) return;
      addToCart({ type:'drink', id: uid(), name:d.name, qty:1, unit:d.price, total:d.price });
    };
  }

  const cartWrap = qs('#cart');
  if (cartWrap) {
    cartWrap.onclick = (e) => {
      const rm = e.target.closest('[data-remove]');
      if (!rm) return;
      removeFromCart(parseInt(rm.getAttribute('data-remove'),10));
    };
  }

  const goCheckoutBtns = qsa('#goCheckout');
  goCheckoutBtns.forEach(go => go.onclick = () => {
    const cart = loadCart();
    if (!cart.length) return alert('Adicione itens ao carrinho.');
    location.href = 'checkout.html';
  });

  const closeBtn = qs('#mClose');
  if (closeBtn) closeBtn.onclick = closeModal;
  const backdrop = qs('#mBackdrop');
  if (backdrop) backdrop.onclick = closeModal;
}

function loadProfile() {
  try { return JSON.parse(localStorage.getItem('pizzaria_profile') || 'null'); } catch(e) { return null; }
}
function saveProfile(p) {
  localStorage.setItem('pizzaria_profile', JSON.stringify(p));
}
function loadOrders() {
  try { return JSON.parse(localStorage.getItem('pizzaria_orders') || '[]'); } catch(e) { return []; }
}
function saveOrders(orders) {
  localStorage.setItem('pizzaria_orders', JSON.stringify(orders));
}

function wireCheckout() {
  renderCart();

  const prof = loadProfile();
  if (prof) {
    qs('#nome').value = prof.nome || '';
    qs('#tel').value = prof.tel || '';
    qs('#end').value = prof.end || '';
    qs('#ref').value = prof.ref || '';
  }

  qs('#saveProfile').onclick = () => {
    const p = {
      nome: qs('#nome').value.trim(),
      tel: qs('#tel').value.trim(),
      end: qs('#end').value.trim(),
      ref: qs('#ref').value.trim()
    };
    saveProfile(p);
    alert('Dados salvos.');
  };

  const paySel = qs('#pagamento');
  const pixBox = qs('#pixBox');
  const cardBox = qs('#cardBox');
  const cashBox = qs('#cashBox');

  const renderPay = () => {
    const v = paySel.value;
    pixBox.style.display = v==='pix' ? 'block' : 'none';
    cardBox.style.display = v==='card' ? 'block' : 'none';
    cashBox.style.display = v==='cash' ? 'block' : 'none';
  };
  paySel.onchange = renderPay;
  renderPay();

  qs('#gerarPix').onclick = () => {
    const code = '00020126' + Math.random().toString(16).slice(2) + Date.now().toString(16);
    qs('#pixCode').value = code.toUpperCase();
    qs('#pixHint').textContent = 'PIX gerado. Use o QR/copia e cola do seu banco.';
  };

  qs('#finalizar').onclick = () => {
    const cart = loadCart();
    if (!cart.length) return alert('Seu carrinho está vazio.');

    const nome = qs('#nome').value.trim();
    const tel = qs('#tel').value.trim();
    const end = qs('#end').value.trim();
    const modo = qs('#modo').value;
    if (!nome || !tel) return alert('Informe nome e telefone.');
    if (modo==='entrega' && !end) return alert('Informe o endereço para entrega.');

    const orderId = 'PZ-' + uid();
    const total = cartTotal(cart);
    const pagamento = paySel.value;

    const order = {
      orderId,
      createdAt: new Date().toISOString(),
      modo,
      pagamento,
      cliente: { nome, tel, end, ref: qs('#ref').value.trim(), obs: qs('#obs').value.trim() },
      items: cart,
      total,
      status: 'Aguardando confirmação'
    };

    const orders = loadOrders();
    orders.unshift(order);
    saveOrders(orders);

    localStorage.removeItem('pizzaria_cart');
    location.href = 'pedidos.html?order=' + encodeURIComponent(orderId);
  };
}

function wirePedidos() {
  const orders = loadOrders();
  const list = qs('#orders');
  if (!list) return;

  if (!orders.length) {
    list.innerHTML = `<div class="empty">Nenhum pedido ainda.</div>`;
    return;
  }

  list.innerHTML = orders.map(o => {
    const dt = new Date(o.createdAt);
    const when = dt.toLocaleString('pt-BR');
    return `
      <div class="order">
        <div class="orderTop">
          <div>
            <div class="orderId">${o.orderId}</div>
            <div class="orderMeta">${when} • ${o.modo==='entrega' ? 'Entrega' : 'Retirada'} • ${o.pagamento.toUpperCase()}</div>
          </div>
          <div class="orderTotal">${money(o.total)}</div>
        </div>
        <div class="orderItems">
          ${o.items.map(it => {
            const t = it.type==='pizza' ? `${it.sizeName} • ${it.flavors.join(' / ')}` : it.name;
            return `<div class="orderItem">• ${t} (x${it.qty})</div>`;
          }).join('')}
        </div>
        <div class="orderStatus">Status: <b>${o.status}</b></div>
      </div>
    `;
  }).join('');

  const wa = qs('#waLink');
  if (wa) {
    const phone = DATA.pizzaria.whatsapp.replace(/\D/g,'');
    const msg = encodeURIComponent('Olá! Gostaria de acompanhar meu pedido na ' + DATA.pizzaria.name + '.');
    wa.href = `https://wa.me/${phone}?text=${msg}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.getAttribute('data-page');
  if (page === 'home') wireIndex();
  if (page === 'checkout') wireCheckout();
  if (page === 'pedidos') wirePedidos();
});
