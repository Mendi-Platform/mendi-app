import { Pencil, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const ActionButtons = ({ onEdit, onDelete, className = "" }: ActionButtonsProps) => (
  <div className={`flex justify-center gap-4 ${className}`}>
    {onDelete && (
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F6F6F6] hover:bg-[#E2E2E2] transition-colors"
      >
        <Trash2 size={16} />
      </button>
    )}
    {onEdit && (
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onEdit(); }}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F6F6F6] hover:bg-[#E2E2E2] transition-colors"
      >
        <Pencil size={16} />
      </button>
    )}
  </div>
);

export default ActionButtons; 