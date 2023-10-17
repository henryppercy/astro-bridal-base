<template>
  <IntroHeader>
    {{ title }}
  </IntroHeader>
  <IntroMain>
    <SlideIn>
      <form v-if="showForm" @submit.prevent="submitForm" class="flex flex-col md:flex-row gap-5">
        <div class="space-y-16 pb-16">
          <template v-for="(guest, index) in guests" :key="index">
            <SlideIn>
              <RsvpField 
                :guest-no="index + 1" 
                :errors="guest.errors"
              />
            </SlideIn>
          </template>
          <div class="space-x-4">
            <button class="font-sans uppercase text-sm md:text-lg tracking-[0.1rem] md:tracking-[0.3rem] border-[0.25rem] border-black hover:bg-black hover:text-white transition-colors rounded-full px-5 py-1 h-fit whitespace-nowrap" @click.prevent="addGuest">Add Guest</button>
            <button v-if="guests.length > 1" class="font-sans uppercase text-sm md:text-lg tracking-[0.1rem] md:tracking-[0.3rem] border-[0.25rem] border-black hover:bg-black hover:text-white transition-colors rounded-full px-5 py-1 h-fit whitespace-nowrap" @click.prevent="removeGuest">Remove Guest</button>
          </div>
        </div>
        <div class="flex justify-center">
          <button class="font-sans uppercase text-sm md:text-xl tracking-[0.1rem] md:tracking-[0.3rem] border-[0.25rem] border-black hover:bg-black hover:text-white transition-colors rounded-full px-5 py-1 h-fit whitespace-nowrap" type="submit">Submit</button>
        </div>
      </form>
    </SlideIn>
  </IntroMain>
  <nav class="fixed flex right-6 bottom-6">
    <ul class="flex gap-5 md:gap-8">
      <li class="font-sans uppercase text-xs tracking-[0.3rem] border-[0.2rem] border-white hover:text-black transition-colors rounded-full px-5 py-1"><a href="/help">Help</a></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount, ref } from 'vue';
import { changeTitle } from '@lib/utils';
import { title } from '@stores/introStore';
import type { GuestFormField } from '@lib/types';
import IntroMain from './IntroMain.vue';
import IntroHeader from '@components/IntroHeader.vue';
import SlideIn from '@components/SlideIn.vue';
import RsvpField from '@components/RsvpField.vue';

const showForm = ref(false);

onBeforeMount(() => title.value = '');

onMounted(() => {
  setTimeout(async () => {
    await changeTitle('Nice, Just Need a Few More Details');
    showForm.value = true;
  }, 1000);
});

const guests = ref<GuestFormField[]>([
  {
    errors: {
      first_name: '',
      last_name: '',
      email: '',
      confirm_email: '',
      dietary_requirements: ''
    }
  }
]);

const addGuest = () => {
  guests.value.push({
    errors: {
      first_name: '',
      last_name: '',
      email: '',
      confirm_email: '',
      dietary_requirements: ''
    }
  });
};

const removeGuest = () => {
  if (guests.value.length > 1) guests.value.pop();
};

const submitForm = async (e: Event) => {
  const formData = new FormData(e.currentTarget as HTMLFormElement);
  
  try {
    const response = await fetch('/api/guests', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('Error submitting form:', data);
    } else {
      // window.location.href = '/thank-you';
      console.log('Successfully submitted');
    }
  } catch (error) {
    console.error('There was an error:', error);
  }
};
</script>
