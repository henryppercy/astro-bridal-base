import { ref } from 'vue';

export const title = ref('H&G');
export const updating = ref(false);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const removeCharacter = async (retainCount: number) => {
  while (title.value.length > retainCount) {
      title.value = title.value.slice(0, -1);
      await sleep(80);
  }
  await sleep(150);
};

const addCharacter = async (str: string) => {
  for (let i = 0; i < str.length; i++) {
      title.value += str.charAt(i);
      await sleep(100);
  }
};

export const changeTitle = async (newTitle: string, charsToRetain: number = 0) => {
  updating.value = true;
  await removeCharacter(charsToRetain);
  await addCharacter(newTitle.slice(charsToRetain));
  updating.value = false;
};
