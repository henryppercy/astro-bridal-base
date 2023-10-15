import { 
  title, updating, addLetterTime, delayBeforeTypingIn, 
  longTitleLength, removeLetterTimeFast, removeLetterTimeSlow, 
  removeSentenceTime, slowCharacters 
} from '@stores/introStore';

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
