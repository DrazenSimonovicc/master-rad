import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

// Password validation schema with strength requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Auth validation schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// User update validation
export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(255).optional(),
  primaryEducation: z.string().optional(),
  secondaryEducation: z.string().optional(),
  faculty: z.string().optional(),
  university: z.string().optional(),
  currentWork: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  topEducation: z.string().optional(),
  educationDegree: z.string().optional(),
});

// Forum validation
export const createForumNewsSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  text: z.string().min(10, 'Text must be at least 10 characters'),
  categoryId: z.string().cuid('Invalid category ID'),
  authorName: z.string().optional(),
  currentWork: z.string().optional(),
  imageDescription: z.string().optional(),
  mainNews: z.boolean().optional(),
});

// Generic validation middleware
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          error: 'Validation failed',
          details: errors,
        });
      }
      next(error);
    }
  };
};

