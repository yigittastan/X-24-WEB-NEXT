"use client";
import { useState, useEffect, useCallback } from "react";
import { X, Search, ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Searchable Multi-Select Component
const SearchableMultiSelect = ({
  options,
  selectedValues,
  onChange,
  placeholder,
  isMultiple = false,
}: {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  isMultiple?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value: string) => {
    if (isMultiple) {
      if (selectedValues.includes(value)) {
        onChange(selectedValues.filter((v) => v !== value));
      } else {
        onChange([...selectedValues, value]);
      }
    } else {
      onChange([value]);
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (isMultiple) {
      if (selectedValues.length === 1) {
        return (
          options.find((opt) => opt.value === selectedValues[0])?.label || ""
        );
      }
      return `${selectedValues.length} öğe seçildi`;
    }
    return options.find((opt) => opt.value === selectedValues[0])?.label || "";
  };

  const removeItem = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== value));
  };

  // Dışarı tıklandığında dropdown'ı kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".searchable-multiselect")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative searchable-multiselect">
      <div
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer bg-white flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {isMultiple && selectedValues.length > 0 ? (
            selectedValues.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <span
                  key={value}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                >
                  {option?.label}
                  <X
                    size={12}
                    className="cursor-pointer hover:text-blue-600"
                    onClick={(e) => removeItem(value, e)}
                  />
                </span>
              );
            })
          ) : (
            <span
              className={
                selectedValues.length === 0 ? "text-gray-500" : "text-gray-900"
              }
            >
              {getDisplayText()}
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-gray-500 text-center">
                Sonuç bulunamadı
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center gap-2 ${
                    selectedValues.includes(option.value)
                      ? "bg-blue-50 text-blue-700"
                      : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  {isMultiple && (
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option.value)}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600"
                    />
                  )}
                  <span>{option.label}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CreateTaskModal({
  isOpen,
  onClose,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
    assignees: [] as string[],
    supervisors: [] as string[],
    projects: [] as string[],
    files: [] as File[],
  });

  const [users, setUsers] = useState<Option[]>([]);
  const [projects, setProjects] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

  // useCallback kullanarak fetchData fonksiyonunu optimize et
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Kullanıcıları çek
      const usersResponse = await fetch(`${API_BASE_URL}/users`);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      } else {
        // Fallback mock data
        setUsers([
          { value: "1", label: "Ali Yılmaz" },
          { value: "2", label: "Ayşe Kaya" },
          { value: "3", label: "Mehmet Demir" },
          { value: "4", label: "Fatma Öz" },
        ]);
      }

      // Projeleri çek
      const projectsResponse = await fetch(`${API_BASE_URL}/projects`);
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      } else {
        // Fallback mock data
        setProjects([
          { value: "1", label: "Web Geliştirme" },
          { value: "2", label: "Mobil Uygulama" },
          { value: "3", label: "API Entegrasyonu" },
        ]);
      }
    } catch (error) {
      console.error("Veriler çekilirken hata oluştu:", error);
      // Fallback to mock data
      setUsers([
        { value: "1", label: "Ali Yılmaz" },
        { value: "2", label: "Ayşe Kaya" },
        { value: "3", label: "Mehmet Demir" },
        { value: "4", label: "Fatma Öz" },
      ]);
      setProjects([
        { value: "1", label: "Web Geliştirme" },
        { value: "2", label: "Mobil Uygulama" },
        { value: "3", label: "API Entegrasyonu" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  const clearForm = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      dueDate: "",
      assignees: [],
      supervisors: [],
      projects: [],
      files: [],
    });
  };

  const handleCancel = useCallback(() => {
    clearForm();
    onClose();
  }, [onClose]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert("Lütfen görev başlığını giriniz.");
      return false;
    }
    if (!formData.description.trim()) {
      alert("Lütfen görev açıklamasını giriniz.");
      return false;
    }
    if (formData.assignees.length === 0) {
      alert("Lütfen en az bir atanan kişi seçiniz.");
      return false;
    }
    if (
      formData.startDate &&
      formData.dueDate &&
      formData.startDate > formData.dueDate
    ) {
      alert("Başlangıç tarihi, bitiş tarihinden önce olmalıdır.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("dueDate", formData.dueDate);
      formDataToSend.append("assignees", JSON.stringify(formData.assignees));
      formDataToSend.append(
        "supervisors",
        JSON.stringify(formData.supervisors)
      );
      formDataToSend.append("projects", JSON.stringify(formData.projects));

      formData.files.forEach((file, index) => {
        formDataToSend.append(`files[${index}]`, file);
      });

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        console.log("Görev başarıyla oluşturuldu");
        clearForm();
        onClose();
        // Başarı mesajı göster
        alert("Görev başarıyla oluşturuldu!");
      } else {
        const errorData = await response.json();
        console.error("Görev oluşturulurken hata oluştu:", errorData);
        alert("Görev oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("API isteği sırasında hata oluştu:", error);
      alert(
        "Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Dosya boyutu kontrolü (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        alert(
          `${file.name} dosyası çok büyük. Maksimum dosya boyutu 10MB'dır.`
        );
        return false;
      }
      return true;
    });

    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...validFiles],
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-black">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={handleCancel}
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 9999,
        }}
      />
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 p-0 overflow-hidden"
        style={{ zIndex: 10000 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Görev Oluştur</h2>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              disabled={submitLoading}
            >
              İptal
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitLoading || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLoading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Veriler yükleniyor...</p>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Görev Başlığı */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded">
              Görev Başlığı *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Görev başlığını giriniz"
              maxLength={200}
            />
          </div>

          {/* Görev Açıklaması */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded">
              Görev Açıklaması *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Görev açıklamasını giriniz"
              maxLength={1000}
            />
          </div>

          {/* Tarihler */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded">
              Tarihler
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Atanan Kişiler */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded">
              Atanan Kişiler *
            </label>
            <SearchableMultiSelect
              options={users}
              selectedValues={formData.assignees}
              onChange={(values) =>
                setFormData((prev) => ({ ...prev, assignees: values }))
              }
              placeholder="Atanacak kişileri seçiniz"
              isMultiple={true}
            />
          </div>

          {/* Gözetmenler ve Projeler */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded">
              Gözetmen ve Proje
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Gözetmenler
                </label>
                <SearchableMultiSelect
                  options={users}
                  selectedValues={formData.supervisors}
                  onChange={(values) =>
                    setFormData((prev) => ({ ...prev, supervisors: values }))
                  }
                  placeholder="Gözetmenleri seçiniz"
                  isMultiple={true}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Projeler
                </label>
                <SearchableMultiSelect
                  options={projects}
                  selectedValues={formData.projects}
                  onChange={(values) =>
                    setFormData((prev) => ({ ...prev, projects: values }))
                  }
                  placeholder="Projeleri seçiniz"
                  isMultiple={true}
                />
              </div>
            </div>
          </div>

          {/* Dosya Yükleme */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded">
              Dosya Ekle
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="*/*"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-gray-600 hover:text-gray-800"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-lg">+</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Dosya yüklemek için tıklayın
                  </p>
                  <p className="text-xs text-gray-400">
                    Maksimum dosya boyutu: 10MB
                  </p>
                </div>
              </label>
            </div>

            {/* Yüklenen Dosyalar */}
            {formData.files.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Yüklenen Dosyalar ({formData.files.length}):
                </h4>
                <div className="space-y-2">
                  {formData.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm">📄</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                        title="Dosyayı kaldır"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
