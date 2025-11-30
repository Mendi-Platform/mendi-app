import { Pencil, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const ActionButtons = ({ onEdit, onDelete, className = "" }: ActionButtonsProps) => (
  <div className={`flex justify-center gap-3 ${className}`}>
    {onDelete && (
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:-translate-y-[1px] hover:shadow transition-all"
      >
        <Trash2 size={16} />
      </button>
    )}
    {onEdit && (
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onEdit(); }}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:-translate-y-[1px] hover:shadow transition-all"
      >
        <Pencil size={16} />
      </button>
    )}
  </div>
);

export default ActionButtons; 
