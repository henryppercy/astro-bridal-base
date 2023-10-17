import { z } from "zod";

export const guestSchema = z.object({
  first_name: z
    .string({ required_error: "First name is required" })
    .trim()
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(50, { message: "First name must be less than 50 characters long" })
    .regex(/^[a-zA-Z]+$/, { message: "First name must only contain letters" })
    .transform((value) => value.charAt(0).toUpperCase() + value.slice(1)),
  last_name: z
    .string({ required_error: "Last name is required" })
    .trim()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(50, { message: "Last name must be less than 50 characters long" })
    .regex(/^[a-zA-Z]+$/, { message: "Last name must only contain letters" })
    .transform((value) => value.charAt(0).toUpperCase() + value.slice(1)),
  email: z
    .string({ required_error: "Email is required" })
    .email()
    .transform((value) => value.toLowerCase()),
  confirm_email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),
  dietary_requirements: z
    .string()
    .min(2, { message: "Dietary requirements must be at least 2 characters long" })
    .max(50, { message: "Dietary requirements must be less than 50 characters long" })
    .optional()
})
.refine(data => data.email === data.confirm_email, {
  message: "Email and confirm_email must be the same",
  path: ["confirm_email"]
});
