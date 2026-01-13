"use client";

import { useState } from "react";
import Filter from "./Filter";
import TodoList from "./TodoList";

const Dashboard = () => {
  const [filter, setFilter] = useState("");

  return (
    <div>
      <Filter filter={filter} setFilter={setFilter} />
      <TodoList filter={filter} />
    </div>
  );
};

export default Dashboard;
