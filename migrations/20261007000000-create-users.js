module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      passwordHash: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.STRING, allowNull: false, defaultValue: 'user' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.sequelize.query("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'))");
  },
  async down(queryInterface) { await queryInterface.dropTable('users'); },
};
