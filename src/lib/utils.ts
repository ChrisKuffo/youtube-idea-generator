import { clsx, type ClassValue } from "clsx"; // Import clsx for conditional class name concatenation
import { twMerge } from "tailwind-merge"; // Import twMerge to merge Tailwind CSS class names

// Function to conditionally merge class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)); // Use clsx to conditionally join class names and twMerge to handle Tailwind CSS conflicts
}

// Function to format large numbers into a more readable string
export function formatCount(count: number): string {
  if (!count) return "0"; // Return "0" if the count is falsy (e.g., null, undefined, 0)

  if (count >= 1000000) {
    // Format numbers in the millions
    return `${(count / 1000000).toLocaleString(undefined, {
      maximumFractionDigits: 1, // Show up to one decimal place
      minimumFractionDigits: 0, // Show no decimal places if the number is whole
    })}M`;
  }

  if (count >= 1000) {
    // Format numbers in the thousands
    return `${(count / 1000).toLocaleString(undefined, {
      maximumFractionDigits: 1, // Show up to one decimal place
      minimumFractionDigits: 0, // Show no decimal places if the number is whole
    })}k`;
  }

  return count.toString(); // Return the count as a string if it's less than 1000
}