"use client";

import { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface IProps {
  filter: string;
}

const TodoList = ({ filter }: IProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const fetchTodos = async () => {
    setLoading(true);
    const token = Cookies.get("token");

    try {
      const query = filter ? `?status=${encodeURIComponent(filter)}` : "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

    toast.success(data.message);

    fetchTodos();
  };

  const openUpdateModal = (todo: Todo) => {
    setCurrentTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      status: todo.status,
    });
    setErrors({});
    setIsUpdateModalOpen(true);
  };

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateSubmit = async () => {
    if (!validate() || !currentTodo) return;

    const token = Cookies.get("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/${currentTodo.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error("Something went wrong");

      return;
    }

    toast.success(data.message);

    setIsUpdateModalOpen(false);

    setCurrentTodo(null);

    setFormData({ title: "", description: "", status: "pending" });

    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

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
              onClick={() => openUpdateModal(todo)}
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

      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative bg-white p-6 rounded shadow-lg w-full max-w-md z-10">
            <h2 className="text-lg font-semibold mb-4">Update Todo</h2>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`w-full border rounded px-3 py-2 mb-1 focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mb-2">{errors.title}</p>
            )}
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`w-full border rounded px-3 py-2 mb-1 focus:outline-none focus:ring-2 ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mb-2">{errors.description}</p>
            )}
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
