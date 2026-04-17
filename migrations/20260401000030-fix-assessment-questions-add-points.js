'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('assessment_questions', 'points', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('assessment_questions', 'points');
  },
};
