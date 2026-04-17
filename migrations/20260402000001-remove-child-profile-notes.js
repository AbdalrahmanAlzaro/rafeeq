'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('child_profiles', 'behavioral_notes_en');
    await queryInterface.removeColumn('child_profiles', 'behavioral_notes_ar');
    await queryInterface.removeColumn('child_profiles', 'communication_notes_en');
    await queryInterface.removeColumn('child_profiles', 'communication_notes_ar');
    await queryInterface.removeColumn('child_profiles', 'social_notes_en');
    await queryInterface.removeColumn('child_profiles', 'social_notes_ar');
    await queryInterface.removeColumn('child_profiles', 'attention_notes_en');
    await queryInterface.removeColumn('child_profiles', 'attention_notes_ar');
    await queryInterface.removeColumn('child_profiles', 'additional_notes_en');
    await queryInterface.removeColumn('child_profiles', 'additional_notes_ar');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('child_profiles', 'behavioral_notes_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('child_profiles', 'behavioral_notes_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('child_profiles', 'communication_notes_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('child_profiles', 'communication_notes_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('child_profiles', 'social_notes_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('child_profiles', 'social_notes_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('child_profiles', 'attention_notes_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('child_profiles', 'attention_notes_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('child_profiles', 'additional_notes_ar', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('child_profiles', 'additional_notes_en', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
  },
};
