"use client"

import * as React from "react"

interface RadioProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

const Radio = ({ checked, onChange, className = "" }: RadioProps) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${className}`}
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
    </button>
  );
};

export { Radio }; 