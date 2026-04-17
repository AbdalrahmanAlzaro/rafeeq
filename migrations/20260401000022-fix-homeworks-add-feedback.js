'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('homeworks', 'feedback_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('homeworks', 'feedback_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('homeworks', 'grade', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('homeworks', 'approved_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('homeworks', 'feedback_ar');
    await queryInterface.removeColumn('homeworks', 'feedback_en');
    await queryInterface.removeColumn('homeworks', 'grade');
    await queryInterface.removeColumn('homeworks', 'approved_at');
  },
};
