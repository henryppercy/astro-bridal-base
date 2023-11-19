<template>
  <IntroHeader>
    {{ title }}
  </IntroHeader>
  <main class="h-1/2">
    <IntroMain class="gap-4 md:gap-10 flex items-start justify-evenly flex-wrap">
      <SlideIn>
        <div class="max-md:w-full" v-for="button in step.buttons" :key="button.text">
          <AppButton @click="handleChangeStep(steps[button.nextStep].title, button.nextStep)" :disabled="updating">
            {{ button.text }}
          </AppButton>
        </div>
      </SlideIn>
    </IntroMain>
    <nav class="fixed flex bottom-0 w-full px-10 py-8 md:px-16 md:py-10">
      <ul class="flex gap-5 md:gap-8 w-full" :class="stepHistory.length ? 'justify-between' : 'justify-end'">
        <li v-if="stepHistory.length" @click.prevent="handleBackNavigation" class="font-sans font-semibold uppercase text-xs tracking-[0.3rem] border-[0.2rem] border-white hover:text-black transition-colors rounded-full cursor-pointer" :disabled="updating" :class="{ '!cursor-not-allowed' : updating}">
          Back
        </li>
        <li class="font-sans uppercase text-xs tracking-[0.3rem] border-[0.2rem] border-white hover:text-black transition-colors rounded-full"><a href="/help">
          Help
        </a></li>
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

const handleChangeStep = (newTitle: string, nextStep: number) => {
  switch (nextStep) {
    case 6:
      window.location.href = '/extra-information';
      break;
    case 5:
      navigateToForm()
      break;
    default:
      changeStep(newTitle, nextStep);
      break;
  }
};

const navigateToForm = async () => {
  step.value.buttons = [];
  await removeCharacter();
  window.location.href = '/rsvp';
};
</script>
