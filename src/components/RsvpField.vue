<template>
  <div class="space-y-5">
    <div class="flex flex-col md:flex-row gap-2 md:gap-8 bg-white-light p-3 lg:p-6 rounded-[1.5em] md:rounded-xl">
      <div class="space-y-2 md:space-y-3 w-full">
        <div class="relative">
          <input v-model="guest.first_name" @input="handleInput('first_name')" :class="{ '!bg-pink !text-white': guest.first_name !== '' }" class="text-sm md:text-base tracking-[0.05rem] text-black placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.17rem] md:border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="text" :id="`first_name_${guestNo}`" :name="`first_name_${guestNo}`" placeholder="First name" required />
          <p class="text-rose-600 text-xs pl-2 mt-1">{{errors.first_name}}</p>
        </div>
        <div class="relative">
          <input v-model="guest.last_name" @input="handleInput('last_name')" :class="{ '!bg-pink !text-white': guest.last_name !== '' }" class="text-sm md:text-base tracking-[0.05rem] placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.17rem] md:border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="text" :id="`last_name_${guestNo}`" :name="`last_name_${guestNo}`" placeholder="Second name" required />
          <p class="text-rose-600 text-xs pl-2 mt-1" >{{errors.last_name}}</p>
        </div>
        <div class="relative"> 
          <input v-model="guest.email" @input="handleInput('email')" :class="{ '!bg-pink !text-white': guest.email !== '' }" class="text-sm md:text-base tracking-[0.05rem] placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.17rem] md:border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="email" :id="`email_${guestNo}`" :name="`email_${guestNo}`" placeholder="Email" required/>
          <p class="text-rose-600 text-xs pl-2 mt-1">{{errors.email}}</p>
        </div>
        <div class="relative"> 
          <input v-model="guest.confirm_email" @input="handleInput('confirm_email')" :class="{ '!bg-pink !text-white': guest.confirm_email !== '' }" class="text-sm md:text-base tracking-[0.05rem] placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.17rem] md:border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="email" :id="`confirm_email_${guestNo}`" :name="`confirm_email_${guestNo}`" placeholder="Confirm Email" required/>
          <p class="text-rose-600 text-xs pl-2 mt-1">{{errors.confirm_email}}</p>
        </div>
        <div class="max-md:hidden flex flex-col md:flex-row justify-between gap-2">
          <button @click.prevent="saveGuest" class="font-sans uppercase tracking-[0.2rem] border-[0.2rem] border-black hover:bg-black bg-white hover:text-white transition-colors rounded-full px-5 py-3 w-full">Save</button>
          <button v-if="!onlyGuest" @click.prevent="removeGuest" type="button" class="font-sans uppercase tracking-[0.2rem] border-[0.2rem] border-black hover:bg-black bg-white hover:text-white transition-colors rounded-full px-5 py-3 w-full">Remove</button>
        </div>
      </div>
      <div class="flex flex-col md:w-3/4">
        <textarea v-model="guest.dietary_requirements" @input="handleInput('dietary_requirements')" :class="{ '!bg-pink !text-white': guest.dietary_requirements !== '' }" class="text-sm md:text-base tracking-[0.05rem] placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.17rem] md:border-[0.25rem] rounded-2xl bg-white !w-full px-4 pt-3 uppercase md:w-1/2 h-32 md:h-full" :id="`dietary_requirements_${guestNo}`" :name="`dietary_requirements_${guestNo}`" placeholder="Any Dietary Requirements"></textarea>
        <p class="text-rose-600 text-xs pl-2 mt-1">{{errors.dietary_requirements}}</p>
      </div>
      <div class="md:hidden flex flex-col md:flex-row justify-between gap-2">
        <AppButton @click.prevent="saveGuest">Save</AppButton>
        <AppButton v-if="!onlyGuest" @click.prevent="removeGuest" type="button">Remove</AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Guest } from '@lib/types';
import AppButton from './AppButton.vue';

const emit = defineEmits(['updateGuest', 'saveGuest', 'removeGuest']);

const props = defineProps<{
  guestNo: number, 
  errors: Guest,
  completed: boolean,
  guest: Guest,
  onlyGuest: boolean
}>();

const updateGuestInput = () => {
  emit('updateGuest', [props.guest, props.guestNo]);
}

const saveGuest = () => {
  emit('saveGuest', props.guestNo);
}

const removeGuest = () => {
  emit('removeGuest', props.guestNo);
}

const handleInput = (field: keyof Guest) => {
  props.errors[field] = '';
  updateGuestInput();
}
</script>
