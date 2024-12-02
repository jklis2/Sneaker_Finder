type Props = {
  name: string;
  className?: string;
};

export default function Button({ name, className = "" }: Props) {
  return (
    <button
      className={`bg-gray-800 text-white font-medium py-2 px-4 w-full rounded-3xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-md transition duration-150 ease-in-out ${className}`}
      type="button"
    >
      {name}
    </button>
  );
}
