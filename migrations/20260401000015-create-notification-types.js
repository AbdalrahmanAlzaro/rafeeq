'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notification_types', {
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
    await queryInterface.bulkInsert('notification_types', [
      { id: 1, name: 'homework_assigned' },
      { id: 2, name: 'homework_submitted' },
      { id: 3, name: 'quiz_completed' },
      { id: 4, name: 'activity_completed' },
      { id: 5, name: 'tree_ready' },
      { id: 6, name: 'message' },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notification_types');
  },
};
