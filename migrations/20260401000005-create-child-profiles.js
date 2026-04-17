'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('child_profiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      parent_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'parents', key: 'id' },
        onDelete: 'SET NULL',
      },
      teacher_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'teachers', key: 'id' },
        onDelete: 'CASCADE',
      },
      full_name_ar: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      full_name_en: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      learning_difficulty: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      level: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      class_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      photo_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('now()'),
        allowNull: false,
      },
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE child_profiles ADD CONSTRAINT chk_child_gender CHECK (gender IN ('male', 'female'));"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE child_profiles ADD CONSTRAINT chk_child_level CHECK (level IN (1, 2, 3));"
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('child_profiles');
  },
};
