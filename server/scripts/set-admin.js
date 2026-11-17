require('dotenv').config({ quiet: true });
const { sequelize, User } = require('../models');
async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) throw new Error('Использование: npm run set-admin -- email@example.com');
  const [count] = await User.update({ role: 'admin' }, { where: { email } });
  if (!count) throw new Error('Пользователь не найден. Сначала зарегистрируйте его.');
  console.log(`Роль admin назначена пользователю ${email}`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => sequelize.close());
