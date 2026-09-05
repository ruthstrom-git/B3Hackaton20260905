require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const { initSchema } = require('./db');
const conversationsRouter = require('./routes/conversations');

const app = express();
const PORT = process.env.PORT || 3000;
const openapiSpec = yaml.load(fs.readFileSync(path.join(__dirname, 'openapi.yaml'), 'utf8'));

app.use(express.json());
app.use('/api/conversations', conversationsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin.html')));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal server error' });
});

initSchema()
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to initialize database schema', err);
    process.exit(1);
  });
