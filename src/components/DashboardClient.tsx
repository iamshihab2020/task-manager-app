"use client";

import { useState } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

export default function DashboardClient() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Task Creation Form */}
      <div className="flex justify-center">
        <TaskForm onTaskCreated={handleTaskCreated} />
      </div>

      {/* Task List */}
      <TaskList refreshTrigger={refreshTrigger} />
    </div>
  );
}
