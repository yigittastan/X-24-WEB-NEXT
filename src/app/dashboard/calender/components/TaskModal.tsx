import React, { useState, useEffect } from "react";
import { Task, TaskForm, TaskType } from "../hooks/useCalendar";

interface TaskModalProps {
  show: boolean;
  onClose: () => void;
  taskTypes: TaskType[];
  form: TaskForm;
  setForm: React.Dispatch<React.SetStateAction<TaskForm>>;
  onSubmit: () => void;
  editingTask: Task | null;
  deleteTask: (id: number) => void;
}

export default function TaskModal({
  show,
  onClose,
  taskTypes,
  form,
  setForm,
  onSubmit,
  editingTask,
  deleteTask,
}: TaskModalProps) {
  const [formErrors, setFormErrors] = useState<{ title?: string; date?: string; time?: string }>({});

  useEffect(() => {
    setFormErrors({});
  }, [show]);

  if (!show) return null;

  const validate = (): boolean => {
    const errors: typeof formErrors = {};
    if (!form.title.trim()) errors.title = "Başlık gerekli";
    if (!form.date) errors.date = "Tarih gerekli";
    if (!form.time) errors.time = "Saat gerekli";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded p-4 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{editingTask ? "Görev Düzenle" : "Yeni Görev"}</h2>

        <div className="mb-2">
          <label className="block font-semibold mb-1">Başlık</label>
          <input
            type="text"
            className={`w-full border px-2 py-1 rounded ${formErrors.title ? "border-red-500" : "border-gray-300"}`}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
        </div>

        <div className="mb-2">
          <label className="block font-semibold mb-1">Açıklama</label>
          <textarea
            className="w-full border border-gray-300 px-2 py-1 rounded"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        <div className="mb-2 flex gap-2">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Tarih</label>
            <input
              type="date"
              className={`w-full border px-2 py-1 rounded ${formErrors.date ? "border-red-500" : "border-gray-300"}`}
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
          </div>

          <div className="flex-1">
            <label className="block font-semibold mb-1">Saat</label>
            <input
              type="time"
              className={`w-full border px-2 py-1 rounded ${formErrors.time ? "border-red-500" : "border-gray-300"}`}
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            />
            {formErrors.time && <p className="text-red-500 text-xs mt-1">{formErrors.time}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Görev Türü</label>
          <select
            className="w-full border border-gray-300 px-2 py-1 rounded"
            value={form.typeId}
            onChange={(e) => setForm((f) => ({ ...f, typeId: Number(e.target.value) }))}
          >
            {taskTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          {editingTask && (
            <button
              onClick={() => {
                if (editingTask) deleteTask(editingTask.id);
                onClose();
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sil
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-200"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
