'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('homeworks', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      teacher_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'teachers', key: 'id' },
        onDelete: 'CASCADE',
      },
      child_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'child_profiles', key: 'id' },
        onDelete: 'CASCADE',
      },
      title_ar: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      title_en: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      description_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      teacher_file_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      child_file_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'pending',
        allowNull: false,
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('now()'),
        allowNull: false,
      },
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE homeworks ADD CONSTRAINT chk_hw_due_date CHECK (due_date >= start_date);"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE homeworks ADD CONSTRAINT chk_hw_status CHECK (status IN ('pending', 'submitted'));"
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('homeworks');
  },
};
