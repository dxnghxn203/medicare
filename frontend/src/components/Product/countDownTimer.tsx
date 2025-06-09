"use client";
import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  expiredDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiredDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(expiredDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({
          days: 0,
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft({
          days,
          hours: hours.toString().padStart(2, "0"),
          minutes: minutes.toString().padStart(2, "0"),
          seconds: seconds.toString().padStart(2, "0"),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiredDate]);

  return (
    <div className="flex items-center space-x-1 font-bold text-red-600 text-lg">
      {timeLeft.days > 0 && (
        <>
          <span className="bg-white text-red-600 rounded px-2 py-1">
            {timeLeft.days}d
          </span>
          <span>:</span>
        </>
      )}
      <span className="bg-white text-red-600 rounded px-2 py-1">
        {timeLeft.hours}
      </span>
      <span>:</span>
      <span className="bg-white text-red-600 rounded px-2 py-1">
        {timeLeft.minutes}
      </span>
      <span>:</span>
      <span className="bg-white text-red-600 rounded px-2 py-1">
        {timeLeft.seconds}
      </span>
    </div>
  );
};

export default CountdownTimer;
