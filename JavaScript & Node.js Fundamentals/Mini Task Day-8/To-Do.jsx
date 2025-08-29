/* src/styles.css */

.App {
  font-family: sans-serif;
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.input-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
}

.input-container input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex-grow: 1;
  font-size: 16px;
  outline: none;
}

.input-container input:focus {
  border-color: #007bff;
}

.input-container button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.input-container button:hover {
  background-color: #0056b3;
}

.todo-list {
  list-style: none;
  padding: 0;
  text-align: left;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.todo-item:hover {
  transform: translateY(-2px);
}

.todo-text {
  flex-grow: 1;
  font-size: 18px;
  color: #555;
  cursor: pointer;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #aaa;
}

.remove-btn {
  padding: 6px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.remove-btn:hover {
  background-color: #c82333;
}
