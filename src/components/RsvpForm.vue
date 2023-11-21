<template>
  <SlideIn>
    <div v-if="error" class="flex justify-center w-full py-4 px-4 md:px-10 fixed">
      <div class="w-full bg-pink text-xs md:text-sm rounded-2xl px-4 py-2 top-0 left-0 uppercase text-white flex justify-between">
        <p>Something went wrong, please try again or send us an <span class="max-md:hidden">email </span>
          <a href="mailto:help@harrietandgeorge.co.uk" class="border-b">
            <span class="max-md:hidden">help@harrietandgeorge.co.uk</span>
            <span class="md:hidden">email</span>
          </a>
        </p>
        <button @click.prevent="error = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><path fill="none" class="stroke-white" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m8 8l32 32M8 40L40 8"/></svg>
        </button>
      </div>
    </div>
  </SlideIn>
  <header class="flex items-end justify-center pb-8 px-8 py-12 md:px-12 z-20">
    <h1 class="font-serif uppercase text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] text-pink text-center tracking-tighter leading-[0.8] w-fit py-1 pt-12 pb-2">
      Guest Details
    </h1>
  </header> 
  <div class="pt-8 px-4 lg:px-12 mx-auto">
    <SlideIn>
      <form ref="guestFormData" v-if="showForm" @submit.prevent="submitForm" class="flex flex-col md:flex-row gap-5">
        <div class="space-y-4 md:space-y-8 pb-16 w-full">
          <template v-for="(guest, index) in guests" :key="index">
            <RsvpField 
              v-if="!guest.completed"
              :guest-no="index"
              :guest="guest.data"
              :errors="guest.errors"
              :completed="guest.completed"
              :only-guest="guests.length === 1"
              @updateGuest="handleUpdateGuest"
              @saveGuest="handleSaveGuest"
              @removeGuest="handleDeleteGuest"
            />
            <RsvpCompleteCard 
              v-if="guest.completed"
              :guest="guest.data"
              :guest-no="index"
              :only-guest="guests.length === 1"
              :request-pending="requestPending"
              @deleteGuest="handleDeleteGuest"
              @editGuest="handleEditGuest"
            />
          </template>
          <SlideIn>
            <div v-if="guestsCompleted && !requestPending" class="flex items-center justify-between flex-col gap-5 md:flex-row">
              <AppButton class="font-sans uppercase text-sm md:text-lg tracking-[0.1rem] md:tracking-[0.3rem] border-[0.25rem] border-black hover:bg-black hover:text-white transition-colors rounded-full px-5 py-1 h-fit whitespace-nowrap" @click.prevent="addGuest" type="button">New Guest</AppButton>
              <AppButton class="font-sans uppercase text-sm md:text-xl tracking-[0.1rem] md:tracking-[0.3rem] border-[0.25rem] border-black hover:bg-black hover:text-white transition-colors rounded-full px-5 py-1 h-fit whitespace-nowrap" type="submit">Finished</AppButton>
            </div>
          </SlideIn>
        </div>
      </form>
    </SlideIn>
  </div>
</template>

<script setup lang="ts">

import SlideIn from '@components/SlideIn.vue';
import RsvpField from '@components/RsvpField.vue';
import { createNewGuestField, formatZodValidationError, validateGuests } from '@lib/utils';
import { onBeforeMount, onBeforeUnmount, ref, computed } from 'vue';
import type { Guest, GuestFormField, IndexedValidationError, IndexedGuest } from '@lib/types';
import RsvpCompleteCard from './RsvpCompleteCard.vue';
import AppButton from './AppButton.vue';

onBeforeUnmount(() => {
  setTimeout(async () => {
    showForm.value = true;
  }, 1);
})

const guests = ref<GuestFormField[]>([
  {
    index: 0,
    errors: {
      first_name: '',
      last_name: '',
      email: '',
      confirm_email: '',
      dietary_requirements: '',
      rsvp: ''
    },
    data: {
      first_name: '',
      last_name: '',
      email: '',
      confirm_email: '',
      dietary_requirements: '',
      rsvp: ''
    },
    completed: false
  }
]);

const guestFormData = ref<null | HTMLFormElement>(null);
const showForm = ref(true);
const requestPending = ref(false);
const guestsCompleted = computed(() => guests.value.every((guest) => guest.completed));
const error = ref(false);

const clearErrors = () => {
  guests.value.forEach((guest) => {
    guest.errors = {
      first_name: '',
      last_name: '',
      email: '',
      confirm_email: '',
      dietary_requirements: '',
      rsvp: ''
    };
  });
};

const clearGuestError = (guestNumber: number) => {
  guests.value[guestNumber].errors = {
    first_name: '',
    last_name: '',
    email: '',
    confirm_email: '',
    dietary_requirements: '',
    rsvp: ''
  };
};

const handleUpdateGuest = ([guestData, guestNumber]: [Guest, number]) => {
  guests.value[guestNumber].data = guestData;
}

const handleDeleteGuest = (guestNumber: number) => {
  guests.value.splice(guestNumber, 1);
}

const handleEditGuest = (guestNumber: number) => {
  guests.value[guestNumber].completed = false;
}

const handleSaveGuest = (guestNumber: number) => {
  const { validatedGuests, validationErrors } = validateGuests([guests.value[guestNumber].data]);
  
  clearGuestError(guestNumber);
  
  if (validationErrors?.length > 0) {
    validationErrors.forEach((error: IndexedValidationError) => {
      const guestErrors: Guest = formatZodValidationError(error);
      guests.value
      guests.value[guestNumber].errors = guestErrors;
    });
  } else {
      guests.value[guestNumber].completed = true;
  }
}

const addGuest = () => {
  if (guestFormData.value !== null) {
    const guestsFormatted: Guest[] = guests.value.map((guest) => guest.data);
    const { validatedGuests, validationErrors } = validateGuests(guestsFormatted);

    clearErrors();

    if (validationErrors?.length > 0) {
      validationErrors.forEach((error: IndexedValidationError) => {
        const guestErrors: Guest = formatZodValidationError(error);
        guests.value[error.index] = { errors: guestErrors, index: error.index, data: guestsFormatted[error.index], completed: false };
      });
    }

    validatedGuests.forEach((guest: IndexedGuest) => {
      guests.value[guest.index].data = guestsFormatted[guest.index];
      guests.value[guest.index].completed = true;
    });

    const guestsWithErrors = guests.value.filter((guest) => Object.values(guest.errors).some((error) => error.length > 0));

    if (guestsWithErrors.length === 0) {
      clearErrors();
      guests.value.push(createNewGuestField(guests.value.length));
    }
  }
};

const submitForm = async (e: Event) => {
  error.value = false;
  requestPending.value = true;
  clearErrors();

  try {
    const guestsFormatted: Guest[] = guests.value.map((guest) => guest.data);

    const response = await fetch('/api/guests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guestsFormatted),
    });

    if (!response.ok) {
      if (response.status === 422) {
        const data = await response.json();
        data.forEach((guestError: IndexedValidationError) => guests.value[guestError.index].errors = formatZodValidationError(guestError));
        requestPending.value = false;
      } else {
        error.value = true;
        requestPending.value = false;
      }
    }

    if (response.ok) {
      showForm.value = false;
      requestPending.value = false;

      console.log('Successfully submitted');
      const html = document.querySelector('html');
      await html?.classList.add('!bg-pink');
      setTimeout(() => {
        window.location.href = response.url;
      }, 700);
    }
  } catch (error) {
    console.error('There was an error:', error);
  }
};
</script>
