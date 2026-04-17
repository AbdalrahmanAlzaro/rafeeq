'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("CREATE TYPE app_language AS ENUM ('ar', 'en');");
    await queryInterface.sequelize.query("CREATE TYPE user_role AS ENUM ('parent', 'teacher', 'child', 'school');");
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      role: {
        type: Sequelize.DataTypes.ENUM('parent', 'teacher', 'child', 'school'),
        allowNull: false,
      },
      national_id: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      language: {
        type: Sequelize.DataTypes.ENUM('ar', 'en'),
        defaultValue: 'ar',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('now()'),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS app_language;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS user_role;');
  },
};
