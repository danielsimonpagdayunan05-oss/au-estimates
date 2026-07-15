import { z } from "zod";

export const clientInfoSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  projectLocation: z.string().min(2, "Project location is required"),
  budget: z.string().min(1, "Select a budget range"),
  targetCompletion: z.string().min(1, "Select a target completion"),
  consultationDate: z.string(),
  notes: z.string(),
});

export type ClientInfoFormValues = z.infer<typeof clientInfoSchema>;
