import { PlusCircle } from "lucide-react";

interface AddButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export function AddButton({ label, onClick, className = "" }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full bg-[#F6F6F6] px-4 py-3 text-sm font-medium text-black hover:bg-gray-100 ${className}`}
    >
      <PlusCircle className="h-6 w-6 text-[#0066FF]" />
      {label}
    </button>
  );
} 