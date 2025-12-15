"use client"

import * as React from "react"

interface RadioProps {
  checked: boolean;
  onChange?: () => void;
  className?: string;
}

const Radio = ({ checked, className = "" }: RadioProps) => {
  return (
    <div
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        borderColor: checked ? '#006EFF' : '#7A7A7A',
        backgroundColor: 'white'
      }}
    >
      {checked && (
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: '#006EFF' }}
        />
      )}
    </div>
  );
};

export { Radio }; 