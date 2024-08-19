import React, { useEffect } from 'react';

function Timer({ dispatch, secondsRemaining }) {
  const mins = Math.floor(secondsRemaining / 60)
    .toFixed(0)
    .padStart(2, '0');
  const secs = (secondsRemaining % 60).toFixed(0).padStart(2, '0');

  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: 'tick' });
      }, 1000);

      return () => clearInterval(id);
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {mins}:{secs}
    </div>
  );
}

export default Timer;
