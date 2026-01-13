import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface IProps {
  setFilter: (filter: string) => void;
  filter: string;
}

const Filter = ({ setFilter, filter }: IProps) => {
  const filterOptions: string[] = ["pending", "in_progress", "done"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const router = useRouter();

  const handleClick = (option: string) => {
    setFilter(option === filter ? "" : option);
  };

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

      const token = Cookies.get("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error("Something went wrong");

      return;
    }

    toast.success(data.message);

    setIsModalOpen(false);

    setFormData({ title: "", description: "", status: "pending" });

    router.refresh();
  };

  return (
    <div>
      <div className="flex gap-2 text-sm border-b pb-4 border-gray-300 items-center">
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleClick(option)}
            className={`px-4 py-2 rounded-full border transition cursor-pointer ${
              filter === option
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {option.replace("_", " ").toUpperCase()}
          </button>
        ))}
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-auto px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
        >
          Create
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative bg-white p-6 rounded shadow-lg w-full max-w-md z-10">
            <h2 className="text-lg font-semibold mb-4">Create Item</h2>
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
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
