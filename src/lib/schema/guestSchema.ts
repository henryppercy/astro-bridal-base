import { z } from "zod";

export const guestSchema = z.object({
  first_name: z
    .string({ required_error: "Please enter your first name" })
    .trim()
    .regex(/^[a-zA-Z]+$/, { message: "Your first name should only contain letters" })
    .max(50, { message: "Your first name should be shorter than 50 characters" })
    .min(2, { message: "Your first name should have at least 2 characters" })
    .transform((value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()),
  last_name: z
    .string({ required_error: "Please enter your last name" })
    .trim()
    .regex(/^[a-zA-Z]+$/, { message: "Your last name should only contain letters" })
    .min(2, { message: "Your last name should have at least 2 characters" })
    .max(50, { message: "Your last name should be shorter than 50 characters" })
    .transform((value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()),
  email: z
    .string({ required_error: "Please enter your email address" })
    .trim()
    .email({ message: "Please enter a valid email address" })
    .transform((value) => value.toLowerCase()),
  confirm_email: z
    .string({ required_error: "Please confirm your email address" })
    .email({ message: "Please enter a valid email address" })
    .trim()
    .transform((value) => value.toLowerCase()),
  dietary_requirements: z
    .string()
    .trim()
    .max(50, { message: "Dietary requirements should be under 50 characters" })
    .transform((value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
    .optional(),
  rsvp: z
    .string({ required_error: "Please let us know if you can make it" })
    .transform((value) => value.toLowerCase())
    .refine((value) => value === "yes" || value === "no", {
      message: "Please let us know if you can make it",
    })
})
.refine(data => data.email === data.confirm_email, {
  message: "The email addresses must match",
  path: ["confirm_email"]
});
