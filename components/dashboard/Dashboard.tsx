"use client";

import { useState } from "react";
import Filter from "./Filter";

const Dashboard = () => {
  const [filter, setFilter] = useState("");

  return (
    <div>
      <Filter filter={filter} setFilter={setFilter} />
    </div>
  );
};

export default Dashboard;
