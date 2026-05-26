import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

/**
 * Merge TailwindCSS classes with conflict resolution.
 * Usage: cn("p-4 bg-red-500", isActive && "bg-blue-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
