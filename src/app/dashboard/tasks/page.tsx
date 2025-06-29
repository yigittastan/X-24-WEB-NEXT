"use client";
import { useState } from "react";
import { Filter } from "lucide-react";
import { useTasks } from "./hooks/useTasks";
import TaskCard from "./components/TaskCard";
import Header from "./components/Header";
import FilterTabs from "./components/FilterTabs";

export default function TasksPage() {
  const { tasks, error, createTask } = useTasks();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const taskCounts = {
    all: tasks.length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };

  const filters = [
    { key: "all", name: `Tümü ${taskCounts.all}` },
    { key: "in-progress", name: `Devam Eden ${taskCounts["in-progress"]}` },
    { key: "completed", name: `Tamamlanan ${taskCounts.completed}` },
    { key: "todo", name: `Yapılacak ${taskCounts.todo}` },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchFilter = activeFilter === "all" || task.status === activeFilter;
    const matchSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateTask={() =>
          createTask({
            title: "Yeni Görev",
            description: "Açıklama",
            status: "todo",
            priority: "medium",
          })
        }
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-6 rounded-lg">
            {error}
          </div>
        )}

        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filters={filters}
        />

        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "Arama sonucu yok" : "Henüz görev yok"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Farklı bir anahtar kelime deneyin."
                  : 'İlk görevinizi oluşturmak için "Yeni Görev" butonuna tıklayın.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
