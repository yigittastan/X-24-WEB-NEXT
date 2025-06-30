"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Calendar, Clock, Trash2, Edit, Save } from "lucide-react";

interface TaskType {
  id: number;
  name: string;
  color: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  color: string;
  typeId: number;
  typeName: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaskForm {
  title: string;
  description: string;
  date: string;
  time: string;
  typeId: number;
  completed: boolean;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState<TaskForm>({
    title: "",
    description: "",
    date: "",
    time: "",
    typeId: 1
    
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

  // Örnek görev türleri - API'den çekilecek
  const defaultTaskTypes: TaskType[] = [
    { id: 1, name: "Toplantı", color: "bg-blue-500" },
    { id: 2, name: "Proje", color: "bg-red-500" },
    { id: 3, name: "Görev", color: "bg-purple-500" },
    { id: 4, name: "Etkinlik", color: "bg-green-500" },
    { id: 5, name: "Kişisel", color: "bg-yellow-500" },
  ];

  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ];

  const daysOfWeek = [
    "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar",
  ];

  const getTypeColor = (typeId: number): string => {
    const taskType = taskTypes.find(type => type.id === typeId);
    return taskType ? taskType.color : "bg-gray-500";
  };

  const getTypeName = (typeId: number): string => {
    const taskType = taskTypes.find(type => type.id === typeId);
    return taskType ? taskType.name : "Bilinmeyen";
  };

  // API Functions
  const fetchTaskTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/task-types`);
      if (!response.ok) throw new Error('Görev türleri yüklenirken hata oluştu');
      const data = await response.json();
      setTaskTypes(data);
    } catch (err) {
      console.error('Error fetching task types:', err);
      // Hata durumunda varsayılan türleri kullan
      setTaskTypes(defaultTaskTypes);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error('Görevler yüklenirken hata oluştu');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: TaskForm) => {
    setLoading(true);
    try {
      const selectedType = taskTypes.find(type => type.id === taskData.typeId);
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          color: selectedType?.color || "bg-gray-500",
          typeName: selectedType?.name || "Bilinmeyen",
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error('Görev oluşturulurken hata oluştu');
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      resetForm();
      setShowTaskModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: number, taskData: Partial<TaskForm>) => {
    setLoading(true);
    try {
      const selectedType = taskTypes.find(type => type.id === taskData.typeId);
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          color: selectedType?.color || "bg-gray-500",
          typeName: selectedType?.name || "Bilinmeyen",
          updatedAt: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error('Görev güncellenirken hata oluştu');
      const updatedTask = await response.json();
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      setEditingTask(null);
      setShowTaskModal(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('Bu görevi silmek istediğinizden emin misiniz?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Görev silinirken hata oluştu');
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    await updateTask(id, { completed: !task.completed });
  };

  // Load tasks and task types on component mount
  useEffect(() => {
    fetchTaskTypes();
    fetchTasks();
  }, []);

  // Utility Functions
  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

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
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getTasksForDate = (day: number): Task[] => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.date === dateStr);
  };

  const getTodaysTasks = (): Task[] => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return tasks.filter(task => task.date === todayStr);
  };

  const getUpcomingTasks = (): Task[] => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return tasks
      .filter(task => task.date > todayStr && !task.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const openTaskModal = (date?: string) => {
    if (date) {
      setTaskForm(prev => ({ ...prev, date }));
    }
    setShowTaskModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      date: task.date,
      time: task.time,
      typeId: task.typeId
    });
    setShowTaskModal(true);
  };

  const resetForm = () => {
    setTaskForm({
      title: "",
      description: "",
      date: "",
      time: "",
      typeId: 1
    });
    setEditingTask(null);
  };

  const handleSubmit = () => {
    if (!taskForm.title.trim() || !taskForm.date || !taskForm.time || !taskForm.typeId) {
      setError("Lütfen tüm gerekli alanları doldurun");
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, taskForm);
    } else {
      createTask(taskForm);
    }
  };

  const days = getDaysInMonth(currentDate);
  const todaysTasks = getTodaysTasks();
  const upcomingTasks = getUpcomingTasks();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Takvim</h1>
          <div className="flex gap-3">
            <button
              onClick={() => openTaskModal()}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-medium text-white transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Görev Ekle
            </button>
            <button
              onClick={fetchTasks}
              disabled={loading}
              className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-lg font-medium text-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Yükleniyor..." : "Yenile"}
            </button>
          </div>
        </div>

        {/* Quick Add Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Hızlı Görev Ekle</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Görev başlığı..."
              value={taskForm.title}
              onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              value={taskForm.date}
              onChange={(e) => setTaskForm(prev => ({ ...prev, date: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="time"
              value={taskForm.time}
              onChange={(e) => setTaskForm(prev => ({ ...prev, time: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={taskForm.typeId}
              onChange={(e) => setTaskForm(prev => ({ ...prev, typeId: parseInt(e.target.value) }))}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {taskTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleSubmit}
              disabled={loading || !taskForm.title.trim() || !taskForm.date || !taskForm.time}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ekle
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button onClick={() => setError("")} className="float-right">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-3">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="bg-gray-300 hover:bg-gray-400 p-2 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="bg-gray-300 hover:bg-gray-400 p-2 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-gray-50">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="p-4 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {days.map((day, index) => {
                  const dayTasks = day ? getTasksForDate(day) : [];
                  const today = day ? isToday(day) : false;
                  const dateStr = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : "";

                  return (
                    <div
                      key={index}
                      className={`
                        min-h-32 p-2 border-r border-b border-gray-200 last:border-r-0
                        ${day ? "hover:bg-gray-50 cursor-pointer" : "bg-gray-50"}
                        ${today ? "bg-blue-50 border-blue-200" : ""}
                        ${selectedDate === day ? "bg-blue-100" : ""}
                      `}
                      onClick={() => day && setSelectedDate(day)}
                      onDoubleClick={() => day && openTaskModal(dateStr)}
                    >
                      {day && (
                        <>
                          <div className="flex justify-between items-center mb-1">
                            <div
                              className={`text-sm font-medium ${
                                today ? "text-blue-600" : "text-gray-700"
                              }`}
                            >
                              {day}
                            </div>
                            {dayTasks.length > 0 && (
                              <span className="text-xs bg-gray-200 text-gray-600 px-1 rounded">
                                {dayTasks.length}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            {dayTasks.slice(0, 3).map((task) => (
                              <div
                                key={task.id}
                                className={`text-xs p-1 rounded text-white truncate cursor-pointer ${task.color} ${task.completed ? 'opacity-50 line-through' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(task);
                                }}
                                title={task.title}
                              >
                                {task.title}
                              </div>
                            ))}
                            {dayTasks.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{dayTasks.length - 3} daha
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Tasks */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bugünün Görevleri ({todaysTasks.length})
              </h3>
              <div className="space-y-3">
                {todaysTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="w-4 h-4"
                    />
                    <div className={`w-3 h-3 rounded-full ${task.color}`}></div>
                    <div className="flex-1">
                      <div className={`font-medium text-gray-800 ${task.completed ? 'line-through opacity-60' : ''}`}>
                        {task.title}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {task.time}
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {task.typeName}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-1 text-gray-400 hover:text-blue-500"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {todaysTasks.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Bugün görev yok
                  </p>
                )}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Yaklaşan Görevler
              </h3>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-3 h-3 rounded-full ${task.color}`}></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {task.title}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.date).toLocaleDateString('tr-TR')}
                        <Clock className="w-3 h-3" />
                        {task.time}
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {task.typeName}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-1 text-gray-400 hover:text-blue-500"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {upcomingTasks.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Yaklaşan görev yok
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Task Modal */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingTask ? 'Görevi Düzenle' : 'Yeni Görev'}
                </h3>
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Görev Başlığı *
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Görev başlığını girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Görev açıklaması (opsiyonel)"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tarih *
                    </label>
                    <input
                      type="date"
                      value={taskForm.date}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Saat *
                    </label>
                    <input
                      type="time"
                      value={taskForm.time}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Görev Türü *
                  </label>
                  <select
                    value={taskForm.typeId}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, typeId: parseInt(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {taskTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Renk:</span>
                    <div className={`w-4 h-4 rounded-full ${getTypeColor(taskForm.typeId)}`}></div>
                    <span className="text-sm text-gray-600">{getTypeName(taskForm.typeId)}</span>
                  </div>
                </div>
                    </label>
                    <select
                      value={taskForm.color}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {colorOptions.map(color => (
                        <option key={color.value} value={color.value}>
                          {color.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Öncelik
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Düşük</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksek</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Kaydediliyor...' : (editingTask ? 'Güncelle' : 'Kaydet')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}