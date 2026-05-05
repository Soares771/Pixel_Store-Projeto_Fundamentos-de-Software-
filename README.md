# 🎮 Pixel Store — Loja Online de Games
**Atividade 03 | Desenvolvimento Ágil + Prática de XP**
Disciplina: Fundamentos de Engenharia de Software — 2026.1

---

## 📁 Estrutura do Projeto

```
pixel-store/
│
├── index.html                  ← Ponto de entrada (redireciona ao login)
│
├── pages/
│   ├── login.html              ← Tela de autenticação
│   └── catalog.html            ← Catálogo + Drawer do Carrinho
│
├── css/
│   ├── global.css              ← Variáveis, reset, tipografia, utilitários
│   ├── login.css               ← Estilos exclusivos do login
│   ├── catalog.css             ← Navbar, hero, filtros, grid de jogos
│   └── cart.css                ← Drawer lateral do carrinho
│
└── js/
    ├── data/
    │   ├── users.js            ← "BD" de usuários (mock back-end)
    │   └── games.js            ← "BD" do catálogo de jogos (mock back-end)
    │
    ├── auth.js                 ← Login, logout, sessão (sessionStorage)
    ├── cart.js                 ← CRUD do carrinho (localStorage)
    ├── catalog.js              ← Renderização, filtros, integração carrinho
    └── login.js                ← Controller do formulário de login
```

---

## 🚀 Como rodar

> Abra diretamente no navegador **ou** use uma extensão como **Live Server** (VS Code).

```bash
# Opção 1 — abrir direto
Abra o arquivo  index.html  no navegador.

# Opção 2 — Live Server (recomendado)
Instale a extensão "Live Server" no VS Code.
Clique com botão direito em index.html → "Open with Live Server".
```

---

## 🔑 Credenciais de teste

| E-mail                  | Senha      |
|-------------------------|------------|
| jogador@email.com       | 123456     |
| teste@email.com         | senha123   |
| carlos@email.com        | carlos321  |

---

## 📋 User Stories (Atividade 03)

| US | Prioridade | Peso | Status |
|----|------------|------|--------|
| **COMO** cliente logado **EU QUERO** adicionar um jogo ao carrinho **PARA QUE** eu possa finalizar a compra de todos os itens de uma vez. | Prioritária | 5 | ✅ Implementada |
| **COMO** visitante **EU QUERO** fazer login com e-mail e senha **PARA QUE** eu possa acessar a loja de forma segura. | Essencial | 3 | ✅ Implementada |
| **COMO** cliente **EU QUERO** filtrar jogos por gênero **PARA QUE** eu encontre mais rápido o jogo que busco. | Desejável | 1 | ✅ Implementada |

---

## 🏗️ Decisões de Arquitetura

- **Sem framework**: HTML/CSS/JS puro para máxima portabilidade e facilidade de avaliação.
- **Módulos IIFE**: `Auth`, `Cart` e `Catalog` são módulos isolados com escopo próprio.
- **Mock back-end**: `js/data/` simula tabelas de BD; fácil substituição por API REST.
- **Sessão**: `sessionStorage` para o token do usuário; `localStorage` para o carrinho.
- **Proteção de rota**: `Auth.requireAuth()` no início de cada página protegida.

---

