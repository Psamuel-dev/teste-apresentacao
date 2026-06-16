# projeto-seguranca-sdlc

Projeto didático para a disciplina de **Segurança de Software — Tema 11**  
Demonstração prática do **GitHub Advanced Security (GHAS)**

> ⚠️ As vulnerabilidades são **intencionais** e **fictícias**. Apenas para fins didáticos.

---

## O que esse projeto aciona no GitHub Security

| Ferramenta | O que detecta | Arquivo |
|---|---|---|
| **Dependabot** | 3 dependências com CVEs | `package.json` |
| **Code Scanning (CodeQL)** | SQL Injection + Command Injection | `src/app.js` |
| **Secret Scanning** | Token GitHub exposto | `src/config.js` |

---

## Vulnerabilidades e correções

### 1. Dependabot — dependências desatualizadas (`package.json`)

| Pacote | Versão vulnerável | CVE | Correção |
|---|---|---|---|
| minimist | 1.2.5 | CVE-2021-44906 (CVSS 9.8) | Atualizar para 1.2.6 |
| lodash | 4.17.15 | CVE-2021-23337 (CVSS 7.2) | Atualizar para 4.17.21 |
| express | 4.17.1 | CVE-2022-24999 (CVSS 5.3) | Atualizar para 4.18.2 |

**Correção:** aceitar os Pull Requests automáticos do Dependabot, ou rodar:
```bash
npm update
```

---

### 2. Code Scanning — SQL Injection (`src/app.js`, linha 20)

**❌ Código com problema:**
```js
const query = "SELECT * FROM usuarios WHERE nome = '" + nome + "'";
```

**✅ Correção — usar prepared statement:**
```js
const query = "SELECT * FROM usuarios WHERE nome = ?";
db.get(query, [nome], callback);
```

---

### 3. Code Scanning — Command Injection via lodash (`src/app.js`, linha 38)

**❌ Código com problema:**
```js
const compilar = _.template(texto); // texto vem do usuário
```

**✅ Correção — nunca passar entrada do usuário para _.template():**
```js
// Usar apenas strings fixas definidas no código
const compilar = _.template("Olá, <%= nome %>!");
const resultado = compilar({ nome: req.body.nome });
```

---

### 4. Secret Scanning — token exposto (`src/config.js`, linha 5)

**❌ Código com problema:**
```js
const API_TOKEN = "ghp_A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7";
```

**✅ Correção — usar variável de ambiente:**
```js
const API_TOKEN = process.env.API_TOKEN;
```
E criar um arquivo `.env` (que está no `.gitignore`):
```
API_TOKEN=seu_token_aqui
```

---

## Como usar para a apresentação

### Passo 1 — Criar repositório público no GitHub
```bash
git init
git remote add origin https://github.com/<seu-usuario>/projeto-seguranca-sdlc.git
git add .
git commit -m "projeto inicial"
git push -u origin main
```

### Passo 2 — Ativar o GitHub Advanced Security
`Settings` → `Code security and analysis` → ativar tudo:
- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Code scanning → Set up → Default
- ✅ Secret scanning (já ativo em repositórios públicos)

### Passo 3 — Aguardar os alertas
| Ferramenta | Tempo |
|---|---|
| Secret Scanning | segundos |
| Dependabot | ~3 min |
| CodeQL | ~4 min |

### Passo 4 — Tirar os prints (aba Security do repositório)
- Print 1 → Security Overview (resumo geral)
- Print 2 → Dependabot: lista dos 3 alertas
- Print 3 → Dependabot: detalhe do CVE-2021-44906 (minimist)
- Print 4 → Code scanning: alerta SQL Injection com data flow
- Print 5 → Secret scanning: token detectado
- Print 6 → Security Overview zerada após as correções

### Passo 5 — Aplicar as correções e tirar print final
```bash
# Aceitar os PRs do Dependabot pelo GitHub, ou:
npm update

# Corrigir app.js e config.js conforme indicado acima
git add .
git commit -m "fix: corrige vulnerabilidades do GHAS"
git push
```
