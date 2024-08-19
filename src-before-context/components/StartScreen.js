import React from 'react';

function StartScreen({ numberOfQuestions, dispatch }) {
  return (
    <div className="start">
      <h2> Welcome to the REACT QUIZ</h2>
      <h3>{numberOfQuestions} questions to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'start' })}>
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
