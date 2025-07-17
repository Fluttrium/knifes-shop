'use client';

import React from 'react';
import { cn } from '@/lib/utils';

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
    const newValue = Math.min(Number(e.target.value), maxValue - step);
    onValueChange([newValue, maxValue]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(Number(e.target.value), minValue + step);
    onValueChange([minValue, newValue]);
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative h-2 bg-gray-200 rounded-lg">
        <div
          className="absolute h-2 bg-primary rounded-lg"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={handleMinChange}
        className="absolute top-0 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={handleMaxChange}
        className="absolute top-0 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
      />
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2px solid #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2px solid #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};