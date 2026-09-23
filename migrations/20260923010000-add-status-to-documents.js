'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('documents', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'draft',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('documents', 'status');
  },
};
