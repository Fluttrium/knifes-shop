"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React from "react";

const stories = [
  {
    id: 1,
    previewImageUrl: "/stories/story-1.jpg",
    title: "Новые поступления",
  },
  {
    id: 2,
    previewImageUrl: "/stories/story-2.jpg",
    title: "Акции и скидки",
  },
  {
    id: 3,
    previewImageUrl: "/stories/story-3.jpg",
    title: "Уход за ножами",
  },
  {
    id: 4,
    previewImageUrl: "/stories/story-4.jpg",
    title: "Профессиональная заточка",
  },
  {
    id: 5,
    previewImageUrl: "/stories/story-5.jpg",
    title: "Рецепты от шефов",
  },
];

interface Props {
  className?: string;
}

export const Stories: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      {stories.map((story) => (
        <div
          key={story.id}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-[200px] h-[250px] bg-gradient-to-br from-orange-400 to-red-500 rounded-md mb-2 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-black/20 rounded-md"></div>
            <span className="text-white text-sm font-bold relative z-10 text-center px-2">
              {story.title}
            </span>
          </div>
          <span className="text-xs text-center max-w-[200px] truncate">
            {story.title}
          </span>
        </div>
      ))}
    </div>
  );
};
