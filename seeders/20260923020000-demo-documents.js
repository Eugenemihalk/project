'use strict';

const { Op } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('documents', [
      {
        title: 'План проекта',
        content: 'Общий документ для участников команды.',
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Правила редактирования',
        content: 'Изменения в документе согласуются с командой.',
        status: 'published',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('documents', {
      title: {
        [Op.in]: ['План проекта', 'Правила редактирования'],
      },
    });
  },
};
