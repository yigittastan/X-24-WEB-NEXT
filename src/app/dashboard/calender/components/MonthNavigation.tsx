import React from "react";

interface MonthNavigationProps {
  currentDate: Date;
  months: string[];
  navigateMonth: (direction: number) => void;
  openModalForNewTask: (date?: string) => void;
}

export default function MonthNavigation({
  currentDate,
  months,
  navigateMonth,
  openModalForNewTask,
}: MonthNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        className="px-3 py-1 rounded hover:bg-gray-200"
        onClick={() => navigateMonth(-1)}
      >
        {"<"}
      </button>
      <div className="font-semibold text-lg">
        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
      </div>
      <button
        className="px-3 py-1 rounded hover:bg-gray-200"
        onClick={() => navigateMonth(1)}
      >
        {">"}
      </button>
      <button
        className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => openModalForNewTask()}
      >
        + Yeni Görev
      </button>
    </div>
  );
}
