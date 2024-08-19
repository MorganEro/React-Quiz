import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useLocalStorageState } from '../components/useLocalStorageState';

// 1) Create a new context. This is a hook function just like useEffect and useState. We are storing the context in a variable called AuthContext.
const QuizContext = createContext();

// 2) Create a new component called QuizProvider. This component will be used to wrap the rest of the application. It will provide the user data to the rest of the application. Add the children prop to the CitiesProvider component. This prop will be used to render the rest of the application.
function QuizProvider({ children }) {
  // 3) Put all the variables and functions that you want to share with the rest of the application inside the QuizProvider component.
  const [storedHighScore, setStoredHighScore] = useLocalStorageState(
    0,
    'highScore'
  );
  const SECS_PER_QUESTION = 30;

  const initialState = {
    questions: [],
    //different status: loading, error, ready, active, finished
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
    finished: false,
    highScore: storedHighScore,
    secondsRemaining: null,
  };

  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numberOfQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  function reducer(state, action) {
    switch (action.type) {
      case 'dataReceived':
        return {
          ...state,
          questions: action.payload,
          status: 'ready',
        };
      case 'dataLoading':
        return {
          ...state,
          status: 'loading',
        };
      case 'dataFailed':
        return {
          ...state,
          status: 'error',
        };
      case 'start':
        return {
          ...state,
          status: 'active',
          secondsRemaining: state.questions.length * SECS_PER_QUESTION,
        };
      case 'newAnswer':
        const question = state.questions.at(state.index);
        return {
          ...state,
          answer: action.payload,
          points:
            action.payload === question.correctOption
              ? state.points + question.points
              : state.points,
        };
      case 'nextQuestion':
        return {
          ...state,
          index: state.index + 1,
          answer: null,
        };
      case 'finished':
        const newHighScore =
          state.points > state.highScore ? state.points : state.highScore;
        setStoredHighScore(newHighScore);

        return {
          ...state,
          status: 'finished',
          highScore: newHighScore,
        };
      case 'restart':
        return {
          ...initialState,
          questions: state.questions,
          status: 'ready',
          highScore: state.highScore,
        };
      case 'tick':
        return {
          ...state,
          secondsRemaining: state.secondsRemaining - 1,
          status: state.secondsRemaining === 0 ? 'finished' : state.status,
        };
      default:
        throw new Error('Unknown action type');
    }
  }

  useEffect(function () {
    async function fetchQuestions() {
      try {
        const response = await fetch(`http://localhost:8000/questions`);
        if (!response.ok) throw new Error('Error fetching questions');
        const data = await response.json();
        if (data.Response === 'False') throw new Error('question not found');
        dispatch({ type: 'dataReceived', payload: data });
      } catch (error) {
        dispatch({ type: 'dataFailed' });
      }
    }
    fetchQuestions();
  }, []);

  // 4) Return the QuizContext.Provider component. This component will wrap the rest of the application and provide the user data to the rest of the application.
  return (
    <QuizContext.Provider
      //5) Pass the variables to the value prop of the QuizContext.Provider component. This will make the users and isLoading variables available to the rest of the application.
      value={{
        question: questions[index],
        index,
        answer,
        points,
        status,
        highScore,
        secondsRemaining,
        maxPossiblePoints,
        numberOfQuestions,
        dispatch,
      }}>
      {children}
    </QuizContext.Provider>
  );
}
//6)The useQuiz custom hook is designed to provide an easy way to access the value stored in QuizContext from any functional component that calls this hook. This hook will return the Quiz and isLoading variables from the context.
function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
//7) Export the useQuiz and QuizProvider components so that they can be used in the rest of the application. Use a named export instead of the default so that you can export multiple variables from the same file.
export { QuizProvider, useQuiz };
