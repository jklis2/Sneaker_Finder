interface MultiSelectFieldProps {
  label: string;
  name: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export default function MultiSelectField({
  label,
  name,
  options,
  value,
  onChange,
}: MultiSelectFieldProps) {
  const handleChange = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <div className="mb-6">
      <label className="block text-lg font-semibold text-gray-800 mb-3">
        {label}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => (
          <div
            key={option}
            className={`relative flex items-center p-3 rounded-lg border transition-all duration-200 ${
              value.includes(option)
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-blue-500'
            }`}
          >
            <input
              type="checkbox"
              id={`${name}-${option}`}
              name={name}
              value={option}
              checked={value.includes(option)}
              onChange={() => handleChange(option)}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            />
            <label
              htmlFor={`${name}-${option}`}
              className={`ml-3 block text-sm font-medium cursor-pointer select-none transition-colors duration-200 ${
                value.includes(option) ? 'text-blue-700' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
