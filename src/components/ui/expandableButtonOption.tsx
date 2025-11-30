import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import ActionButtons from "./action-buttons";
import { Radio } from "./radio";

interface OptionItem {
  id: string;
  name: string;
  subText?: string;
  address?: string;
  price?: number;
  logo?: StaticImageData | string;
}

interface ExpandableButtonOptionProps {
  label: string;
  subText?: string;
  price?: number | string;
  logo?: StaticImageData | string;
  active?: boolean;
  collapsed?: boolean;
  options?: OptionItem[];
  selectedOption?: string;
  variant?: "store-list" | "input";
  onMainClick?: () => void;
  onOptionSelect?: (optionId: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onConfirm?: () => void;
  // Input variant props
  inputValue?: string;
  inputPlaceholder?: string;
  onInputChange?: (value: string) => void;
  onInputSubmit?: (value: string) => void;
}

const ExpandableButtonOption = ({
  label,
  subText,
  price,
  logo,
  active = false,
  collapsed = false,
  options = [],
  selectedOption,
  variant = "store-list",
  onMainClick,
  onOptionSelect,
  onEdit,
  onDelete,
  onConfirm,
  inputValue = "",
  inputPlaceholder = "",
  onInputChange,
  onInputSubmit,
}: ExpandableButtonOptionProps) => {
  const [localInputValue, setLocalInputValue] = useState(inputValue);
  const [isEditing, setIsEditing] = useState(!inputValue);
  const baseCardClasses = "rounded-2xl border border-slate-200 bg-white/90 shadow-sm transition-all duration-200";
  const activeCardClasses = `${baseCardClasses} ring-1 ring-blue-100 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-md`;
  const mutedTextClass = "text-sm text-slate-600";
  const formattedPrice = price !== undefined
    ? (typeof price === "number" ? `${price} kr` : price)
    : undefined;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalInputValue(e.target.value);
    onInputChange?.(e.target.value);
  };

  const handleInputSubmit = () => {
    onInputSubmit?.(localInputValue);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.();
  };

