import React, { useEffect, useState } from "react";
import "./Home.css"; // Import the external CSS file

const Home = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:3001/api";

  useEffect(() => {
    const getTodos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/read-todos`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();
        setTodos(data.todos || []); // Ensure `todos` is an array
      } catch (error) {
        console.error("Error fetching todos:", error);
        alert("Error loading todos. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!todo.trim()) {
      alert("Todo cannot be empty!");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/create-todo`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo }),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      const data = await response.json();
      setTodos((prevTodos) => [...prevTodos, data.todo]);
      alert(data.message);
    } catch (error) {
      console.error("Error creating todo:", error);
      alert("Failed to create todo. Please try again.");
    } finally {
      setTodo("");
    }
  };

  const handleEdit = async (todoId) => {
    const updatedTodo = prompt("Update your todo");
    if (!updatedTodo) return;

    try {
      const response = await fetch(`${API_URL}/update-todo/${todoId}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedTodo }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const data = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todoItem) =>
          todoItem._id === todoId ? { ...todoItem, todo: updatedTodo } : todoItem
        )
      );
      alert(data.message);
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Failed to update todo. Please try again.");
    }
  };

  const handleDelete = async (todoId) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    try {
      const response = await fetch(`${API_URL}/delete-todo/${todoId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      const data = await response.json();
      setTodos((prevTodos) => prevTodos.filter((todoItem) => todoItem._id !== todoId));
      alert(data.message);
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete todo. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <section>
      <div className="todo-container">
        <h1 className="todo-title">Todo App</h1>
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            placeholder="Add a new todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <button type="submit" disabled={!todo.trim()}>
            Add
          </button>
        </form>
        <ul className="todo-list">
          {isLoading ? (
            <li>Loading todos...</li>
          ) : todos.length > 0 ? (
            todos.map((todoItem) =>
              todoItem?.todo ? (
                <li key={todoItem._id} className="todo-item">
                  <span>{todoItem.todo}</span>
                  <div>
                    <button
                      onClick={() => handleEdit(todoItem._id)}
                      className="edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todoItem._id)}
                      className="delete"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ) : (
                <li key={todoItem._id || Math.random()} className="todo-item">
                  <span>Invalid Todo</span>
                </li>
              )
            )
          ) : (
            <li>No todos available.</li>
          )}
        </ul>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </section>
  );
};

export default Home;
