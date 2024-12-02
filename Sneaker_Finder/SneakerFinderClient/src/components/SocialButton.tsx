interface SocialProps {
  icon: string;
  name: string;
}

export default function SocialButton({ icon, name }: SocialProps) {
  return (
    <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
      <img src={icon} alt="social icon" className="mr-6" />
      {name}
    </button>
  );
}
