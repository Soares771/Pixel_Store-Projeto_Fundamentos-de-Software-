// ============================================================
//  PIXEL STORE — js/catalog.js
//  Renderização do catálogo, filtros e integração com o cart
// ============================================================

const Catalog = (() => {

  let activeGenre = "Todos";

  /* ── Inicialização ──────────────────────────────────────── */

  function init() {
    _buildFilters();
    _renderGrid("Todos");
    _setupCartDrawer();
    Cart.render();                          // sincroniza badge e botões
  }

  /* ── Filtros ────────────────────────────────────────────── */

  function _buildFilters() {
    const bar    = document.getElementById("filter-bar");
    const genres = ["Todos", ...new Set(GAMES_DB.map((g) => g.genre))];

    bar.innerHTML = genres.map((g) => `
      <button
        class="filter-btn ${g === "Todos" ? "active" : ""}"
        data-genre="${g}"
        onclick="Catalog.filterBy('${g}')"
      >${g}</button>
    `).join("");
  }

  /** Filtra o grid pelo gênero selecionado */
  function filterBy(genre) {
    activeGenre = genre;

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.genre === genre);
    });

    const filtered = genre === "Todos"
      ? GAMES_DB
      : GAMES_DB.filter((g) => g.genre === genre);

    _renderGrid(genre, filtered);
  }

  /* ── Grid ───────────────────────────────────────────────── */

  function _renderGrid(genre, list = GAMES_DB) {
    const grid = document.getElementById("games-grid");

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🎮</div>
          <p>Nenhum jogo encontrado nesta categoria.</p>
        </div>`;
      return;
    }

    grid.innerHTML = list.map((game) => _cardHTML(game)).join("");
    Cart.render();   // atualiza estado dos botões "in-cart"
  }

  function _cardHTML(game) {
    const stars = "★".repeat(Math.floor(game.rating)) + (game.rating % 1 >= 0.5 ? "½" : "");
    const discountBadge = game.discount > 0
      ? `<span class="discount-badge">-${game.discount}%</span>`
      : "";
    const originalPrice = game.discount > 0
      ? `<span class="price-original">R$ ${game.originalPrice.toFixed(2)}</span>`
      : "";

    return `
      <div class="game-card">
        <div class="card-cover">
          ${game.cover}
          <span class="card-tag" style="background:${game.tagColor}">${game.tag}</span>
        </div>
        <div class="card-body">
          <div class="card-title">${game.title}</div>
          <div class="card-genre">${game.genre}</div>
          <div class="card-rating">
            ${stars}
            <span>(${game.rating})</span>
          </div>
          <div class="card-desc">${game.description}</div>
          <div class="card-footer">
            <div class="price-block">
              <span class="price-current">R$ ${game.price.toFixed(2)}</span>
              ${originalPrice}
              ${discountBadge}
            </div>
            <button
              class="add-btn ${Cart.has(game.id) ? "in-cart" : ""}"
              data-id="${game.id}"
              onclick="Catalog.addToCart(${game.id})"
            >${Cart.has(game.id) ? "✓ No carrinho" : "+ Carrinho"}</button>
          </div>
        </div>
      </div>`;
  }

  /* ── Adicionar ao carrinho ──────────────────────────────── */

  function addToCart(gameId) {
    const game   = GAMES_DB.find((g) => g.id === gameId);
    const result = Cart.add(game);
    showToast(result.message);
    Cart.render();
  }

  /* ── Drawer do carrinho ─────────────────────────────────── */

  function _setupCartDrawer() {
    const overlay  = document.getElementById("cart-overlay");
    const drawer   = document.getElementById("cart-drawer");
    const openBtn  = document.getElementById("cart-trigger");
    const closeBtn = document.getElementById("cart-close");

    function open()  { overlay.classList.add("open"); drawer.classList.add("open"); }
    function close() { overlay.classList.remove("open"); drawer.classList.remove("open"); }

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", close);
  }

  /* ── Finalizar compra ───────────────────────────────────── */

  function checkout() {
    Cart.clear();
    Cart.render();
    showToast("Pedido finalizado com sucesso! ✅ Obrigado pela compra!");
    document.getElementById("cart-overlay").classList.remove("open");
    document.getElementById("cart-drawer").classList.remove("open");
  }

  /* ── Toast ──────────────────────────────────────────────── */

  function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2800);
  }

  return { init, filterBy, addToCart, checkout };

})();
