<template>
  <header class="h-1/2 flex items-end justify-center pb-8 px-8 md:px-12">
    <h1 class="font-serif uppercase text-[3.9rem] md:text-[6rem] lg:text-[7.5rem] text-pink text-center tracking-tighter leading-[0.8] w-full">
      {{ title }}
    </h1>
  </header> 
  <main class="h-1/2 pt-8 px-8 md:px-12 flex items-start justify-evenly flex-wrap">
    <TransitionGroup
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
      enter-active-class="transition tw-ease-[cubic-bezier(0.3, 0, 0, 1)] duration-500"
      leave-active-class="transition tw-ease-[cubic-bezier(1, 0, 0, 0.3)] duration-500"
    >
      <template v-for="button in step.buttons" :key="button.text">
        <AppButton @click="changeStep(steps[button.nextStep].title, button.nextStep)" :disabled="updating">
          {{ button.text }}
        </AppButton>
      </template>
    </TransitionGroup>
  </main>
</template>

<script setup lang="ts">
import AppButton from '@components/atoms/AppButton.vue';
import type { Steps, Step } from '@lib/types';
import { changeTitle, title, updating, typeInSeed, typeOutSeed, typeInDelay } from '@lib/utils';
import { ref, onMounted } from 'vue';

onMounted(() => {
  setTimeout(() => {
    changeStep('Hello', 1, false);
  }, 3000);
});

const step = ref<Step>({ step: 0, title: 'H&G', param: 'H&G', buttons: [] });

const changeStep = (newTitle: string, nextStep: number, updateHistory = true) => {
  changeTitle(newTitle);
  
  step.value.buttons = [];
  const oldLength = step.value.title.length;
  const newLength = steps[nextStep].title.length;
  const timeout = (oldLength * typeOutSeed) + typeInDelay + (newLength * typeInSeed) + 400;
  
  setTimeout(() => {
    step.value = { ...steps[nextStep] };
  }, timeout);
};

const steps: Steps = {
  0: { 
    step: 0,
    title: 'H&G', 
    param: 'H&G',
    buttons: [] 
  },
  1: {
    step: 1,
    title: 'Hello',
    param: 'hello',
    buttons: [{ text: 'Hey', nextStep: 2 }]
  },
  2: {
    step: 2,
    title: 'Harriet & George Are Tying the Knot On 22.06.24.',
    param: 'tying-the-Knot',
    buttons: [
      { text: 'Okay', nextStep: 3 },
      { text: 'Finally, It\'s About Time He Asked', nextStep: 3 }
    ]
  },
  3: {
    step: 3,
    title: 'Are you coming?',
    param: 'Are-you-coming',
    buttons: [
      { text: 'Yes!', nextStep: 6 },
      { text: 'Let Me Check My Diary', nextStep: 4 },
      { text: 'Nah', nextStep: 5 }
    ]
  },
  4: {
    step: 4,
    title: 'No Problem, Come Back When You\'re Ready',
    param: 'come-back-when-youre-ready',
    buttons: [{ text: 'Okay I\'m Ready', nextStep: 3 }]
  },
  5: {
    step: 5,
    title: 'We\'ll Miss Ya',
    param: 'well-miss-ya',
    buttons: [{ text: 'Actually, I\'ve Changed My Mind', nextStep: 3 }]
  },
  6: {
    step: 6,
    title: 'Nice, Just Need a Few More Things',
    param: 'nice-just-need-a-few-more-things',
    buttons: []
  }
};
</script>
