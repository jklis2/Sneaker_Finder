type Props = {
  name: string;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export default function Button({
  name,
  className = "",
  disabled = false,
  type = "submit",
  onClick,
}: Props) {
  return (
    <button
      className={`bg-gray-800 text-white font-medium py-2 px-4 w-full rounded-3xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-md transition duration-150 ease-in-out ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {name}
    </button>
  );
}
