import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ErrorResponseDto } from "@/types";

// Tailwind class merger (added by shadcn init)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API error message extractor
export function getErrorMessage(error: unknown): string {
  // Check for the error DTO in the response object
  if (typeof error === "object" && error !== null && "response" in error) {
    // Cast the error response to match expected DTO
    const axiosError = error as { response?: { data?: Partial<ErrorResponseDto> } };

    // If valid error response DTO send its message
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
  }

  // Fallback to standard JavaScript Error messages
  if (error instanceof Error) {
    return error.message;
  }

  // Final fallback for completely unknown error types
  return "An unexpected error occurred.";
}