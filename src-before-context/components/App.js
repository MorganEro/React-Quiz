import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import Question from './Question';
import StartScreen from './StartScreen';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishedScreen from './FinishedScreen';
import { useLocalStorageState } from './useLocalStorageState';
import Footer from './Footer';
import Timer from './Timer';

const SECS_PER_QUESTION = 30;

function App() {
  const [storedHighScore, setStoredHighScore] = useLocalStorageState(
    0,
    'highScore'
  );

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

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen
            numberOfQuestions={numberOfQuestions}
            dispatch={dispatch}
          />
        )}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numberOfQuestions={numberOfQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer
                dispatch={dispatch}
                secondsRemaining={secondsRemaining}
              />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numberOfQuestions={numberOfQuestions}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
