import app from './api/index.js';

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GB STUDY reverse proxy server listening on port ${PORT}`);
});
