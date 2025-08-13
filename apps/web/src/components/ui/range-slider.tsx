"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onValueChange: (values: [number, number]) => void;
  className?: string;
}

export const RangeSlider: React.FC<Props> = ({
  min,
  max,
  step,
  value,
  onValueChange,
  className,
}) => {
  const [minValue, maxValue] = value;
  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    // Предотвращаем пересечение с максимальным значением
    if (newValue >= maxValue) {
      onValueChange([maxValue - step, maxValue]);
    } else {
      onValueChange([newValue, maxValue]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    // Предотвращаем пересечение с минимальным значением
    if (newValue <= minValue) {
      onValueChange([minValue, minValue + step]);
    } else {
      onValueChange([minValue, newValue]);
    }
  };

  return (
    <div className={cn("relative h-8", className)}>
      {/* Фоновая полоса */}
      <div className="absolute top-3 left-0 right-0 h-2 bg-gray-200 rounded-lg">
        {/* Активная область */}
        <div
          className="absolute h-2 bg-blue-500 rounded-lg"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
      </div>
      
      {/* Минимальный ползунок - размещаем слева */}
      <div className="absolute top-0 left-0 w-1/2 h-8">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="w-full h-8 bg-transparent appearance-none cursor-pointer"
        />
      </div>
      
      {/* Максимальный ползунок - размещаем справа */}
      <div className="absolute top-0 right-0 w-1/2 h-8">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="w-full h-8 bg-transparent appearance-none cursor-pointer"
        />
      </div>
      
      {/* Кастомные стили для ползунков */}
      <style jsx>{`
        /* Стили для минимального ползунка (левый) */
        .w-1/2:first-of-type input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2px solid #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        
        .w-1/2:first-of-type input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2px solid #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        
        /* Стили для максимального ползунка (правый) */
        .w-1/2:last-of-type input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          border: 2px solid #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        
        .w-1/2:last-of-type input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          border: 2px solid #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        
        /* Hover эффекты */
        .w-1/2:first-of-type input[type="range"]:hover::-webkit-slider-thumb {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .w-1/2:first-of-type input[type="range"]:hover::-moz-range-thumb {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .w-1/2:last-of-type input[type="range"]:hover::-webkit-slider-thumb {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .w-1/2:last-of-type input[type="range"]:hover::-moz-range-thumb {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        /* Active эффекты */
        .w-1/2 input[type="range"]:active::-webkit-slider-thumb {
          transform: scale(1.05);
        }
        
        .w-1/2 input[type="range"]:active::-moz-range-thumb {
          transform: scale(1.05);
        }
        
        /* Focus эффекты */
        .w-1/2:first-of-type input[type="range"]:focus::-webkit-slider-thumb {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        .w-1/2:last-of-type input[type="range"]:focus::-webkit-slider-thumb {
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }
        
        .w-1/2 input[type="range"]:focus::-moz-range-thumb {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};
