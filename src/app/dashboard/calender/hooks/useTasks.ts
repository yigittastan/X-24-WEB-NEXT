// hooks/useTasks.ts
import { useState, useEffect } from "react";

export interface TaskType {
  id: number;
  name: string;
  color: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  color: string;
  typeId: number;
  typeName: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskForm {
  title: string;
  description?: string;
  date: string;
  time: string;
  typeId: number;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

const defaultTaskTypes: TaskType[] = [
  { id: 1, name: "Toplantı", color: "bg-blue-500" },
  { id: 2, name: "Proje", color: "bg-red-500" },
  { id: 3, name: "Görev", color: "bg-purple-500" },
  { id: 4, name: "Etkinlik", color: "bg-green-500" },
  { id: 5, name: "Kişisel", color: "bg-yellow-500" },
];

export function useTasks() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>(defaultTaskTypes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch task types
  const fetchTaskTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/task-types`);
      if (!response.ok) throw new Error("Görev türleri yüklenirken hata oluştu");
      const data = await response.json();
      setTaskTypes(data);
    } catch (err) {
      console.error("Error fetching task types:", err);
      setTaskTypes(defaultTaskTypes);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error("Görevler yüklenirken hata oluştu");
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create task
  const createTask = async (taskData: TaskForm) => {
    setLoading(true);
    try {
      const selectedType = taskTypes.find((type) => type.id === taskData.typeId);
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskData,
          color: selectedType?.color || "bg-gray-500",
          typeName: selectedType?.name || "Bilinmeyen",
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Görev oluşturulurken hata oluştu");
      const newTask = await response.json();
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  };

  // Update task
  const updateTask = async (id: number, taskData: Partial<TaskForm>) => {
    setLoading(true);
    try {
      const selectedType = taskTypes.find((type) => type.id === taskData.typeId);
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskData,
          color: selectedType?.color || "bg-gray-500",
          typeName: selectedType?.name || "Bilinmeyen",
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Görev güncellenirken hata oluştu");
      const updatedTask = await response.json();
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (id: number) => {
    if (!confirm("Bu görev silmek istediğinizden emin misiniz?")) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Görev silinirken hata oluştu");
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  };

  // Toggle completion
  const toggleTaskCompletion = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await updateTask(id, { completed: !task.completed });
  };

  // Initial fetch
  useEffect(() => {
    fetchTaskTypes();
    fetchTasks();
  }, []);

  return {
    tasks,
    taskTypes,
    loading,
    error,
    setError,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
}
