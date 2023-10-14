<template>
  <header class="h-1/2 flex items-end justify-center pb-8 px-8 md:px-12">
    <h1 class="font-serif uppercase text-[3.9rem] md:text-[6rem] lg:text-[7.5rem] text-pink text-center tracking-tighter leading-[0.8] w-fit py-1">
      {{ title }}
    </h1>
  </header> 
  <main class="h-1/2">
    <div class="pt-8 px-8 md:px-12 flex items-start justify-evenly flex-wrap">
      <TransitionGroup
        enter-from-class="translate-y-full opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-full opacity-0"
        enter-active-class="transition-all ease-[cubic-bezier(0.3, 0, 0, 1)] duration-500"
        leave-active-class="transition-all ease-[cubic-bezier(1, 0, 0, 0.3)] duration-500"
      >
        <div v-for="button in step.buttons" :key="button.text">
          <AppButton @click="changeStep(steps[button.nextStep].title, button.nextStep)" :disabled="updating">
            {{ button.text }}
          </AppButton>
        </div>
      </TransitionGroup>
    </div>
    <nav class="fixed flex right-6 bottom-6">
      <ul class="flex gap-3">
        <li @click="" class="font-sans uppercase text-xs tracking-[0.3rem] border-[0.2rem] border-white hover:text-black transition-colors rounded-full px-5 py-1 cursor-pointer">
          Back
        </li>
        <li class="font-sans uppercase text-xs tracking-[0.3rem] border-[0.2rem] border-white hover:text-black transition-colors rounded-full px-5 py-1"><a href="/help">Help</a></li>
      </ul>
    </nav>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Step } from '@lib/types';
import { changeTitle } from '@lib/utils';
import { 
  title, updating, addLetterTime, delayBeforeTypingIn, 
  longTitleLength, removeLetterTimeFast, removeLetterTimeSlow, 
  removeSentenceTime, slowCharacters, steps
} from '@stores/introStore';
import AppButton from '@components/atoms/AppButton.vue';

onMounted(() => {
  setTimeout(() => {
    changeStep('Hello', 1);
  }, 2000);
});

const step = ref<Step>({ step: 0, title: 'H&G', param: 'H&G', buttons: [] });

const changeStep = (newTitle: string, nextStep: number) => {
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
</script>
