import React from 'react';
import { useQuiz } from '../contexts/QuizContext';

function Progress() {
  const { index, numberOfQuestions, points, maxPossiblePoints, answer } =
    useQuiz();

  return (
    <header className="progress">
      <progress
        max={numberOfQuestions}
        value={index + Number(answer !== null)}></progress>
      <p>
        Question <strong>{index}</strong> / {numberOfQuestions}
      </p>

      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
