import React from 'react';

function NextButton({ dispatch, answer, index, numberOfQuestions }) {
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
