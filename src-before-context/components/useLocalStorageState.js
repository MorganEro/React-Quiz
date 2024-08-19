import { useEffect, useState } from 'react';

export function useLocalStorageState(initialState, key) {
  //useState can also accept a pure function(no parameters). This function will only be called once when the component is first rendered. This is useful when you want to compute an initial state
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
