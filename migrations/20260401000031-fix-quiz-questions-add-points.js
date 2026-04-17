'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('quiz_questions', 'points', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
    await queryInterface.addColumn('quiz_questions', 'explanation_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('quiz_questions', 'explanation_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('quiz_questions', 'points');
    await queryInterface.removeColumn('quiz_questions', 'explanation_ar');
    await queryInterface.removeColumn('quiz_questions', 'explanation_en');
  },
};
