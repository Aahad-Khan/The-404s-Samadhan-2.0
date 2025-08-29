import React, { useState } from 'react';
import './styles.css';

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        isCompleted: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const removeTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const toggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="App">
      <h1>Simple To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new to-do..."
        />
        <button onClick={addTodo}>Add To-Do</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
            <span
              onClick={() => toggleComplete(todo.id)}
              className="todo-text"
            >
              {todo.text}
            </span>
            <button onClick={() => removeTodo(todo.id)} className="remove-btn">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
