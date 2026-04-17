'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assessment_questions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      correct_option: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      order_num: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE assessment_questions ADD CONSTRAINT chk_aq_level CHECK (level IN (1, 2, 3));"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE assessment_questions ADD CONSTRAINT chk_aq_correct_option CHECK (correct_option IN (1, 2, 3, 4));"
    );

    await queryInterface.createTable('assessment_questions_ar', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      question_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'assessment_questions', key: 'id' },
        onDelete: 'CASCADE',
      },
      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      option_1: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      option_2: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      option_3: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      option_4: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
    });

    await queryInterface.createTable('assessment_questions_en', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      question_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'assessment_questions', key: 'id' },
        onDelete: 'CASCADE',
      },
      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      option_1: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      option_2: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      option_3: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      option_4: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('assessment_questions_en');
    await queryInterface.dropTable('assessment_questions_ar');
    await queryInterface.dropTable('assessment_questions');
  },
};
