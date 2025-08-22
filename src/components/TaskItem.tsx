"use client";

import { useState } from "react";
import { Check, Trash2, Edit3, X, Save } from "lucide-react";
import { formatDate } from "../lib/utils";
import { Card, CardContent } from "./ui/card";
import { Task } from "../../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

export default function TaskItem({
  task,
  onTaskUpdated,
  onTaskDeleted,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || "",
  });

  const handleToggleComplete = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          taskId: task.id,
          completed: !task.completed,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onTaskUpdated();
      } else {
        alert(`Failed to update task: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred while updating the task");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/tasks?taskId=${task.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        onTaskDeleted();
      } else {
        alert(`Failed to delete task: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the task");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      title: task.title,
      description: task.description || "",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editData.title.trim()) {
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          taskId: task.id,
          title: editData.title.trim(),
          description: editData.description.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditing(false);
        onTaskUpdated();
      } else {
        alert(`Failed to update task: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred while updating the task");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card
      className={`transition-all duration-200 ${
        task.completed ? "opacity-75" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <button
            onClick={handleToggleComplete}
            disabled={isUpdating || isDeleting || isEditing}
            className={`flex-shrink-0 mt-1 w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
              task.completed
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-green-400"
            } ${
              isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {task.completed && <Check className="w-3 h-3" />}
          </button>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleChange}
                  placeholder="Task title"
                  disabled={isUpdating}
                  autoFocus
                />

                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleChange}
                  placeholder="Description (optional)"
                  rows={2}
                  disabled={isUpdating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical text-sm"
                />

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={isUpdating || !editData.title.trim()}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3
                  className={`text-base font-medium ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </h3>

                {task.description && (
                  <p
                    className={`mt-1 text-sm ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {task.description}
                  </p>
                )}

                <p className="mt-2 text-xs text-gray-400">
                  Created {formatDate(task.createdAt)}
                  {task.updatedAt !== task.createdAt && (
                    <span className="ml-2">
                      • Updated {formatDate(task.updatedAt)}
                    </span>
                  )}
                </p>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEdit}
                disabled={isUpdating || isDeleting}
                className="text-gray-500 hover:text-blue-600"
              >
                <Edit3 className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={isUpdating || isDeleting}
                className="text-gray-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
