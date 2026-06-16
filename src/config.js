// src/config.js
// ATENÇÃO: token fictício exposto intencionalmente para fins didáticos.
// NUNCA salvar senhas ou tokens diretamente no código.

// ❌ ERRADO — token hardcoded no código (aciona Secret Scanning)
const API_TOKEN = "ghp_A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7";

// CORREÇÃO SIMPLES: usar variável de ambiente
// const API_TOKEN = process.env.API_TOKEN;

module.exports = { API_TOKEN };
