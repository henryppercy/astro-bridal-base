import type { Guest, IndexedValidationError, IndexedGuest } from '@lib/types';
import { guestSchema } from "@lib/schema/guestSchema";

export const generateGuestArray = (formData: FormData): Guest[] => {
  const guests: Guest[] = [];
  const formDataEntries = [...formData.entries()];

  let maxGuestNumber = 0;
  for (const [key] of formDataEntries) {
    const match = key.match(/_(\d+)$/);
    if (match) {
      const guestNumber = parseInt(match[1], 10);
      maxGuestNumber = Math.max(maxGuestNumber, guestNumber);
    }
  }

  for (let guestNumber = 1; guestNumber <= maxGuestNumber; guestNumber++) {
    const guest: Guest = {
      first_name: formData.get(`first_name_${guestNumber}`) as string,
      last_name: formData.get(`last_name_${guestNumber}`) as string,
      email: formData.get(`email_${guestNumber}`) as string,
      confirm_email: formData.get(`confirm_email_${guestNumber}`) as string,
      dietary_requirements: formData.get(`dietary_requirements_${guestNumber}`) as string | undefined,
      rsvp: formData.get(`rsvp_${guestNumber}`) as string
    };
    guests.push(guest);
  }

  return guests;
}

export const validateGuests = (guests: Guest[]) => {
  const validatedGuests: IndexedGuest[] = [];
  const validationErrors: IndexedValidationError[] = [];

  for (const [index, guestData] of guests.entries()) {
    const validatedGuest = guestSchema.safeParse(guestData);
  
    if (validatedGuest.success) {
      validatedGuests.push({ index, guest: validatedGuest.data});
    } else {
      validationErrors.push({ index, error: validatedGuest.error });
    }
  }

  return { validatedGuests, validationErrors };
}

export const formatZodValidationError = (error: IndexedValidationError) => {
  return error.error.issues.reduce((acc, issue) => {
    const path = issue.path[0] as keyof Guest;
    acc[path] = issue.message;

    return acc;
  }, {
    first_name: '',
    last_name: '',
    email: '',
    confirm_email: '',
    dietary_requirements: '',
    rsvp: ''
  });
}

export const createNewGuestField = (guestLen: number) => {
  return {
    index: guestLen,
    errors: createEmptyGuest(),
    data: createEmptyGuest(),
    completed: false
  };
};

export const createEmptyGuest = () => ({
  first_name: '',
  last_name: '',
  email: '',
  confirm_email: '',
  dietary_requirements: '',
  rsvp: ''
});

export function sortGuestsAlphabeticallyAZ(guests: Guest[], type: 'az' | 'za') {
  return guests.reduce((sortedArray: Guest[], currentGuest: Guest): Guest[] => {
    let insertIndex;
    if (type === 'az') {
      insertIndex = sortedArray.findIndex(
        item => currentGuest.last_name.localeCompare(item.last_name) < 0
      );
    } else {
      insertIndex = sortedArray.findIndex(
        item => currentGuest.last_name.localeCompare(item.last_name) > 0
      );
    }

    if (insertIndex === -1) {
      sortedArray.push(currentGuest);
    } else {
      sortedArray.splice(insertIndex, 0, currentGuest);
    }

    return sortedArray;
  }, []);
}

export function sortGuestsByRsvp(guests: Guest[], type: 'yes' | 'no') {
  return guests.slice().sort((a: Guest, b: Guest) => {
    if (type === 'yes') {
      if (a.rsvp === 'yes' && b.rsvp !== 'yes') {
        return -1;
      } else if (a.rsvp !== 'yes' && b.rsvp === 'yes') {
        return 1;
      }
    } else {
      if (a.rsvp === 'no' && b.rsvp !== 'no') {
        return -1;
      } else if (a.rsvp !== 'no' && b.rsvp === 'no') {
        return 1;
      }
    }
    return 0;
  });
}

export function sortGuestsByDietaryRequirements(guests: Guest[], type: 'requirements' | 'noRequirements') {
  return guests.reduce((sortedArray: Guest[], currentGuest: Guest): Guest[] => {
    let insertIndex;
    if (type === 'requirements') {
      insertIndex = sortedArray.findIndex(
        item => item.dietary_requirements === '' && currentGuest.dietary_requirements !== ''
      );
    } else {
      insertIndex = sortedArray.findIndex(
        item => item.dietary_requirements !== '' && currentGuest.dietary_requirements === ''
      );
    }

    if (insertIndex === -1) {
      sortedArray.push(currentGuest);
    } else {
      sortedArray.splice(insertIndex, 0, currentGuest);
    }

    return sortedArray;
  }, []);
}
