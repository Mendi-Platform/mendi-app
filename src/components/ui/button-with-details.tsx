import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import { Pencil } from "lucide-react";

interface ButtonWithDetailsProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  subText?: string;
  price?: number | string;
  logo?: StaticImageData;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "input";
  onInputChange?: (value: string) => void;
  onInputSubmit?: (value: string) => void;
  inputValue?: string;
  inputPlaceholder?: string;
}

const ButtonWithDetails = ({
  label,
  active = false,
  onClick,
  subText,
  price,
  logo,
  disabled = false,
  children,
  className = "",
  variant = "default",
  onInputChange,
  onInputSubmit,
  inputValue = "",
  inputPlaceholder,
}: ButtonWithDetailsProps) => {
  const [localInputValue, setLocalInputValue] = useState(inputValue);
  const [isEditing, setIsEditing] = useState(!inputValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInputValue(e.target.value);
    onInputChange?.(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInputSubmit?.(localInputValue);
    setIsEditing(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  if (active && variant === "input") {
    return (
      <div className="bg-[#BFDAFF] rounded-[18px] p-8 w-full">
        <h3 className="text-base font-medium mb-2">{label}</h3>
        {subText && (
          <p className="text-sm text-[#797979] mb-4">{subText}</p>
        )}
        {isEditing ? (
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
              className="w-full bg-black text-white rounded-[7px] px-4 py-2.5 text-sm font-medium"
            >
              Send inn
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <span className="text-base font-semibold">{localInputValue}</span>
            <button
              onClick={handleEdit}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-100"
            >
              <Pencil size={16} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-row items-center justify-between rounded-[18px] px-8 py-5 w-full text-left transition-all
        ${active ? "bg-[#BFDAFF] text-black" : "bg-[#F3F3F3] text-black"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}`}
    >
      <div className="flex items-center gap-3 w-full">
        {logo && <IconWrapper icon={logo} />}
        <div className="flex flex-col w-full">
          <span className="text-base font-medium">{label}</span>
          {active && subText && variant !== "input" && (
            <span className="text-sm text-[#797979]">{subText}</span>
          )}
          {children}
        </div>
      </div>
      {price !== undefined && (
        <span className="text-base font-medium">{price} kr</span>
      )}
    </button>
  );
};

const IconWrapper = ({ icon }: { icon: StaticImageData }) => (
  <div className="bg-[#E2E2E2] border border-[#006EFF] h-12 w-12 flex justify-center items-center rounded-[11px]">
    <Image src={icon} alt="icon" />
  </div>
);

export default ButtonWithDetails; 