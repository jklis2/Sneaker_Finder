import { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder: string;
}

export default function AuthInput({
  type,
  label,
  placeholder,
  name,
  value,
  onChange,
  required,
  ...props
}: AuthInputProps) {
  return (
    <div className="mb-4">
      <label className="text-gray-700 text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-sky-200"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}
