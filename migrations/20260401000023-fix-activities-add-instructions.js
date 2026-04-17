'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('activities', 'instructions_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('activities', 'instructions_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('activities', 'materials_needed_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('activities', 'materials_needed_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('activities', 'image_url', {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('activities', 'expected_outcome_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('activities', 'expected_outcome_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('activities', 'instructions_ar');
    await queryInterface.removeColumn('activities', 'instructions_en');
    await queryInterface.removeColumn('activities', 'materials_needed_ar');
    await queryInterface.removeColumn('activities', 'materials_needed_en');
    await queryInterface.removeColumn('activities', 'image_url');
    await queryInterface.removeColumn('activities', 'expected_outcome_ar');
    await queryInterface.removeColumn('activities', 'expected_outcome_en');
  },
};
