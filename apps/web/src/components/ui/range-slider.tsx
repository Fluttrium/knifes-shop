'use client';

import React, { useCallback } from "react";
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

  const getPercent = useCallback((value: number) => {
    return Math.round(((value - min) / (max - min)) * 100);
  }, [min, max]);

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMinVal = Math.min(+event.target.value, maxValue - step);
    onValueChange([newMinVal, maxValue]);
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxVal = Math.max(+event.target.value, minValue + step);
    onValueChange([minValue, newMaxVal]);
  };

  const minPercent = getPercent(minValue);
  const maxPercent = getPercent(maxValue);

  return (
    <div className={cn('relative', className)}>
      {/* Трек слайдера */}
      <div className="relative h-2 bg-gray-200 rounded-lg">
        {/* Активная область между ручками */}
        <div
          className="absolute h-2 bg-primary rounded-lg"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
      </div>

      {/* Минимальный слайдер */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={handleMinChange}
        className={cn(
          'absolute top-0 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer',
          'slider-thumb pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary',
          '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white',
          '[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer',
          '[&::-webkit-slider-thumb]:hover:bg-primary/80 [&::-webkit-slider-thumb]:transition-colors',
          '[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5',
          '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary',
          '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white',
          '[&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer'
        )}
        style={{ zIndex: minValue > max - 100 ? 5 : 1 }}
      />

      {/* Максимальный слайдер */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={handleMaxChange}
        className={cn(
          'absolute top-0 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer',
          'slider-thumb pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary',
          '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white',
          '[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer',
          '[&::-webkit-slider-thumb]:hover:bg-primary/80 [&::-webkit-slider-thumb]:transition-colors',
          '[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5',
          '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary',
          '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white',
          '[&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer'
        )}
        style={{ zIndex: maxValue < min + 100 ? 5 : 1 }}
      />

      {/* Отображение значений */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{minValue.toLocaleString()} ₽</span>
        <span>{maxValue.toLocaleString()} ₽</span>
      </div>
    </div>
  );
};