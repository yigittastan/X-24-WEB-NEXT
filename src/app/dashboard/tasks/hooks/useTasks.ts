// hooks/useTasks.ts
import { useState, useEffect } from "react";

export interface Task {
  id: number;
  title: string;
  description: string;
  author: string;
  status: "todo" | "in-progress" | "completed" | "pending";
  priority: "low" | "medium" | "high";
  createdAt: string;
  dueDate: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTasks = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(`${API_BASE}/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data.tasks || data);
    } catch (err) {
      console.error("Görevler yüklenirken hata:", err);
      setError("Görevler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        await fetchTasks();
      }
    } catch (err) {
      console.error("Görev oluşturulurken hata:", err);
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: Task["status"]) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchTasks();
      }
    } catch (err) {
      console.error("Görev durumu güncellenirken hata:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    error,
    loading,
    fetchTasks,
    createTask,
    updateTaskStatus,
  };
};
