import { z } from 'zod';

const requiredString = z.string().trim().min(1, 'Required field');
const nameRegex = /^\s*\w+\s+\w+\s*$/
const usernameRegex = /^[a-zA-Z0-9_]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

export const signUpSchema = z.object({
  email: requiredString.email('Invalid email address'),
  name: requiredString.regex(nameRegex, 'Only letters and minimum of 3 characters is allowed'),
  username: requiredString.regex(usernameRegex, 'Only letters, numbers, - and _ are allowed'),
  password: requiredString.regex(passwordRegex, 'It should contain atleast one uppercase, lowercases, special characters and not less than 6' )
});

export type signUpValues = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
  username: requiredString,
  password: requiredString
});

export type signInValues = z.infer<typeof signInSchema>

export const createPostSchema = z.object({
  content: requiredString,
  attachmentIds: z.array(z.string()).max(5, 'Cannot have more than 5 attachments')
});

export const updateProfileSchema = z.object({
  city: requiredString,
  displayName: requiredString,
  country: requiredString,
  state: requiredString,
  bio: z.string().max(1000, "Mut be at most 1000 characters").optional(), 
  website: z.string().optional(),
  occupation: z.string().optional(),
});

export type updateProfileValues = z.infer<typeof updateProfileSchema>

export const createCommentSchema = z.object({
  content: requiredString
});