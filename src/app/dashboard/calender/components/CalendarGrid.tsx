import React from "react";
import { Task } from "../hooks/useCalendar";

interface CalendarGridProps {
  currentDate: Date;
  daysOfWeek: string[];
  getDaysInMonth: (date: Date) => (number | null)[];
  getTasksForDate: (day: number) => Task[];
  openModalForNewTask: (date?: string) => void;
  openModalForEditTask: (task: Task) => void;
  getTypeColor: (typeId: number) => string;
  toggleTaskCompletion: (id: number) => void;
}

export default function CalendarGrid({
  currentDate,
  daysOfWeek,
  getDaysInMonth,
  getTasksForDate,
  openModalForNewTask,
  openModalForEditTask,
  getTypeColor,
  toggleTaskCompletion,
}: CalendarGridProps) {
  const days = getDaysInMonth(currentDate);

  return (
    <div>
      <div className="grid grid-cols-7 text-center font-semibold border-b border-gray-300 mb-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) =>
          day === null ? (
            <div key={i} className="p-2 border min-h-[80px]"></div>
          ) : (
            <div
              key={i}
              className="p-2 border min-h-[80px] cursor-pointer hover:bg-gray-100"
              onClick={() => openModalForNewTask(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`)}
            >
              <div className="font-semibold mb-1">{day}</div>
              <div className="space-y-1 max-h-[60px] overflow-y-auto">
                {getTasksForDate(day).map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs px-1 rounded cursor-pointer truncate ${getTypeColor(task.typeId)} ${
                      task.completed ? "line-through opacity-60" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openModalForEditTask(task);
                    }}
                    title={task.title}
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
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
