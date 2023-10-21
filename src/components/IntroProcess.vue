<template>
  <IntroHeader>
    {{ title }}
  </IntroHeader>
  <main class="h-1/2">
    <IntroMain class="gap-10 flex items-start justify-evenly flex-wrap">
      <SlideIn>
        <div v-for="button in step.buttons" :key="button.text">
          <AppButton @click="button.nextStep === 6 ? navigateToForm() : changeStep(steps[button.nextStep].title, button.nextStep)" :disabled="updating">
            {{ button.text }}
          </AppButton>
        </div>
      </SlideIn>
    </IntroMain>
    <nav class="fixed flex right-6 bottom-6">
      <ul class="flex gap-5 md:gap-8">
        <li v-if="stepHistory.length" @click.prevent="handleBackNavigation" class="font-sans uppercase text-xs tracking-[0.3rem] border-[0.2rem] border-white hover:text-black transition-colors rounded-full py-1 cursor-pointer" :disabled="updating" :class="{ 'cursor-not-allowed' : updating}">
          Back
        </li>
        <li class="font-sans uppercase text-xs tracking-[0.3rem] border-[0.2rem] border-white hover:text-black transition-colors rounded-full px-5 py-1"><a href="/help">Help</a></li>
      </ul>
    </nav>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from 'vue';
import type { Step } from '@lib/types';
import { changeTitle, removeCharacter } from '@lib/utils';
import { 
  title, updating, addLetterTime, delayBeforeTypingIn, 
  longTitleLength, removeLetterTimeFast, removeLetterTimeSlow, 
  removeSentenceTime, slowCharacters, steps
} from '@stores/introStore';
import AppButton from '@components/AppButton.vue';
import IntroHeader from '@components/IntroHeader.vue';
import IntroMain from '@components/IntroMain.vue';
import SlideIn from '@components/SlideIn.vue';

onBeforeMount(() => title.value = 'H&G');
onBeforeUnmount(() => stepHistory.value = []);

onMounted(() => {
  setTimeout(() => {
    changeStep('Hello', 1);
  }, 2000);
});

const step = ref<Step>({ step: 0, title: 'H&G', param: 'H&G', buttons: [] });
const stepHistory = ref<Step[]>([]);

const handleBackNavigation = () => {
  if (stepHistory.value.length > 0 && (updating.value === false)) {
    const previousStep = stepHistory.value.pop();
    if (previousStep) changeStep(previousStep.title, previousStep.step, false);
  }
};

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

const navigateToForm = async () => {
  step.value.buttons = [];
  await removeCharacter();
  window.location.href = '/rsvp';
};
</script>
