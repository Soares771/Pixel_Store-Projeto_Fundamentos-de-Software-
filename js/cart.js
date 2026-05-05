// ============================================================
//  PIXEL STORE — js/cart.js
//  Lógica do carrinho: adicionar, remover, calcular, renderizar
//  Estado mantido em localStorage para persistência entre abas
// ============================================================

const Cart = (() => {

  const STORAGE_KEY = "pixelstore_cart";

  /* ── Persistência ───────────────────────────────────────── */

  function _load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function _save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  /* ── CRUD ───────────────────────────────────────────────── */

  /** Retorna todos os itens do carrinho */
  function getItems() {
    return _load();
  }

  /**
   * Adiciona um jogo ao carrinho (sem duplicatas).
   * @param {object} game — objeto do GAMES_DB
   * @returns {{ ok: boolean, message: string }}
   */
  function add(game) {
    const items = _load();
    const exists = items.find((i) => i.id === game.id);

    if (exists) {
      return { ok: false, message: `"${game.title}" já está no carrinho!` };
    }

    items.push({
      id:    game.id,
      title: game.title,
      genre: game.genre,
      price: game.price,
      cover: game.cover,
    });

    _save(items);
    return { ok: true, message: `"${game.title}" adicionado ao carrinho! 🛒` };
  }

  /**
   * Remove um item pelo id.
   * @param {number} gameId
   */
  function remove(gameId) {
    const updated = _load().filter((i) => i.id !== gameId);
    _save(updated);
  }

  /** Esvazia o carrinho completamente */
  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /** Verifica se um jogo já está no carrinho */
  function has(gameId) {
    return _load().some((i) => i.id === gameId);
  }

  /* ── Cálculos ───────────────────────────────────────────── */

  /** Retorna o total (R$) de todos os itens */
  function getTotal() {
    return _load().reduce((sum, i) => sum + i.price, 0);
  }

  /** Retorna a quantidade de itens */
  function getCount() {
    return _load().length;
  }

  /* ── Renderização do Drawer ─────────────────────────────── */

  /**
   * Renderiza os itens no drawer e atualiza totais / badge.
   * Deve ser chamado sempre que o estado do carrinho mudar.
   */
  function render() {
    const items     = getItems();
    const bodyEl    = document.getElementById("cart-body");
    const badgeEl   = document.getElementById("cart-badge");
    const totalEl   = document.getElementById("cart-total");
    const countEl   = document.getElementById("cart-count");
    const checkBtn  = document.getElementById("checkout-btn");
    const summaryEl = document.getElementById("cart-summary");

    /* Badge na navbar */
    if (badgeEl) {
      badgeEl.textContent = items.length;
      badgeEl.style.display = items.length > 0 ? "flex" : "none";
    }

    if (!bodyEl) return;

    /* Corpo do drawer */
    if (items.length === 0) {
      bodyEl.innerHTML = `
        <div class="cart-empty">
          <div class="empty-icon">🛒</div>
          <p>Seu carrinho está vazio.</p>
          <small>Adicione jogos do catálogo!</small>
        </div>`;
    } else {
      bodyEl.innerHTML = items.map((item) => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-emoji">${item.cover}</div>
          <div class="cart-item-info">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-genre">${item.genre}</div>
            <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
          </div>
          <button class="cart-item-remove" onclick="Cart.removeAndRender(${item.id})" title="Remover">🗑</button>
        </div>
      `).join("");
    }

    /* Resumo e total */
    if (totalEl) totalEl.textContent = `R$ ${getTotal().toFixed(2)}`;
    if (countEl) countEl.textContent = `${items.length} ${items.length === 1 ? "item" : "itens"}`;
    if (checkBtn) checkBtn.disabled = items.length === 0;

    /* Atualiza estado dos botões "Adicionar" no catálogo */
    document.querySelectorAll(".add-btn[data-id]").forEach((btn) => {
      const id = parseInt(btn.dataset.id);
      if (has(id)) {
        btn.textContent = "✓ No carrinho";
        btn.classList.add("in-cart");
      } else {
        btn.textContent = "+ Carrinho";
        btn.classList.remove("in-cart");
      }
    });
  }

  /** Atalho: remove e re-renderiza imediatamente */
  function removeAndRender(gameId) {
    remove(gameId);
    render();
  }

  return { getItems, add, remove, removeAndRender, clear, has, getTotal, getCount, render };

})();
