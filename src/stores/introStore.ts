import { ref } from 'vue';
import type { Steps } from '@lib/types';

export const title = ref('');
export const mobileTitle = ref('');
export const updating = ref(false);

export const removeSentenceTime = 800;

export const removeLetterTimeFast = 50;
export const removeLetterTimeSlow = 300;

export const addLetterTime = 100;

export const delayBeforeTypingIn = 150;

export const longTitleLength = 22;
export const slowCharacters = 3;

export const steps: Steps = {
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
    title: 'Harriet & George Are Tying the Knot',
    param: 'tying-the-Knot',
    buttons: [
      { text: 'Finally, It\'s About Time He Asked', nextStep: 3 },
      { text: 'Okay', nextStep: 3 }
    ]
  },
  3: {
    step: 3,
    title: 'Are you coming?',
    param: 'Are-you-coming',
    buttons: [
      { text: 'RSVP', nextStep: 4 },
      { text: 'Tell me More', nextStep: 5 },
    ]
  },
  4: {
    step: 4,
    title: 'Nice, Just Need a Few More Things',
    param: 'nice-just-need-a-few-more-things',
    buttons: []
  },
  5: {
    step: 5,
    title: '',
    param: '',
    buttons: []
  }
};
