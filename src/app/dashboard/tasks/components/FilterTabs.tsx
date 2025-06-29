// components/FilterTabs.tsx

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (key: string) => void;
  filters: { key: string; name: string }[];
}

export default function FilterTabs({
  activeFilter,
  onFilterChange,
  filters,
}: FilterTabsProps) {
  return (
    <div className="flex gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-6 py-2 rounded-xl font-medium transition ${
            activeFilter === filter.key
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {filter.name}
        </button>
      ))}
    </div>
  );
}
