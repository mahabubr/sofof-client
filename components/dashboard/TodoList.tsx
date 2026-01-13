"use client";

import { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Cookies from "js-cookie";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    const token = Cookies.get("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setTodos(data.data || []);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = Cookies.get("token");
    if (!confirm("Are you sure you want to delete this todo?")) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    alert(data.message);
    fetchTodos();
  };

  const handleUpdate = (todo: Todo) => {
    // Example: open modal or navigate to edit page
    alert(`Update todo: ${todo.title}`);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) return <div className="p-4 text-gray-500">Loading todos...</div>;

  if (!todos.length)
    return <div className="p-4 text-gray-500">No todos found.</div>;

  return (
    <div className="p-4 space-y-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex justify-between items-start p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition bg-white"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{todo.title}</h3>
            <p className="text-gray-600">{todo.description}</p>
            <span
              className={`mt-2 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                todo.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : todo.status === "in_progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {todo.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => handleUpdate(todo)}
              className="text-blue-500 hover:text-blue-700 transition"
            >
              <FiEdit size={20} />
            </button>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-red-500 hover:text-red-700 transition"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
