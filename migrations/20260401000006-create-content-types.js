'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('content_types', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    });
    await queryInterface.bulkInsert('content_types', [
      { id: 1, name: 'quiz' },
      { id: 2, name: 'homework' },
      { id: 3, name: 'activity' },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('content_types');
  },
};
