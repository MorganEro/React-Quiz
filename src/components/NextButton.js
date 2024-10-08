import React from 'react';
import { useQuiz } from '../contexts/QuizContext';

function NextButton() {
  const { dispatch, answer, index, numberOfQuestions } = useQuiz();
  if (answer === null) return null;

  if (index < numberOfQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        //no data needed so there is no need for a payload here
        onClick={() => dispatch({ type: 'nextQuestion' })}>
        Next
      </button>
    );

  if (index === numberOfQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        //no data needed so there is no need for a payload here
        onClick={() => dispatch({ type: 'finished' })}>
        Finish
      </button>
    );
}

export default NextButton;
