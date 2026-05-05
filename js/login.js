// ============================================================
//  PIXEL STORE — js/login.js
//  Controla o formulário de login e interações da tela
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  /* Se já estiver logado, vai direto ao catálogo */
  if (Auth.isLoggedIn()) {
    window.location.href = "catalog.html";
    return;
  }

  const form     = document.getElementById("login-form");
  const emailEl  = document.getElementById("email");
  const passEl   = document.getElementById("password");
  const errorEl  = document.getElementById("login-error");
  const submitBtn = document.getElementById("login-btn");

  /* ── Submissão do formulário ──────────────────────────── */
  function handleLogin(e) {
    if (e) e.preventDefault();

    errorEl.classList.remove("visible");
    submitBtn.textContent = "Entrando...";
    submitBtn.disabled = true;

    /* Pequeno delay para simular latência de rede */
    setTimeout(() => {
      const result = Auth.login(emailEl.value, passEl.value);

      if (result.ok) {
        submitBtn.textContent = "✓ Redirecionando...";
        setTimeout(() => { window.location.href = "catalog.html"; }, 400);
      } else {
        errorEl.textContent = result.error;
        errorEl.classList.add("visible");
        submitBtn.textContent = "ENTRAR";
        submitBtn.disabled = false;
        passEl.value = "";
        passEl.focus();
      }
    }, 350);
  }

  form.addEventListener("submit", handleLogin);

  /* ── Limpa erro ao digitar ────────────────────────────── */
  [emailEl, passEl].forEach((el) => {
    el.addEventListener("input", () => errorEl.classList.remove("visible"));
  });

  /* ── Modal de Registro ────────────────────────────────── */
  const modal          = document.getElementById("register-modal");
  const openRegBtn     = document.getElementById("open-register-btn");
  const closeRegBtn    = document.getElementById("close-register-btn");
  const registerForm   = document.getElementById("register-form");
  const regNameEl      = document.getElementById("reg-name");
  const regEmailEl     = document.getElementById("reg-email");
  const regPassEl      = document.getElementById("reg-password");
  const regConfirmEl   = document.getElementById("reg-confirm");
  const regErrorEl     = document.getElementById("register-error");
  const regBtn         = document.getElementById("register-btn");

  function openModal() {
    modal.classList.add("open");
    regNameEl.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    registerForm.reset();
    regErrorEl.classList.remove("visible");
  }

  openRegBtn.addEventListener("click", openModal);
  closeRegBtn.addEventListener("click", closeModal);

  /* Fecha ao clicar no overlay (fora do card) */
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  /* Fecha com Escape */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  /* Limpa erro ao digitar */
  [regNameEl, regEmailEl, regPassEl, regConfirmEl].forEach((el) => {
    el.addEventListener("input", () => regErrorEl.classList.remove("visible"));
  });

  /* ── Submissao do formulario de registro ───────────────── */
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    regErrorEl.classList.remove("visible");

    if (regPassEl.value !== regConfirmEl.value) {
      regErrorEl.textContent = "As senhas nao conferem.";
      regErrorEl.classList.add("visible");
      regConfirmEl.focus();
      return;
    }

    regBtn.textContent = "Criando conta...";
    regBtn.disabled = true;

    setTimeout(() => {
      const result = Auth.register(regNameEl.value, regEmailEl.value, regPassEl.value);

      if (result.ok) {
        regBtn.textContent = "Conta criada com sucesso!";
        setTimeout(() => { window.location.href = "catalog.html"; }, 600);
      } else {
        regErrorEl.textContent = result.error;
        regErrorEl.classList.add("visible");
        regBtn.textContent = "CRIAR CONTA";
        regBtn.disabled = false;
      }
    }, 350);
  });


});
