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
import { navigate } from 'astro:transitions/client';

onBeforeMount(() => title.value = 'H&G');
onBeforeUnmount(() => stepHistory.value = []);

onMounted(() => {
  setTimeout(() => {
    changeStep('Hello', 1);
  }, 2000);
});

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
    showButtons.value = false;
    await removeCharacter();
    navigate('/home')
  } else {
    changeStep(newTitle, nextStep)
  }
};
</script>
