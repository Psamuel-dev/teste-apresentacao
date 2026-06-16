// src/app.js
// Aplicação Express simples — disciplina de Segurança de Software
// ATENÇÃO: contém vulnerabilidades intencionais para fins didáticos.

const express = require("express");
const _ = require("lodash");
const minimist = require("minimist");

const app = express();
app.use(express.json());

// =============================================================
// VULNERABILIDADE 1 — SQL Injection (aciona CodeQL)
// O nome digitado pelo usuário é colado direto na query SQL,
// sem nenhum filtro. Um atacante pode digitar:
//   ' OR '1'='1   →  retorna todos os usuários
//
// CORREÇÃO SIMPLES: usar ? no lugar do nome e passar como parâmetro
//   const query = "SELECT * FROM usuarios WHERE nome = ?";
//   db.get(query, [nome], callback);
// =============================================================
app.get("/usuario", (req, res) => {
  const { nome } = req.query;

  // ❌ ERRADO — concatenação direta (SQL Injection)
  const query = "SELECT * FROM usuarios WHERE nome = '" + nome + "'";

  // Simulando retorno do banco para fins didáticos
  res.json({ query_executada: query });
});

// =============================================================
// VULNERABILIDADE 2 — Uso de lodash.template() com entrada
// do usuário (aciona CodeQL / Dependabot — CVE-2021-23337)
// Um atacante pode injetar código via <%= process.exit(1) %>
//
// CORREÇÃO SIMPLES: nunca passar entrada do usuário para _.template()
//   Use apenas templates com strings fixas definidas no código.
// =============================================================
app.post("/mensagem", (req, res) => {
  const { texto } = req.body;

  // ❌ ERRADO — entrada do usuário direto no template
  const compilar = _.template(texto);
  const resultado = compilar({});

  res.json({ resultado });
});

// Inicia servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
