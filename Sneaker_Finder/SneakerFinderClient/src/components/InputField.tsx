interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function InputField({
  label,
  name,
  value,
  placeholder,
  onChange,
}: InputFieldProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block text-lg font-semibold text-gray-800 mb-3"
      >
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 shadow-sm hover:border-blue-400"
      />
    </div>
  );
}
