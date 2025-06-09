import React, { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
} from "react-icons/fi";

export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  DEFAULT = "default",
}

interface ToastProps {
  message: string;
  type: ToastType | string;
  onClose?: () => void;
  duration?: number; // Duration in ms before auto-dismiss
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 2000, // Default 5 seconds
  position = "top-right",
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  // Handle auto-dismiss with progress tracking
  useEffect(() => {
    if (duration <= 0) return; // Don't auto-dismiss if duration is 0 or negative

    const dismissInterval = 50; // Update progress every 50ms
    const steps = duration / dismissInterval;
    const decrementValue = 100 / steps;

    let currentProgress = 100;
    const interval = setInterval(() => {
      currentProgress -= decrementValue;
      setProgress(Math.max(0, currentProgress));

      if (currentProgress <= 0) {
        clearInterval(interval);
        handleClose();
      }
    }, dismissInterval);

    return () => clearInterval(interval);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const getToastConfig = () => {
    switch (type) {
      case ToastType.SUCCESS:
        return {
          icon: <FiCheckCircle size={24} />,
          bgColor: "bg-green-50",
          textColor: "text-green-800",
          borderColor: "border-green-500",
          iconColor: "text-green-500",
          progressColor: "bg-green-500",
        };
      case ToastType.ERROR:
        return {
          icon: <FiXCircle size={24} />,
          bgColor: "bg-red-50",
          textColor: "text-red-800",
          borderColor: "border-red-500",
          iconColor: "text-red-500",
          progressColor: "bg-red-500",
        };
      case ToastType.WARNING:
        return {
          icon: <FiAlertTriangle size={24} />,
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-500",
          iconColor: "text-yellow-500",
          progressColor: "bg-yellow-500",
        };
      case ToastType.INFO:
        return {
          icon: <FiInfo size={24} />,
          bgColor: "bg-blue-50",
          textColor: "text-blue-800",
          borderColor: "border-blue-500",
          iconColor: "text-blue-500",
          progressColor: "bg-blue-500",
        };
      default:
        return {
          icon: <FiInfo size={24} />,
          bgColor: "bg-gray-50",
          textColor: "text-gray-800",
          borderColor: "border-gray-500",
          iconColor: "text-gray-500",
          progressColor: "bg-gray-500",
        };
    }
  };

  const config = getToastConfig();

  // Position classes
  const positionClasses = {
    "top-right": "top-5 right-5",
    "top-left": "top-5 left-5",
    "bottom-right": "bottom-5 right-5",
    "bottom-left": "bottom-5 left-5",
    "top-center": "top-5 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-5 left-1/2 transform -translate-x-1/2",
  };

  if (!isVisible) return null;

  return (
    <div
      className={`${positionClasses[position]} w-80 rounded-lg ${config.bgColor} overflow-hidden  transition-all duration-300 ease-in-out`}
      style={{
        animation: isVisible
          ? "fadeIn 0.3s ease-out forwards, slideIn 0.3s ease-out forwards"
          : "fadeOut 0.3s ease-in forwards, slideOut 0.3s ease-in forwards",
        opacity: 0,
        transform: position.includes("right")
          ? "translateX(20px)"
          : position.includes("left")
          ? "translateX(-20px)"
          : "translateY(-20px)",
      }}
      role="alert"
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between min-h-[5%]">
          <div className="flex items-center space-x-3 text-sm">
            <div className={`${config.iconColor} flex-shrink-0`}>
              {config.icon}
            </div>
            <div>
              <p className={`font-medium ${config.textColor}`}>{message}</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleClose();
            }}
            className="ml-4 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      {duration > 0 && (
        <div
          className={`h-1 ${config.progressColor} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideIn {
          from {
            transform: ${position.includes("right")
              ? "translateX(20px)"
              : position.includes("left")
              ? "translateX(-20px)"
              : "translateY(-20px)"};
          }
          to {
            transform: translateX(0) translateY(0);
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0) translateY(0);
          }
          to {
            transform: ${position.includes("right")
              ? "translateX(20px)"
              : position.includes("left")
              ? "translateX(-20px)"
              : "translateY(-20px)"};
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
