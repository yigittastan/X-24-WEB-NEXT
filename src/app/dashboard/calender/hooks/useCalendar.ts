"use client";
import { useState, useEffect, useCallback } from "react";

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

const months = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const daysOfWeek = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

export function useCalendar() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>(defaultTaskTypes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState<TaskForm>({
    title: "",
    description: "",
    date: "",
    time: "",
    typeId: 1,
    completed: false,
    priority: "medium",
  });

  // Helpers for task types
  const getTypeColor = (typeId: number): string => {
    const taskType = taskTypes.find((type) => type.id === typeId);
    return taskType ? taskType.color : "bg-gray-500";
  };

  const getTypeName = (typeId: number): string => {
    const taskType = taskTypes.find((type) => type.id === typeId);
    return taskType ? taskType.name : "Bilinmeyen";
  };

  // API Functions wrapped with useCallback
  const fetchTaskTypes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/task-types`);
      if (!response.ok) throw new Error("Görev türleri yüklenirken hata oluştu");
      const data = await response.json();
      setTaskTypes(data);
    } catch (err) {
      console.error("Error fetching task types:", err);
      setTaskTypes(defaultTaskTypes);
    }
  }, [API_BASE_URL]);

  const fetchTasks = useCallback(async () => {
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
  }, [API_BASE_URL]);

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
      resetForm();
      setShowTaskModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  };

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
      setEditingTask(null);
      setShowTaskModal(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  };

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

  const toggleTaskCompletion = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await updateTask(id, { completed: !task.completed });
  };

  // Utility functions for calendar
  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday = 0
    const days: (number | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const navigateMonth = (direction: number): void => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getTasksForDate = (day: number): Task[] => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    return tasks.filter((task) => task.date === dateStr);
  };

  const getTodaysTasks = (): Task[] => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
    return tasks.filter((task) => task.date === todayStr);
  };

  const getUpcomingTasks = (): Task[] => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    return tasks
      .filter((task) => task.date > todayStr && !task.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const openModalForNewTask = (date?: string) => {
    setTaskForm({
      title: "",
      description: "",
      date: date || formatDateISO(currentDate),
      time: "",
      typeId: 1,
      completed: false,
      priority: "medium",
    });
    setShowTaskModal(true);
    setEditingTask(null);
  };

  const openModalForEditTask = (task: Task) => {
    setTaskForm({
      title: task.title,
      description: task.description || "",
      date: task.date,
      time: task.time,
      typeId: task.typeId,
      completed: task.completed,
      priority: "medium",
    });
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const resetForm = () => {
    setTaskForm({
      title: "",
      description: "",
      date: formatDateISO(currentDate),
      time: "",
      typeId: 1,
      completed: false,
      priority: "medium",
    });
  };

  const formatDateISO = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetchTaskTypes();
    fetchTasks();
  }, [fetchTaskTypes, fetchTasks]);

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    tasks,
    taskTypes,
    loading,
    error,
    showTaskModal,
    setShowTaskModal,
    editingTask,
    taskForm,
    setTaskForm,
    getTypeColor,
    getTypeName,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getDaysInMonth,
    navigateMonth,
    getTasksForDate,
    getTodaysTasks,
    getUpcomingTasks,
    openModalForNewTask,
    openModalForEditTask,
    resetForm,
    months,
    daysOfWeek,
  };
}
