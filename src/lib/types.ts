import type { ZodError } from "zod";

export type Guest = {
  first_name: string;
  last_name: string;
  email: string;
  confirm_email: string;
  dietary_requirements?: string;
  rsvp: string;
};

export type GuestFormField = {
  index: number;
  errors: Guest
  data: Guest;
  completed: boolean;
}

export type Step = {
  step: number;
  title: string;
  param: string;
  buttons: {
    text: string;
    nextStep: number;
  }[];
};

export type Steps = {
  [key: number]: Step;
};

export type IndexedValidationError = {
  index: number;
  error: ZodError;
};

export type IndexedGuest = {
  index: number;
  guest: Guest;
};
