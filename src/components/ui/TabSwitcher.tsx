import React from "react";

interface TabSwitcherProps {
  tabs: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ tabs, value, onChange, className = "" }) => (
  <div className={`flex border-b border-gray-200 ${className}`}>
    {tabs.map((tab) => (
      <button
        key={tab.value}
        className={`flex-1 text-center py-2 font-medium transition-colors
          ${value === tab.value ? "text-black" : "text-[#797979]"}
          relative`}
        onClick={() => onChange(tab.value)}
        type="button"
      >
        {tab.label}
        <span
          className={`absolute left-0 right-0 -bottom-[1px] h-0.5 transition-all ${
            value === tab.value ? "bg-[#006EFF]" : "bg-transparent"
          }`}
        />
      </button>
    ))}
  </div>
);

export default TabSwitcher; 