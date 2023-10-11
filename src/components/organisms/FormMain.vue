<template>
  <header class="h-1/2 flex items-end justify-center pb-8 px-8 md:px-12">
    <h1 class="font-serif uppercase text-[3.9rem] md:text-[6rem] lg:text-[7.5rem] text-pink text-center tracking-tighter leading-[0.8] w-full">
      {{ title }}
    </h1>
  </header> 
  <main class="h-1/2 pt-8 px-8 md:px-12 flex items-start justify-evenly flex-wrap">
    <template v-for="button in steps[step].buttons" :key="button.text">
        <AppButton @click="changeStep(steps[button.nextStep].title, button.nextStep)">
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
    changeStep('Hello', 1, false);
    window.history.pushState({ newTitle: 'Hello', nextStep: 1 }, 'hello', '');
  }, 3000);

  window.onpopstate = (event: PopStateEvent) => {
    if (event.state) {
      step.value = event.state.nextStep;
      title.value = event.state.newTitle;
    }
  };
});

const step = ref(0);

const steps: Steps = {
  0: { 
    title: 'H&G', 
    param: 'H&G',
    buttons: [] 
  },
  1: {
    title: 'Hello',
    param: 'hello',
    buttons: [{ text: 'Hey', nextStep: 2 }]
  },
  2: {
    title: 'Harriet & George Are Tying the Knot On 22.06.24.',
    param: 'tying-the-Knot',
    buttons: [
      { text: 'Okay', nextStep: 3 },
      { text: 'Finally, It\'s About Time He Asked', nextStep: 3 }
    ]
  },
  3: {
    title: 'Are you coming?',
    param: 'Are-you-coming',
    buttons: [
      { text: 'Yes!', nextStep: 6 },
      { text: 'Let Me Check My Diary', nextStep: 4 },
      { text: 'Nah', nextStep: 5 }
    ]
  },
  4: {
    title: 'No Problem, Come Back When You\'re Ready',
    param: 'come-back-when-youre-ready',
    buttons: [{ text: 'Okay I\'m Ready', nextStep: 3 }]
  },
  5: {
    title: 'We\'ll Miss Ya',
    param: 'well-miss-ya',
    buttons: [{ text: 'Actually, I\'ve Changed My Mind', nextStep: 3 }]
  },
  6: {
    title: 'Nice, Just Need a Few More Things',
    param: 'nice-just-need-a-few-more-things',
    buttons: []
  }
};

const changeStep = (newTitle: string, nextStep: number, updateHistory = true) => {
  step.value = nextStep;
  
  if (updateHistory) window.history.pushState({ newTitle, nextStep }, steps[step.value].title, `?step=${steps[step.value].param}`);

  changeTitle(newTitle);
};
</script>
