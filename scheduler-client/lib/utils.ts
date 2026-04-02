import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Tailwind class merger (added by shadcn init)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API error message extractor
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
  ) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message ?? "An unexpected error occurred.";
  }
  return "An unexpected error occurred.";
}