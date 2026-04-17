'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('child_assessments', {
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
      teacher_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'teachers', key: 'id' },
        onDelete: 'CASCADE',
      },
      result_level: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('now()'),
        allowNull: false,
      },
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE child_assessments ADD CONSTRAINT chk_ca_result_level CHECK (result_level IN (1, 2, 3));"
    );

    await queryInterface.createTable('child_assessment_answers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      assessment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'child_assessments', key: 'id' },
        onDelete: 'CASCADE',
      },
      question_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'assessment_questions', key: 'id' },
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
      "ALTER TABLE child_assessment_answers ADD CONSTRAINT chk_caa_selected_option CHECK (selected_option IN (1, 2, 3, 4));"
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('child_assessment_answers');
    await queryInterface.dropTable('child_assessments');
  },
};
