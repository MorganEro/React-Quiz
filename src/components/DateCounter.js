import { useReducer } from 'react';

function reducer(state, action) {
  console.log(state, action);
  // if (action.type === 'inc') return state + action.payload;
  // if (action.type === 'dec') return state - action.payload;

  // if (action.type === 'inc') return state + 1;
  // if (action.type === 'dec') return state - 1;
  // if (action.type === 'setCount') return action.payload;

  switch (action.type) {
    case 'inc':
      return { ...state, count: state.count + state.step };
    case 'dec':
      return { ...state, count: state.count - state.step };
    case 'setCount':
      return { ...state, count: action.payload };
    case 'setStep':
      return { ...state, step: action.payload };
    case 'reset':
      return { count: 0, step: 1 };
    default:
      throw new Error('Unknown action type');
  }
}

function DateCounter() {
  // const [count, setCount] = useState(0);

  const initialState = { count: 0, step: 1 };
  //the dispatch function is used to dispatch an action to the reducer function. In use, it is very similar to the useEffect function as in a way to set the state
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state;

  // const [step, setStep] = useState(1);

  // This mutates the date object.
  const date = new Date('june 21 2027');
  date.setDate(date.getDate() + count);

  const dec = function () {
    // dispatch({ type: 'dec', payload: -1 });
    dispatch({ type: 'dec' });

    // setCount((count) => count - 1);
    // setCount(count => count - step);
  };

  const inc = function () {
    // dispatch({ type: 'inc', payload: 1 }); but since there is no data needing the be passed, we don't need to pass a payload
    dispatch({ type: 'inc' });

    // setCount((count) => count + 1);
    // setCount(count => count + step);
  };

  const defineCount = function (e) {
    dispatch({ type: 'setCount', payload: Number(e.target.value) });
    // setCount(Number(e.target.value));
  };

  const defineStep = function (e) {
    // setStep(Number(e.target.value));
    dispatch({ type: 'setStep', payload: Number(e.target.value) });
  };

  const reset = function () {
    dispatch({ type: 'reset' });
    // setCount(0);
    // setStep(1);
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input
          value={count}
          onChange={defineCount}
        />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
