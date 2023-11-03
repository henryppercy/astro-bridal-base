import type { Guest } from '@lib/types';
import { 
  title, updating, addLetterTime, delayBeforeTypingIn, 
  longTitleLength, removeLetterTimeFast, removeLetterTimeSlow, 
  removeSentenceTime, slowCharacters 
} from '@stores/introStore';

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
    };
    guests.push(guest);
  }

  return guests;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const removeCharacter = async () => {
  let removeLetterTime = removeSentenceTime/title.value.length;
  if (title.value.length > longTitleLength) removeLetterTime = removeLetterTimeFast;

  while (title.value.length > 0) {
    title.value = title.value.slice(0, -1);
    if (title.value.length <= slowCharacters) removeLetterTime = removeLetterTimeSlow;
    await sleep(removeLetterTime);
  }
  await sleep(delayBeforeTypingIn); // pause before typing in
};

export const addCharacter = async (str: string) => {
  for (let i = 0; i < str.length; i++) {
    title.value += str.charAt(i);
    await sleep(addLetterTime);
  }
};

export const changeTitle = async (newTitle: string) => {
  updating.value = true;
  await removeCharacter();
  await addCharacter(newTitle);
  updating.value = false;
};
