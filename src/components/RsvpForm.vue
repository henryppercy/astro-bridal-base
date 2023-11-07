<template>
  <IntroHeader>
    {{ title }}
  </IntroHeader>
  <IntroMain>
    <SlideIn>
      <form ref="guestFormData" v-if="showForm" @submit.prevent="submitForm" class="flex flex-col md:flex-row gap-5">
        <div class="space-y-16 pb-16 md:px-40 w-full">
          <template v-for="(guest, index) in guests" :key="index">
            <RsvpField 
              v-if="!guest.completed"
              :guest-no="index"
              :guest="guest.data"
              :errors="(guest.index === index) ? guest.errors : { first_name: '', last_name: '', email: '', confirm_email: '', dietary_requirements: '' }"
              :completed="guest.completed"
              @updateGuest="handleUpdateGuest"
              @saveGuest="handleSaveGuest"
              @removeGuest="handleDeleteGuest"
            />
            <RsvpCompleteCard 
              v-if="guest.completed"
              :guest="guest.data"
              :guest-no="index"
              :only-guest="guests.length === 1"
              @deleteGuest="handleDeleteGuest"
              @editGuest="handleEditGuest"
            />
          </template>
          <div v-if="guestsCompleted" class="flex items-center justify-between flex-col max-md:gap-5 md:flex-row">
            <button class="font-sans uppercase text-sm md:text-lg tracking-[0.1rem] md:tracking-[0.3rem] border-[0.25rem] border-black hover:bg-black hover:text-white transition-colors rounded-full px-5 py-1 h-fit whitespace-nowrap" @click.prevent="addGuest" >New Guest</button>
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
import { changeTitle, createNewGuestField, formatZodValidationError, validateGuests } from '@lib/utils';
import { onMounted, onBeforeMount, ref, computed } from 'vue';
import type { Guest, GuestFormField, IndexedValidationError, IndexedGuest } from '@lib/types';
import RsvpCompleteCard from './RsvpCompleteCard.vue';

onBeforeMount(() => title.value = '');

onMounted(() => {
  setTimeout(async () => {
    await changeTitle('Nice, Just Need a Few More Details');
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

const guestFormData = ref<null | HTMLFormElement>(null);
const showForm = ref(false);
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

const removeGuest = () => {
  if (guests.value.length > 1) guests.value.pop();
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
      guests.value[error.index].errors = guestErrors;
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
      }
    }

    if (response.ok) {
      showForm.value = false;
      console.log('Successfully submitted');
    }
  } catch (error) {
    console.error('There was an error:', error);
  }
};
</script>
