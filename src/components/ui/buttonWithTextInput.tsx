import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import ActionButtons from "./action-buttons";

interface ButtonWithTextInputProps {
  label: string;
  subText?: string;
  price?: number | string;
  logo?: StaticImageData;
  active?: boolean;
  submitted?: boolean;
  inputValue?: string;
  inputPlaceholder?: string;
  inputLabel?: string;
  onMainClick?: () => void;
  onInputChange?: (value: string) => void;
  onInputSubmit?: (value: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ButtonWithTextInput = ({
  label,
  subText,
  price,
  logo,
  active = false,
  submitted = false,
  inputValue = "",
  inputPlaceholder = "",
  inputLabel = "",
  onMainClick,
  onInputChange,
  onInputSubmit,
  onEdit,
  onDelete,
}: ButtonWithTextInputProps) => {
  const [localInputValue, setLocalInputValue] = useState(inputValue);
  const [isEditing, setIsEditing] = useState(!submitted);
  const baseCardClasses = "rounded-2xl border border-slate-200 bg-white/90 shadow-sm transition-all duration-200";
  const activeCardClasses = `${baseCardClasses} ring-1 ring-blue-100 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-md`;
  const mutedTextClass = "text-sm text-slate-600";
  const formattedPrice = price !== undefined
    ? (typeof price === "number" ? `${price} kr` : price)
    : undefined;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInputValue(e.target.value);
    onInputChange?.(e.target.value);
  };

  const handleSubmit = () => {
    onInputSubmit?.(localInputValue);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.();
  };

  // Submitted state (collapsed with content)
  if (active && submitted && !isEditing) {
    return (
      <div className={`${activeCardClasses} p-6 w-full`}>
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex items-start gap-3">
            {logo && (
              <div className="h-11 w-11 flex justify-center items-center rounded-xl bg-white border border-slate-200">
                <Image src={logo} alt="icon" />
              </div>
            )}
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">{label}</h3>
              {subText && <p className={`${mutedTextClass}`}>{subText}</p>}
            </div>
          </div>
          {formattedPrice && <span className="text-base font-semibold text-slate-900 whitespace-nowrap">{formattedPrice}</span>}
        </div>

        <div className="mt-3 rounded-xl border border-blue-100 bg-white/70 px-3 py-3 shadow-inner">
          {inputLabel && (
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500 mb-1">{inputLabel}</p>
          )}
          <p className="text-sm font-medium text-slate-900 break-words">{localInputValue}</p>
        </div>

        <ActionButtons onEdit={handleEdit} onDelete={onDelete} className="mt-4" />
      </div>
    );
  }

  // Active state with input form
  if (active) {
    return (
      <div className={`${activeCardClasses} p-6 w-full`}>
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex items-start gap-3">
            {logo && (
              <div className="h-11 w-11 flex justify-center items-center rounded-xl bg-white border border-slate-200">
                <Image src={logo} alt="icon" />
              </div>
            )}
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">{label}</h3>
              {subText && <p className={`${mutedTextClass}`}>{subText}</p>}
            </div>
          </div>
          {formattedPrice && <span className="text-base font-semibold text-slate-900 whitespace-nowrap">{formattedPrice}</span>}
        </div>

        {inputLabel && (
          <p className="text-xs uppercase tracking-[0.08em] text-slate-500 mb-2">{inputLabel}</p>
        )}

        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={localInputValue}
            onChange={handleInputChange}
            placeholder={inputPlaceholder}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition"
          />
          <button
            onClick={handleSubmit}
            disabled={!localInputValue.trim()}
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md disabled:translate-y-0 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
          >
            Send inn
          </button>
        </div>
      </div>
    );
  }

  // Default inactive state
  return (
    <button
      type="button"
      onClick={onMainClick}
      className={`group flex flex-row items-center justify-between w-full text-left ${baseCardClasses} px-6 py-5 hover:-translate-y-0.5 hover:shadow-md bg-white`}
    >
      <div className="flex items-center gap-3 flex-1">
        {logo && (
          <div className="h-11 w-11 flex justify-center items-center rounded-xl bg-slate-50 border border-slate-200">
            <Image src={logo} alt="icon" />
          </div>
        )}
        <div className="flex flex-col flex-1">
          <span className="text-base font-semibold text-slate-900 group-hover:text-slate-800">{label}</span>
        </div>
      </div>
      {price !== undefined && (
        <span className="text-base font-semibold whitespace-nowrap ml-4 text-slate-900">
          {formattedPrice}
        </span>
      )}
    </button>
  );
};

export default ButtonWithTextInput; 
