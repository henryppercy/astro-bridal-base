<template>
  <IntroHeader>
    {{ title }}
  </IntroHeader>
  <IntroMain>
    <SlideIn>
      <form v-if="showForm" @submit.prevent="submitForm" class="flex flex-col md:flex-row gap-5">
        <div class="space-y-16 pb-16 md:px-40 w-full">
          <template v-for="(guest, index) in guests" :key="index">
            <RsvpField 
              :guest-no="index + 1" 
              :errors="(guest.index === index + 1) ? guest.errors : { first_name: '', last_name: '', email: '', confirm_email: '', dietary_requirements: '' }"
            />
          </template>
          <div class="flex items-center justify-between flex-col max-md:gap-5 md:flex-row">
            <div class="space-x-4 max-md:flex max-md:justify-between w-full">
              <button class="font-sans uppercase text-sm md:text-lg tracking-[0.1rem] md:tracking-[0.3rem] border-[0.25rem] border-black hover:bg-black hover:text-white transition-colors rounded-full px-5 py-1 h-fit whitespace-nowrap" @click.prevent="addGuest">New Guest</button>
              <button v-if="guests.length > 1" class="font-sans uppercase text-sm md:text-lg tracking-[0.1rem] md:tracking-[0.3rem] border-[0.25rem] border-black hover:bg-black hover:text-white transition-colors rounded-full px-5 py-1 h-fit whitespace-nowrap" @click.prevent="removeGuest">Remove Guest</button>
            </div>
            <button class="font-sans uppercase text-sm md:text-xl tracking-[0.1rem] md:tracking-[0.3rem] border-[0.25rem] border-black hover:bg-black hover:text-white transition-colors rounded-full px-5 py-1 h-fit whitespace-nowrap" type="submit">Finished</button>
          </div>
        </div>
      </form>
    </SlideIn>
  </IntroMain>
  <nav class="fixed flex right-6 bottom-0 max-md:bg-white w-full h-10">
    <ul class="flex items-center justify-end gap-5 md:gap-8 w-full">
      <li class="font-sans uppercase text-xs tracking-[0.3rem] border-[0.2rem] border-white hover:text-black transition-colors rounded-full px-5 py-1"><a href="/help">Help</a></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import IntroMain from './IntroMain.vue';
import IntroHeader from '@components/IntroHeader.vue';
import SlideIn from '@components/SlideIn.vue';
import RsvpField from '@components/RsvpField.vue';
import { title } from '@stores/introStore';
import { changeTitle } from '@lib/utils';
import { onMounted, onBeforeMount, ref } from 'vue';
import type { Guest, GuestFormField, IndexedValidationError } from '@lib/types';

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
    index: 1,
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
    index: guests.value.length + 1,
    errors: {
      first_name: '',
      last_name: '',
      email: '',
      confirm_email: '',
      dietary_requirements: ''
    }
  });
};

const clearErrors = () => {
  guests.value.forEach((guest) => {
    guest.errors = {
      first_name: '',
      last_name: '',
      email: '',
      confirm_email: '',
      dietary_requirements: ''
    };
  });
};

const removeGuest = () => {
  if (guests.value.length > 1) guests.value.pop();
};

const submitForm = async (e: Event) => {
  clearErrors();

  const formData = new FormData(e.currentTarget as HTMLFormElement);

  try {
    const response = await fetch('/api/guests', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 422) {
        const data = await response.json();

        data.forEach((guestError: IndexedValidationError) => {
          const guestErrors: Guest = guestError.error.issues.reduce((acc, issue) => {
            const path = issue.path[0] as keyof Guest;
            acc[path] = issue.message;

            return acc;
          }, {
            first_name: '',
            last_name: '',
            email: '',
            confirm_email: '',
            dietary_requirements: ''
          });

          guests.value[guestError.index] = { errors: guestErrors, index: guestError.index + 1 };
        });
      }
    }

    if (response.ok) {
      // window.location.href = '/thank-you';
      showForm.value = false;
      console.log('Successfully submitted');
    }
  } catch (error) {
    console.error('There was an error:', error);
  }
};
</script>
