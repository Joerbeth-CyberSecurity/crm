const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const supabase = require('./supabaseClient');

const app = express();
app.use(cors());
app.use(express.json());

const TOKEN_PATH = path.join(__dirname, 'token.json');

function getToken() {
  try {
    const data = fs.readFileSync(TOKEN_PATH, 'utf-8');
    return JSON.parse(data).token;
  } catch {
    return 'crm_evolution_token_123456';
  }
}
function setToken(newToken) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify({ token: newToken }, null, 2));
}

// Endpoint para consultar o token
app.get('/api/integrations/token', (req, res) => {
  res.json({ token: getToken() });
});
// Endpoint para atualizar/regenerar o token
app.post('/api/integrations/token', (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string' || token.length < 8) {
    return res.status(400).json({ error: 'Token inválido (mínimo 8 caracteres).' });
  }
  setToken(token);
  res.json({ ok: true, token });
});

// Middleware de autenticação por token
function checkToken(req, res, next) {
  const token = req.headers['x-api-key'];
  if (!token || token !== getToken()) {
    return res.status(401).json({ error: 'Token inválido ou ausente.' });
  }
  next();
}

// Endpoint para receber webhooks do Evolution
app.post('/api/webhook/evolution', checkToken, async (req, res) => {
  console.log('Webhook recebido do Evolution:', req.body);
  // Salvar log do webhook recebido
  await supabase.from('webhook_logs').insert({
    source: 'evolution',
    payload: req.body,
    received_at: new Date().toISOString()
  });
  // Aqui você pode salvar no banco, processar, etc.
  res.status(200).json({ ok: true });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Backend CRM rodando em http://localhost:${PORT}`);
  console.log(`Webhook Evolution: http://localhost:${PORT}/api/webhook/evolution`);
  console.log(`Token atual: ${getToken()}`);
}); 