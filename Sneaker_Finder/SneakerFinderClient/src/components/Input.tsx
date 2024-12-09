interface InputProps {
  label: string;
  id: string;
  name: string;
  type?: "text" | "email" | "password" | "textarea" | "tel";
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
}

export default function Input({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  rows,
  disabled,
  required,
}: InputProps) {
  const inputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows || 5}
          className={`${inputClasses} resize-none`}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        />
      )}
    </div>
  );
}
