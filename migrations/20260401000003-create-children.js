'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('children', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      parent_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      teacher_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      school_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'schools',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      name_en: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_ar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      national_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      special_need_type: {
        type: Sequelize.ENUM('autism', 'adhd', 'dyslexia', 'down_syndrome', 'other'),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      behavioral_notes_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      behavioral_notes_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      communication_notes_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      communication_notes_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      social_notes_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      social_notes_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      attention_notes_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      attention_notes_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      additional_notes_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      additional_notes_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('children');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_children_special_need_type";');
  },
};
