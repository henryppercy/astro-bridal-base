import { ref } from 'vue';

export const title = ref('H&G');
export const updating = ref(false);
export const typeInSeed = 100;
export const typeInDelay = 150;
export const typeOutSeed = 80;

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const removeCharacter = async () => {
  while (title.value.length > 0) {
    title.value = title.value.slice(0, -1);
    await sleep(typeOutSeed);
  }
  await sleep(typeInDelay);
};

const addCharacter = async (str: string) => {
  for (let i = 0; i < str.length; i++) {
      title.value += str.charAt(i);
      await sleep(typeInSeed);
  }
};

export const changeTitle = async (newTitle: string) => {
  updating.value = true;
  await removeCharacter();
  await addCharacter(newTitle);
  updating.value = false;
};
