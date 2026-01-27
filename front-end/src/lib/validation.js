import { z } from "zod";

// Registration validation schema
export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[+]?[\d\s-]+$/, "Please enter a valid phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  percentage: z
    .number()
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password must be less than 128 characters"),
});

// Student profile validation
export const studentProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  percentage: z
    .number()
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100"),
});

// University profile validation
export const universityProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "University name is required")
    .max(200, "University name must be less than 200 characters"),
  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(100, "City name must be less than 100 characters"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
});

// Program validation
export const programSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Program name is required")
    .max(200, "Program name must be less than 200 characters"),
  duration: z
    .string()
    .trim()
    .min(1, "Duration is required")
    .max(50, "Duration must be less than 50 characters"),
});

// Scholarship validation
export const scholarshipSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  amount: z
    .number()
    .min(0, "Amount cannot be negative")
    .max(10000000, "Amount seems too high"),
  deadline: z.string().min(1, "Deadline is required"),
});

// Event validation
export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Event title is required")
    .max(200, "Event title must be less than 200 characters"),
  date: z.string().min(1, "Date is required"),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(200, "Location must be less than 200 characters"),
});

// News validation
export const newsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(5000, "Content must be less than 5000 characters"),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine((file) => {
    const allowedTypes = ['application/pdf'];
    return allowedTypes.includes(file.type);
  }, "Only PDF files are allowed").refine((file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  }, "File size must be less than 5MB"),
});

// Helper to validate and get errors
export function validateForm(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, errors: null };
  }
  const errors = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });
  return { success: false, data: null, errors };
}

// Sanitize text input to prevent XSS
export function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
