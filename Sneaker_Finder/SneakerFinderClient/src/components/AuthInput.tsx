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
      <label className="text-gray-700 text-sm font-medium mb-2 block">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}
