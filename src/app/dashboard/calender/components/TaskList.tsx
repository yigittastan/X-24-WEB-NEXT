import React from "react";
import { Task } from "../hooks/useCalendar";

interface TaskListProps {
  tasks: Task[];
  title: string;
  getTypeColor: (typeId: number) => string;
  openModalForEditTask: (task: Task) => void;
  toggleTaskCompletion: (id: number) => void;
}

export default function TaskList({
  tasks,
  title,
  getTypeColor,
  openModalForEditTask,
  toggleTaskCompletion,
}: TaskListProps) {
  if (!tasks.length) return null;

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="space-y-1 max-h-60 overflow-y-auto">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center gap-2 text-sm cursor-pointer ${
              task.completed ? "line-through opacity-60" : ""
            }`}
            onClick={() => openModalForEditTask(task)}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => {
                e.stopPropagation();
                toggleTaskCompletion(task.id);
              }}
              className="mr-1"
            />
            <span className={`${getTypeColor(task.typeId)} px-1 rounded`}>{task.title}</span>
            <small className="text-gray-500">{task.date} {task.time}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
