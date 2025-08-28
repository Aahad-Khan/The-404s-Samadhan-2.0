// Counter.jsx
import React, { useState } from "react";

function Counter() {
  // State for the counter
  const [counter, setCounter] = useState(0);

  // Increment and Decrement handlers
  const increment = () => setCounter(counter + 1);
  const decrement = () => setCounter(counter - 1);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow-lg w-64 mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Counter</h2>
      <div className="flex items-center">
        <button
          className="bg-red-500 text-white text-xl px-4 py-2 rounded-full hover:bg-red-600 transition duration-200 ease-in-out"
          onClick={decrement}
        >
          -
        </button>
        <span className="mx-6 text-3xl font-bold text-gray-800">{counter}</span>
        <button
          className="bg-green-500 text-white text-xl px-4 py-2 rounded-full hover:bg-green-600 transition duration-200 ease-in-out"
          onClick={increment}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Counter;
