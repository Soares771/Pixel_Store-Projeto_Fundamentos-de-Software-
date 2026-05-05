// ============================================================
//  PIXEL STORE — js/data/users.js
//  "Banco de dados" simulado de usuários (mock back-end)
//  Em produção: substituir por chamadas à API / banco real
// ============================================================

const USERS_DB = [
  {
    id: 1,
    name: "Alex Gamer",
    email: "jogador@email.com",
    password: "123456",      // ⚠️ Em produção: armazenar hash (bcrypt)
    avatar: "🎮",
    joinedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Maria Dev",
    email: "teste@email.com",
    password: "senha123",
    avatar: "👾",
    joinedAt: "2024-03-22",
  },
  {
    id: 3,
    name: "Carlos XP",
    email: "carlos@email.com",
    password: "carlos321",
    avatar: "🕹️",
    joinedAt: "2025-06-10",
  },
];
