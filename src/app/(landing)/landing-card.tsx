"use client";
import { cn } from "@/lib/utils";

export function CardDemo({
  className,
  title,
  text,
}: {
  className?: string;
  title?: string;
  text?: string;
}) {
  return (
    <div className="w-full">
      <div
        className={cn(
          "group aspect-[148/96] cursor-pointer overflow-hidden relative card rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
          "bg-cover object-cover",
          // Preload hover image by setting it in a pseudo-element
          //"before:bg-[url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWlodTF3MjJ3NnJiY3Rlc2J0ZmE0c28yeWoxc3gxY2VtZzA5ejF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/syEfLvksYQnmM/giphy.gif)] before:fixed before:inset-0 before:opacity-0 before:z-[-1]",
          //"hover:bg-[url('/mods.gif')]",
          "hover:after:opacity-0",
          "after:content-[''] after:absolute after:inset-0 after:bg-black after:opacity-10",
          "transition-all duration-500",
          className
        )}
      >
        <div className="py-2 text relative z-50 after:content-[''] after:absolute after:inset-0 after:bg-black after:opacity-50 after:rounded-2xl after:z-[-1] group-hover:after:opacity-0 after:transition-all after:duration-500">
          <h1 className="font-bold text-xl md:text-3xl text-gray-50 relative group-hover:opacity-0 group-hover:translate-y-2 transition-all duration-500">
            {title}
          </h1>
          <p className="font-normal text-lg text-gray-50 relative my-4 group-hover:opacity-0 group-hover:translate-y-2 transition-all duration-500">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
