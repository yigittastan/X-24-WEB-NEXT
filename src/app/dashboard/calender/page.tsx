"use client";
import React from "react";
import MonthNavigation from "./components/MonthNavigation";
import CalendarGrid from "./components/CalendarGrid";
import TaskModal from "./components/TaskModal";
import TaskList from "./components/TaskList";
import QuickAddTask from "./components/QuickAddTask";
import { useCalendar } from "./hooks/useCalendar";

export default function CalendarPage() {
  const {
    currentDate,
    taskTypes,
    loading,
    error,
    showTaskModal,
    setShowTaskModal,
    editingTask,
    taskForm,
    setTaskForm,
    getTypeColor,
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
    months,
    daysOfWeek,
  } = useCalendar();

  const handleSubmit = () => {
    if (editingTask) {
      updateTask(editingTask.id, taskForm);
    } else {
      createTask(taskForm);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <MonthNavigation
        currentDate={currentDate}
        months={months}
        navigateMonth={navigateMonth}
        openModalForNewTask={openModalForNewTask}
      />

      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading && <div className="mb-2">Yükleniyor...</div>}

      <QuickAddTask
        onAdd={(title) => {
          createTask({
            title,
            description: "",
            date: new Date().toISOString().split("T")[0],
            time: "",
            typeId: 1,
            completed: false,
            priority: "medium",
          });
        }}
      />

      <CalendarGrid
        currentDate={currentDate}
        daysOfWeek={daysOfWeek}
        getDaysInMonth={getDaysInMonth}
        getTasksForDate={getTasksForDate}
        openModalForNewTask={openModalForNewTask}
        openModalForEditTask={openModalForEditTask}
        getTypeColor={getTypeColor}
        toggleTaskCompletion={toggleTaskCompletion}
      />

      <TaskList
        tasks={getTodaysTasks()}
        title="Bugünün Görevleri"
        getTypeColor={getTypeColor}
        openModalForEditTask={openModalForEditTask}
        toggleTaskCompletion={toggleTaskCompletion}
      />

      <TaskList
        tasks={getUpcomingTasks()}
        title="Yaklaşan Görevler"
        getTypeColor={getTypeColor}
        openModalForEditTask={openModalForEditTask}
        toggleTaskCompletion={toggleTaskCompletion}
      />

      <TaskModal
        show={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        taskTypes={taskTypes}
        form={taskForm}
        setForm={setTaskForm}
        onSubmit={handleSubmit}
        editingTask={editingTask}
        deleteTask={deleteTask}
      />
    </div>
  );
}
