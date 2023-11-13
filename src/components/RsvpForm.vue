<template>
  <IntroHeader class="max-md:hidden">
    <span>{{ title }}</span>
  </IntroHeader>
  <header class="md:hidden flex items-end justify-center px-8 md:px-12">
    <h1 class="font-serif uppercase text-[4.5rem] text-pink text-center tracking-tighter leading-[0.8] w-fit pt-12 pb-2">
      {{ mobileTitle }}
    </h1>
  </header> 
  <IntroMain>
    <SlideIn>
      <form ref="guestFormData" v-if="showForm" @submit.prevent="submitForm" class="flex flex-col md:flex-row gap-5 pb-8 md:pb-20">
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
              <AppButton class="font-sans uppercase text-sm md:text-lg tracking-[0.1rem] md:tracking-[0.3rem] border-[0.25rem] border-black hover:bg-black hover:text-white transition-colors rounded-full px-5 py-1 h-fit whitespace-nowrap" @click.prevent="addGuest">Add Guest</AppButton>
              <AppButton class="font-sans uppercase text-sm md:text-xl tracking-[0.1rem] md:tracking-[0.3rem] border-[0.25rem] border-black hover:bg-black hover:text-white transition-colors rounded-full px-5 py-1 h-fit whitespace-nowrap" type="submit">Finished</AppButton>
            </div>
          </SlideIn>
        </div>
      </form>
    </SlideIn>
  </IntroMain>
  <nav class="fixed flex bottom-0 w-full px-10 py-4 md:px-12 bg-white">
    <ul class="flex gap-5 md:gap-8 w-full justify-between">
      <li @click.prevent="handleBack" class="font-sans font-semibold uppercase text-xs tracking-[0.3rem] border-[0.2rem] border-white hover:text-black transition-colors rounded-full cursor-pointer" :disabled="updating" :class="{ 'cursor-not-allowed' : updating}">
        Back
      </li>
      <li class="font-sans uppercase text-xs tracking-[0.3rem] border-[0.2rem] border-white hover:text-black transition-colors rounded-full">
        <a href="/help">
          Help
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import IntroMain from './IntroMain.vue';
import IntroHeader from '@components/IntroHeader.vue';
import SlideIn from '@components/SlideIn.vue';
import RsvpField from '@components/RsvpField.vue';
import { title, mobileTitle } from '@stores/introStore';
import { changeTitle, changeMobileTitle, createNewGuestField, formatZodValidationError, validateGuests } from '@lib/utils';
import { onMounted, onBeforeMount, ref, computed } from 'vue';
import type { Guest, GuestFormField, IndexedValidationError, IndexedGuest } from '@lib/types';
import RsvpCompleteCard from './RsvpCompleteCard.vue';
import AppButton from './AppButton.vue';

onBeforeMount(() => title.value = '');

onMounted(() => {
  setTimeout(async () => {
    await changeMobileTitle('Details')
    changeTitle('Nice, Just Need a Few More Details');
    showForm.value = true;
  }, 1);
});

const guests = ref<GuestFormField[]>([
  {
    index: 0,
    errors: {
      first_name: '',
      last_name: '',
      email: '',
      confirm_email: '',
      dietary_requirements: ''
    },
    data: {
      first_name: '',
      last_name: '',
      email: '',
      confirm_email: '',
      dietary_requirements: ''
    },
    completed: false
  }
]);

const handleBack = (e: Event) => {
  e.preventDefault();
  window.history.back();
};

const guestFormData = ref<null | HTMLFormElement>(null);
const showForm = ref(false);
const requestPending = ref(false);
const guestsCompleted = computed(() => guests.value.every((guest) => guest.completed));

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

const clearGuestError = (guestNumber: number) => {
  guests.value[guestNumber].errors = {
    first_name: '',
    last_name: '',
    email: '',
    confirm_email: '',
    dietary_requirements: ''
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
      }
    }

    if (response.ok) {
      showForm.value = false;
      requestPending.value = false;
      console.log('Successfully submitted');
    }
  } catch (error) {
    console.error('There was an error:', error);
  }
};
</script>
