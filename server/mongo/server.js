require('dotenv').config({ path: require('path').join(__dirname, '../.env'), quiet: true });
const mongoose = require('mongoose');
const app = require('./app');
async function start() {
  if (!process.env.MONGO_URI) throw new Error('Укажите MONGO_URI в server/.env');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB connected');
  const server = app.listen(process.env.MONGO_PORT || 7001);
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
    server.close(async () => { await mongoose.disconnect(); });
  });
}
start().catch(() => { console.error('Не удалось запустить MongoDB сервер. Проверьте MONGO_URI и доступность MongoDB.'); process.exitCode = 1; });
