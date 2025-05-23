import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ActionButtons from "./action-buttons";
import { Radio } from "./radio";

interface ExpandableButtonOptionProps {
  label: string;
  subText?: string;
  price?: number | string;
  logo?: StaticImageData;
  active?: boolean;
  collapsed?: boolean;
  options?: Array<{
    id: string;
    name: string;
    address: string;
    price: number;
    logo: StaticImageData;
  }>;
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
        <div className="bg-[#BFDAFF] rounded-[18px] p-8 w-full">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-base font-bold mb-1">{label}</h3>
              <span className="text-base font-bold">{price} kr</span>
            </div>
          </div>
          <p className="text-sm text-[#797979] mb-4">{subText}</p>
          <div className="bg-white p-3 rounded-[7px] mb-3">
            <p className="text-sm">{localInputValue}</p>
          </div>
          <ActionButtons onEdit={handleEdit} onDelete={onDelete} />
        </div>
      );
    }

    if (active) {
      // Expanded state with input form
      return (
        <div className="bg-[#BFDAFF] rounded-[18px] p-8 w-full">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-bold">{label}</h3>
            <span className="text-base font-bold">{price} kr</span>
          </div>
          <div className="border-t border-gray-300 my-4"></div>
          {subText && (
            <p className="text-sm text-[#797979] mb-4">{subText}</p>
          )}
          <div className="flex flex-col gap-3">
            <textarea
              value={localInputValue}
              onChange={handleInputChange}
              placeholder={inputPlaceholder}
              className="w-full p-3 rounded-[7px] border border-gray-300 bg-white text-sm h-32 resize-none"
            />
            <button
              onClick={handleInputSubmit}
              disabled={!localInputValue.trim()}
              className="w-full bg-black text-white rounded-[7px] px-4 py-2.5 text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
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
        className="flex flex-row items-center justify-between rounded-[18px] px-8 py-5 w-full text-left bg-[#F3F3F3] text-black cursor-pointer"
      >
        <div className="flex items-center gap-3 flex-1">
          {logo && (
            <div className="h-16 w-20 flex justify-center items-center">
              <Image src={logo} alt="icon" width={80} height={64} />
            </div>
          )}
          <div className="flex flex-col flex-1">
            {label && <span className="text-base font-medium">{label}</span>}
          </div>
        </div>
        {price !== undefined && (
          <span className="text-base font-medium whitespace-nowrap ml-4">{price}</span>
        )}
      </button>
    );
  }

  // Store list variant
  if (active && collapsed && selectedOption) {
    const selected = options.find(opt => opt.id === selectedOption);
    if (selected) {
      return (
        <div className="bg-[#BFDAFF] rounded-[18px] p-8 w-full">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              {logo && (
                <div className="h-6 w-20 flex justify-center items-center">
                  <Image src={logo} alt="icon" width={80} height={64} />
                </div>
              )}
              {label && <h3 className="text-base font-bold">{label}</h3>}
            </div>
            <span className="text-base font-bold">{price}</span>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div>
              <span className="text-xs text-[#797979]">{selected.name}</span>
              <span className="text-sm font-medium block">{selected.address}</span>
            </div>
          </div>
          <ActionButtons onEdit={onEdit} onDelete={onDelete} />
        </div>
      );
    }
  }

  if (active && !collapsed) {
    return (
      <div className="bg-[#BFDAFF] rounded-[18px] p-8 w-full">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            {logo && (
              <div className="h-6 w-20 flex justify-center items-center">
                <Image src={logo} alt="icon" width={80} height={64} />
              </div>
            )}
            {label && <h3 className="text-base font-bold">{label}</h3>}
          </div>
          <span className="text-base font-bold">{price}</span>
        </div>
        
        <div className="border-t border-gray-300 my-4"></div>
        
        <div className="space-y-1 mb-4">
          {options.map((option) => (
            <div key={option.id} className="flex items-center gap-3 p-1">
              <Radio
                checked={selectedOption === option.id}
                onChange={() => onOptionSelect?.(option.id)}
              />
              <div className="flex-1">
                <span className="text-xs text-[#797979]">{option.name}</span>
                <span className="text-sm font-medium block">{option.address}</span>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={onConfirm}
          disabled={!selectedOption}
          className="w-full bg-black text-white rounded-md px-4 py-2 text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed h-8"
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
      className="flex flex-row items-center justify-between rounded-[18px] px-8 py-5 w-full text-left bg-[#F3F3F3] text-black cursor-pointer"
    >
      <div className="flex items-center gap-3 flex-1">
        {logo && (
          <div className="h-6 w-20 flex justify-center items-center">
            <Image src={logo} alt="icon" width={80} height={64} />
          </div>
        )}
        <div className="flex flex-col flex-1">
          {label && <span className="text-base font-medium">{label}</span>}
        </div>
      </div>
      {price !== undefined && (
        <span className="text-base font-medium whitespace-nowrap ml-4">{price}</span>
      )}
    </button>
  );
};

export default ExpandableButtonOption; 