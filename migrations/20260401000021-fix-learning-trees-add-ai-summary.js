'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('learning_trees', 'ai_summary_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('learning_trees', 'ai_summary_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('learning_trees', 'generated_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('learning_trees', 'ai_summary_ar');
    await queryInterface.removeColumn('learning_trees', 'ai_summary_en');
    await queryInterface.removeColumn('learning_trees', 'generated_at');
  },
};
