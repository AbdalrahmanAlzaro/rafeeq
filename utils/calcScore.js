const calcScore = (questions, answers) => {
  let totalScore = 0;
  let totalMarks = 0;

  const processedAnswers = questions.map((question) => {
    const answer = answers.find((a) => a.question_id === question.id);
    const isCorrect = answer && answer.answer_given === question.correct_answer;
    const pointsEarned = isCorrect ? question.points : 0;

    totalScore += pointsEarned;
    totalMarks += question.points;

    return {
      question_id: question.id,
      answer_given: answer ? answer.answer_given : null,
      is_correct: isCorrect,
      points: pointsEarned,
    };
  });

  const percentage = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;

  return {
    score: totalScore,
    total_marks: totalMarks,
    percentage: Math.round(percentage * 100) / 100,
    answers: processedAnswers,
  };
};

module.exports = calcScore;
