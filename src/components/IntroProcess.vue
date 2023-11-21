<template>
  <IntroHeader>
    {{ title }}
  </IntroHeader>
  <main class="h-1/2">
    <IntroMain class="gap-4 md:gap-10 flex items-start justify-evenly flex-wrap">
      <SlideIn>
        <div v-if="showButtons" class="max-md:w-full" v-for="button in step.buttons" :key="button.text">
          <AppButton @click="handleChangeStep(steps[button.nextStep].title, button.nextStep)" :disabled="updating">
            {{ button.text }}
          </AppButton>
        </div>
      </SlideIn>
    </IntroMain>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from 'vue';
import type { Step, Steps } from '@lib/types';
import AppButton from '@components/AppButton.vue';
import IntroHeader from '@components/IntroHeader.vue';
import IntroMain from '@components/IntroMain.vue';
import SlideIn from '@components/SlideIn.vue';
import { navigate } from 'astro:transitions/client';

onBeforeMount(() => title.value = 'H&G');
onBeforeUnmount(() => title.value = 'H&G');

onMounted(() => {
  setTimeout(() => {
    changeStep('ello', 1);
  }, 2000);
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const removeCharacter = async (removeAll = false) => {
  let removeLetterTime = removeSentenceTime/title.value.length;
  if (title.value.length > longTitleLength) removeLetterTime = removeLetterTimeFast;
  
  const whileNumber = removeAll ? 0 : 1;

  while (title.value.length > whileNumber) {
    title.value = title.value.slice(0, -1);
    if (title.value.length <= slowCharacters) removeLetterTime = removeLetterTimeSlow;
    await sleep(removeLetterTime);
  }
  await sleep(delayBeforeTypingIn); // pause before typing in
};

const addCharacter = async (str: string) => {
  for (let i = 0; i < str.length; i++) {
    title.value += str.charAt(i);
    await sleep(addLetterTime);
  }
};

const changeTitle = async (newTitle: string) => {
  updating.value = true;
  await removeCharacter();
  await addCharacter(newTitle);
  updating.value = false;
};


const title = ref('');
const updating = ref(false);
const removeSentenceTime = 800;
const removeLetterTimeFast = 50;
const removeLetterTimeSlow = 300;
const addLetterTime = 100;
const delayBeforeTypingIn = 150;
const longTitleLength = 22;
const slowCharacters = 3;
const steps: Steps = {
  0: { 
    step: 0,
    title: 'H&G', 
    param: 'H&G',
    buttons: []
  },
  1: {
    step: 1,
    title: 'ello',
    param: 'hello',
    buttons: [{ text: 'Hey', nextStep: 2 }]
  },
  2: {
    step: 2,
    title: 'arriet & George Are Tying the Knot',
    param: 'tying-the-Knot',
    buttons: [
      { text: 'Finally, It\'s About Time He Asked', nextStep: 3 },
      { text: 'Okay', nextStep: 3 }
    ]
  },
  3: {
    step: 3,
    title: '',
    param: '',
    buttons: []
  },
};
const step = ref<Step>({ step: 0, title: 'H&G', param: 'H&G', buttons: [] });
const stepHistory = ref<Step[]>([]);
const showButtons = ref(true);

const changeStep = (newTitle: string, nextStep: number, addToHistory: boolean = true) => {
  if (addToHistory && step.value.title !== 'H&G') stepHistory.value.push(step.value);
  let removeSpeed = removeSentenceTime / title.value.length;

  if (title.value.length > longTitleLength) removeSpeed = removeLetterTimeFast;

  const wordRemoveSpeed = (title.value.length - slowCharacters) * removeSpeed + removeLetterTimeSlow * slowCharacters;
  const wordAddSpeed = newTitle.length * addLetterTime;

  changeTitle(newTitle);
  step.value.buttons = [];
  
  setTimeout(() => {
    step.value = { ...steps[nextStep] };
  }, wordRemoveSpeed + wordAddSpeed + delayBeforeTypingIn);
};

const handleChangeStep = async (newTitle: string, nextStep: number) => {
  if (nextStep === 3) {
    const html = document.querySelector('html');
    showButtons.value = false;
    await removeCharacter(true);
    await html?.classList.add('!bg-pink');
    setTimeout(() => {
      navigate('/home')
    }, 700);
  } else {
    changeStep(newTitle, nextStep)
  }
};
</script>
