'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('chatbot_sessions', 'summary', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('chatbot_sessions', 'message_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('chatbot_sessions', 'summary');
    await queryInterface.removeColumn('chatbot_sessions', 'message_count');
  },
};
