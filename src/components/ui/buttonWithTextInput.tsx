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
      <div className="bg-[#BFDAFF] rounded-[18px] p-6 w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-base font-bold">{label}</h3>
          <span className="text-base font-bold">{price} kr</span>
        </div>
        
        <div className="border-t border-gray-300 my-4"></div>
        
        <p className="text-sm text-[#797979] mb-3">{inputLabel}</p>
        <p className="text-sm text-black mb-4">{localInputValue}</p>
        
        <ActionButtons onEdit={handleEdit} onDelete={onDelete} />
      </div>
    );
  }

  // Active state with input form
  if (active) {
    return (
      <div className="bg-[#BFDAFF] rounded-[18px] p-6 w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-base font-medium">{label}</h3>
          <span className="text-base font-medium">{price} kr</span>
        </div>
        
        {subText && (
          <p className="text-sm text-black mb-6 leading-relaxed">{subText}</p>
        )}
        
        {inputLabel && (
          <p className="text-sm font-medium text-black mb-3">{inputLabel}</p>
        )}
        
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={localInputValue}
            onChange={handleInputChange}
            placeholder={inputPlaceholder}
            className="w-full p-3 rounded-[7px] border border-gray-300 bg-white text-sm"
          />
          <button
            onClick={handleSubmit}
            disabled={!localInputValue.trim()}
            className="w-full bg-black text-white rounded-md px-4 py-2 text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed h-8"
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
      className="flex flex-row items-center justify-between rounded-[18px] px-8 py-5 w-full text-left bg-[#F3F3F3] text-black cursor-pointer"
    >
      <div className="flex items-center gap-3 flex-1">
        {logo && (
          <div className="bg-[#E2E2E2] border border-[#006EFF] h-12 w-12 flex justify-center items-center rounded-[11px]">
            <Image src={logo} alt="icon" />
          </div>
        )}
        <div className="flex flex-col flex-1">
          <span className="text-base font-medium">{label}</span>
        </div>
      </div>
      {price !== undefined && (
        <span className="text-base font-medium whitespace-nowrap ml-4">{price} kr</span>
      )}
    </button>
  );
};

export default ButtonWithTextInput; 