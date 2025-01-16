import React, { useState, useRef } from "react";
import { RequestStatus } from "@/lib/types/request";

interface DropdownProps {
  currentStatus: RequestStatus;
  onChange: (status: RequestStatus) => void;
  isOpen: boolean;
  onToggle: () => void;
  onBlur: () => void;
}

const Dropdown = ({ currentStatus, onChange, isOpen, onToggle, onBlur }: DropdownProps) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const tableHeight = 290;

  const handleOptionClick = (status: RequestStatus) => {
    setSelectedStatus(status);
    onChange(status);
    onToggle();
  };

  const getStatusStyles = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return "bg-[#FFDAC3] text-[#A43E00]";
      case RequestStatus.APPROVED:
        return "bg-[#FFEBC8] text-[#7B5F2E]";
      case RequestStatus.COMPLETED:
        return "bg-[#ECFDF3] text-[#037847]";
      case RequestStatus.REJECTED:
        return "bg-[#FFD2D2] text-[#8D0402]";
      default:
        return "";
    }
  };

  const getDotStyles = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return "bg-[#FD8033]";
      case RequestStatus.APPROVED:
        return "bg-[#FFBE4C]";
      case RequestStatus.COMPLETED:
        return "bg-[#14BA6D]";
      case RequestStatus.REJECTED:
        return "bg-[#D40400]";
      default:
        return "";
    }
  };

  const capitalizeStatus = (status: RequestStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const shouldOpenUpwards = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      return rect.bottom > tableHeight;
    }
    return false;
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.relatedTarget as Node)) {
      onBlur();
    }
  };

  return (
    <div
      className="relative inline-block text-left"
      ref={dropdownRef}
      onBlur={handleBlur}
      tabIndex={-1}
    >
      {/* Selected Option */}
      <button
        onClick={onToggle}
        className="font-medium py-1.5 px-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between w-[8.875rem]"
      >
        <span
          className={`flex items-center pr-2 pl-1.5 py-[0.125rem] rounded-2xl text-xs ${getStatusStyles(
            selectedStatus
          )}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-2 ${getDotStyles(
              selectedStatus
            )}`}
          ></span>
          {capitalizeStatus(selectedStatus)} {/* Capitalize first letter */}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transform ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#667085"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <ul
          className={`font-medium absolute mt-2 h-[7.625rem] w-[8.875rem] bg-white z-10 ${
            shouldOpenUpwards() ? "bottom-full rounded-tl rounded-tr mb-2" : "top-full rounded-bl rounded-br"
          }`}
          style={{
            boxShadow: "0px 0px 4px 0px rgba(63, 63, 63, 0.16), 0px 4px 8px 0px rgba(87, 87, 87, 0.16)",
          }}
        >
          {Object.values(RequestStatus).map((status) => (
            <li
              key={status}
              onClick={() => handleOptionClick(status)}
              className="flex items-center px-[0.688rem] py-[0.313rem] cursor-pointer"
            >
              <span
                className={`flex items-center pr-2 pl-1.5 py-[0.125rem] rounded-full text-xs ${getStatusStyles(
                  status
                )}`}
              >
                <span
                  className={`w-1 h-1 p-[0.2rem] rounded-2xl mr-2 ${getDotStyles(
                    status
                  )}`}
                ></span>
                {capitalizeStatus(status)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