  // Input variant rendering
  if (variant === "input") {
    if (active && collapsed && !isEditing) {
      // Collapsed state with submitted input
      return (
        <div className={`${activeCardClasses} p-6 w-full`}>
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">{label}</h3>
              {subText && <p className={`${mutedTextClass} max-w-xl`}>{subText}</p>}
            </div>
            {formattedPrice && (
              <span className="text-base font-semibold text-slate-900 whitespace-nowrap">{formattedPrice}</span>
            )}
          </div>
          <div className="mt-4 rounded-xl border border-blue-100 bg-white/70 px-3 py-3 shadow-inner">
            <p className="text-sm font-medium text-slate-900 break-words">{localInputValue}</p>
          </div>
          <ActionButtons onEdit={handleEdit} onDelete={onDelete} className="mt-4" />
        </div>
      );
    }

    if (active) {
      // Expanded state with input form
      return (
        <div className={`${activeCardClasses} p-6 w-full`}>
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">{label}</h3>
              {subText && <p className={`${mutedTextClass} max-w-xl`}>{subText}</p>}
            </div>
            {formattedPrice && (
              <span className="text-base font-semibold text-slate-900 whitespace-nowrap">{formattedPrice}</span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <textarea
              value={localInputValue}
              onChange={handleInputChange}
              placeholder={inputPlaceholder}
              className="w-full min-h-[120px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition"
            />
            <button
              onClick={handleInputSubmit}
              disabled={!localInputValue.trim()}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md disabled:translate-y-0 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
            >
              Send inn
            </button>
          </div>
        </div>
      );
    }

    // Default state
    return (
      <button
        type="button"
        onClick={onMainClick}
        className={`group flex flex-row items-center justify-between w-full text-left ${baseCardClasses} px-6 py-5 hover:-translate-y-0.5 hover:shadow-md bg-white`}
      >
        <div className="flex items-center gap-3 flex-1">
          {logo && (
            <div className="h-16 w-20 flex justify-center items-center rounded-xl bg-slate-50 border border-slate-200">
              <Image src={logo} alt="icon" width={80} height={64} />
            </div>
          )}
          <div className="flex flex-col flex-1">
            {label && <span className="text-base font-semibold text-slate-900 group-hover:text-slate-800">{label}</span>}
          </div>
        </div>
        {price !== undefined && (
          <span className="text-base font-semibold whitespace-nowrap ml-4 text-slate-900">
            {formattedPrice}
          </span>
        )}
      </button>
    );
  }

  // Store list variant
  if (active && collapsed && selectedOption) {
    const selected = options.find(opt => opt.id === selectedOption);
    if (selected) {
      return (
        <div className={`${activeCardClasses} p-6 w-full`}>
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex items-center gap-3">
              {logo && (
                <div className="h-10 w-16 flex justify-center items-center rounded-lg bg-white border border-slate-200">
                  <Image src={logo} alt="icon" width={80} height={64} />
                </div>
              )}
              {label && <h3 className="text-base font-semibold text-slate-900">{label}</h3>}
            </div>
            {formattedPrice && <span className="text-base font-semibold text-slate-900">{formattedPrice}</span>}
          </div>
          <div className="flex items-center gap-3 mb-6 rounded-xl border border-blue-100 bg-white/70 px-3 py-3 shadow-inner">
            <div className="flex-1">
              <span className="text-xs uppercase tracking-[0.08em] text-slate-500">{selected.name}</span>
              <span className="text-sm font-medium block text-slate-900">{selected.subText || selected.address}</span>
              {selected.price !== undefined && selected.price > 0 && (
                <span className={`${mutedTextClass}`}>{selected.price} kr</span>
              )}
            </div>
          </div>
          <ActionButtons onEdit={onEdit} onDelete={onDelete} />
        </div>
      );
    }
  }

  if (active && !collapsed) {
    return (
      <div className={`${activeCardClasses} p-6 w-full`}>
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex items-center gap-3">
            {logo && (
              <div className="h-10 w-16 flex justify-center items-center rounded-lg bg-white border border-slate-200">
                <Image src={logo} alt="icon" width={80} height={64} />
              </div>
            )}
            {label && <h3 className="text-base font-semibold text-slate-900">{label}</h3>}
          </div>
          {formattedPrice && <span className="text-base font-semibold text-slate-900">{formattedPrice}</span>}
        </div>

        <div className="space-y-2 mb-4">
          {options.map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => onOptionSelect?.(option.id)}
              className={`w-full text-left rounded-xl border px-3 py-3 transition-all ${
                selectedOption === option.id
                  ? "border-blue-200 bg-white/80 shadow-sm ring-1 ring-blue-100"
                  : "border-slate-200 bg-white/60 hover:-translate-y-[1px] hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <Radio
                  checked={selectedOption === option.id}
                  onChange={() => onOptionSelect?.(option.id)}
                />
                <div className="flex-1">
                  <span className="text-xs uppercase tracking-[0.08em] text-slate-500">{option.name}</span>
                  <span className="text-sm font-medium block text-slate-900">{option.subText || option.address}</span>
                  {option.price !== undefined && option.price > 0 && (
                    <span className={`${mutedTextClass}`}>{option.price} kr</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onConfirm}
          disabled={!selectedOption}
          className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md disabled:translate-y-0 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
        >
          Velg
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onMainClick}
      className={`group flex flex-row items-center justify-between w-full text-left ${baseCardClasses} px-6 py-5 hover:-translate-y-0.5 hover:shadow-md bg-white`}
    >
      <div className="flex items-center gap-3 flex-1">
        {logo && (
          <div className="h-10 w-16 flex justify-center items-center rounded-lg bg-slate-50 border border-slate-200">
            <Image src={logo} alt="icon" width={80} height={64} />
          </div>
        )}
        <div className="flex flex-col flex-1">
          {label && <span className="text-base font-semibold text-slate-900 group-hover:text-slate-800">{label}</span>}
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

export default ExpandableButtonOption; 
