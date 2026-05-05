// ============================================================
//  PIXEL STORE — js/auth.js
//  Autenticação: login, logout e gerenciamento de sessão
//  Simula lógica de back-end; usa sessionStorage como "token"
// ============================================================

const Auth = (() => {

  const SESSION_KEY  = "pixelstore_session";
  const REGISTRY_KEY = "pixelstore_registered_users";

  /* ── Persistência de usuários registrados ──────────────── */

  /** Carrega usuários registrados do localStorage e os mescla ao USERS_DB */
  function _loadRegistered() {
    try {
      const raw = localStorage.getItem(REGISTRY_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      saved.forEach((u) => {
        const alreadyIn = USERS_DB.find((x) => x.email === u.email);
        if (!alreadyIn) USERS_DB.push(u);
      });
    } catch (_) {}
  }

  /** Salva a lista de usuários registrados no localStorage */
  function _saveRegistered() {
    try {
      // Persiste apenas os que não vieram do users.js original
      const original = [
        "jogador@email.com",
        "teste@email.com",
        "carlos@email.com",
      ];
      const registered = USERS_DB.filter((u) => !original.includes(u.email));
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(registered));
    } catch (_) {}
  }

  /* Executa na inicialização do módulo */
  _loadRegistered();

  /* ── Helpers de sessão ─────────────────────────────────── */

  /** Salva o usuário logado na sessão do navegador */
  function _saveSession(user) {
    const payload = { id: user.id, name: user.name, email: user.email, avatar: user.avatar };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  }

  /** Retorna o usuário da sessão atual ou null */
  function getSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  /** Verifica se há usuário logado */
  function isLoggedIn() {
    return getSession() !== null;
  }

  /* ── Login ──────────────────────────────────────────────── */

  /**
   * Valida credenciais contra USERS_DB e inicia sessão.
   * @param {string} email
   * @param {string} password
   * @returns {{ ok: boolean, user?: object, error?: string }}
   */
  function login(email, password) {
    if (!email || !password) {
      return { ok: false, error: "Preencha e-mail e senha." };
    }

    const found = USERS_DB.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );

    if (!found) {
      return { ok: false, error: "E-mail ou senha incorretos. Tente novamente." };
    }

    _saveSession(found);
    return { ok: true, user: found };
  }

  /* ── Logout ─────────────────────────────────────────────── */

  /** Encerra a sessão e redireciona para o login */
  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    Cart.clear();                                 // limpa carrinho ao sair
    window.location.href = "login.html";
  }

  /* ── Guarda de rota ─────────────────────────────────────── */

  /**
   * Chame no início de cada página protegida.
   * Se não houver sessão, redireciona para login.
   */
  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.href = "login.html";
    }
  }

  /* ── Registro ───────────────────────────────────────────── */

  /**
   * Cria um novo usuario, persiste no localStorage e inicia sessao.
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {{ ok: boolean, user?: object, error?: string }}
   */
  function register(name, email, password) {
    if (!name || !email || !password) {
      return { ok: false, error: "Preencha todos os campos." };
    }
    if (password.length < 6) {
      return { ok: false, error: "A senha deve ter pelo menos 6 caracteres." };
    }
    const exists = USERS_DB.find(
      (u) => u.email === email.trim().toLowerCase()
    );
    if (exists) {
      return { ok: false, error: "Este e-mail ja esta cadastrado." };
    }
    const newUser = {
      id: USERS_DB.length + 1,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      avatar: "🎮",
      joinedAt: new Date().toISOString().split("T")[0],
    };
    USERS_DB.push(newUser);
    _saveRegistered();   // ← persiste no localStorage
    _saveSession(newUser);
    return { ok: true, user: newUser };
  }

  return { login, logout, register, getSession, isLoggedIn, requireAuth };

})();
