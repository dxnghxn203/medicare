"use client";
import React from "react";

interface ToggleProps {
  isActive: boolean;
  onChange: (value: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ isActive, onChange }) => {
  return (
    <button
      onClick={() => onChange(!isActive)}
      className={`w-14 h-8 flex items-center p-1 rounded-full transition-colors duration-300 ${
        isActive ? "bg-blue-600 justify-end" : "bg-gray-400 justify-start"
      }`}
      role="switch"
      aria-checked={isActive}
    >
      <div className="w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300" />
    </button>
  );
};
