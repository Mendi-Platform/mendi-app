import { CirclePlus } from "lucide-react";
import React from "react";

interface AddButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ label, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 rounded-full bg-[#F6F6F6] px-4 py-3 text-sm font-medium text-black hover:bg-gray-100 w-full justify-center ${className}`}
  >
    <CirclePlus className="h-6 w-6 text-[#0066FF]" />
    {label}
  </button>
);

export default AddButton; 