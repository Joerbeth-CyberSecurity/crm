# Backend CRM - Webhook Evolution

## Como rodar

1. No terminal, acesse a pasta `backend`:
   ```
   cd backend
   ```
2. Instale as dependências (já feito):
   ```
   npm install
   ```
3. Inicie o servidor:
   ```
   node index.js
   ```

O backend estará rodando em: http://localhost:3333

## Webhook para Evolution

Configure o Evolution para enviar webhooks para:

```
http://SEU_IP_OU_DOMINIO:3333/api/webhook/evolution
```

- O endpoint aceita requisições POST com JSON.
- O corpo recebido será exibido no console do backend.
- Pronto para evoluir para salvar no banco e processar mensagens. 