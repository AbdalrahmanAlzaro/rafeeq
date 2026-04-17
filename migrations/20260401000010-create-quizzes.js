'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quizzes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      child_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'child_profiles', key: 'id' },
        onDelete: 'CASCADE',
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total_questions: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'pending',
        allowNull: false,
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completed_at: {
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
      "ALTER TABLE quizzes ADD CONSTRAINT chk_quiz_level CHECK (level IN (1, 2, 3));"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE quizzes ADD CONSTRAINT chk_quiz_score CHECK (score IS NULL OR (score >= 0 AND score <= total_questions));"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE quizzes ADD CONSTRAINT chk_quiz_status CHECK (status IN ('pending', 'completed'));"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE quizzes ADD CONSTRAINT chk_quiz_completed_at CHECK (completed_at IS NULL OR completed_at >= started_at);"
    );

    await queryInterface.createTable('quiz_questions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      quiz_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'quizzes', key: 'id' },
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
      "ALTER TABLE quiz_questions ADD CONSTRAINT chk_qq_correct_option CHECK (correct_option IN (1, 2, 3, 4));"
    );

    await queryInterface.createTable('quiz_answers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      quiz_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'quizzes', key: 'id' },
        onDelete: 'CASCADE',
      },
      question_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'quiz_questions', key: 'id' },
        onDelete: 'CASCADE',
      },
      selected_option: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      answered_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('now()'),
        allowNull: false,
      },
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE quiz_answers ADD CONSTRAINT chk_qa_selected_option CHECK (selected_option IN (1, 2, 3, 4));"
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('quiz_answers');
    await queryInterface.dropTable('quiz_questions');
    await queryInterface.dropTable('quizzes');
  },
};
