<template>
  <header class="h-1/2 flex items-end justify-center pb-8 px-8 md:px-12">
    <h1 class="font-serif uppercase text-[3.9rem] md:text-[6rem] lg:text-[7.5rem] text-pink text-center tracking-tighter leading-[0.8] w-full">
      {{ title }}
    </h1>
  </header> 
  <main class="h-1/2 pt-8 px-8 md:px-12 flex items-start justify-evenly flex-wrap">
    <template v-for="button in steps[step].buttons" :key="button.text">
        <AppButton @click="changeStep(steps[button.nextStep].title, button.nextStep, button.retainCharacters)">
          {{ button.text }}
        </AppButton>
    </template>
  </main>
</template>

<script setup lang="ts">
import AppButton from '@components/atoms/AppButton.vue';
import type { Steps } from '@lib/types';
import { changeTitle, title } from '@lib/utils';
import { ref, onMounted } from 'vue';

onMounted(() => {
  setTimeout(() => {
    changeStep('Hello', 1, 1);
  }, 3000);
});

const step = ref(0);

const steps: Steps = {
  0: { 
    title: 'H&G', 
    buttons: [] 
  },
  1: {
    title: 'Hello',
    buttons: [{ text: 'Hey', nextStep: 2, retainCharacters: 1 }]
  },
  2: {
    title: 'Harriet & George Are Tying the Knot On 22.06.24.',
    buttons: [
      { text: 'Okay', nextStep: 3, retainCharacters: 0 },
      { text: 'Finally, It\'s About Time He Asked', nextStep: 3, retainCharacters: 0 }
    ]
  },
  3: {
    title: 'Are you coming?',
    buttons: [
      { text: 'Yes!', nextStep: 6, retainCharacters: 0 },
      { text: 'Let Me Check My Diary', nextStep: 4, retainCharacters: 0 },
      { text: 'Nah', nextStep: 5, retainCharacters: 0 }
    ]
  },
  4: {
    title: 'No Problem, Come Back When You\'re Ready',
    buttons: [{ text: 'Okay I\'m Ready', nextStep: 3, retainCharacters: 0 }]
  },
  5: {
    title: 'We\'ll Miss Ya',
    buttons: [{ text: 'Actually, I\'ve Changed My Mind', nextStep: 3, retainCharacters: 0 }]
  },
  6: {
    title: 'Nice, Just Need a Few More Things',
    buttons: []
  }
};

const changeStep = (newTitle: string, nextStep: number, retainCharacters: number) => {
  step.value = nextStep;
  
  changeTitle(newTitle, retainCharacters);
};
</script>
