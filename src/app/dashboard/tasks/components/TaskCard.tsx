// components/TaskCard.tsx
import { Task } from "../hooks/useTasks";
import { User, Clock, MoreVertical } from "lucide-react";

interface Props {
  task: Task;
}

const getStatusColor = (status: Task["status"]): string => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800 border-green-200";
    case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
    case "todo": return "bg-orange-100 text-orange-800 border-orange-200";
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority: Task["priority"]): string => {
  switch (priority) {
    case "high": return "bg-red-500";
    case "medium": return "bg-yellow-500";
    case "low": return "bg-green-500";
    default: return "bg-gray-500";
  }
};

const getStatusText = (status: Task["status"]): string => {
  const statusMap = {
    completed: "Tamamlandı",
    "in-progress": "Devam Eden",
    todo: "Yapılacak",
    pending: "Beklemede",
  };
  return statusMap[status];
};

export default function TaskCard({ task }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-1 h-12 rounded-full ${getPriorityColor(task.priority)}`} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Görev Adı: {task.title}</h3>
                <p className="text-gray-600 text-sm">Açıklama: {task.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{task.author}</span>
                </div>
                {task.dueDate && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(task.dueDate).toLocaleDateString("tr-TR")}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
