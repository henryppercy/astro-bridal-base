<template>
  <div class="space-y-5">
    <div class="flex flex-col md:flex-row gap-5 bg-white-light p-6 rounded-xl">
      <div class="space-y-7 md:w-1/2">
        <div class="relative">
          <input v-model="guest.first_name" @input="handleInput('first_name')" :class="{ '!bg-pink !text-white': guest.first_name !== '' }" class="text-black placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="text" :id="`first_name_${guestNo}`" :name="`first_name_${guestNo}`" placeholder="First name" required />
          <p class="text-rose-600 text-xs pl-2 mt-1 absolute">{{errors.first_name}}</p>
        </div>
        <div class="relative">
          <input v-model="guest.last_name" @input="handleInput('last_name')" :class="{ '!bg-pink !text-white': guest.last_name !== '' }" class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="text" :id="`last_name_${guestNo}`" :name="`last_name_${guestNo}`" placeholder="Second name" required />
          <p class="text-rose-600 text-xs pl-2 mt-1 absolute" >{{errors.last_name}}</p>
        </div>
        <div class="relative"> 
          <input v-model="guest.email" @input="handleInput('email')" :class="{ '!bg-pink !text-white': guest.email !== '' }" class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="email" :id="`email_${guestNo}`" :name="`email_${guestNo}`" placeholder="Email" required/>
          <p class="text-rose-600 text-xs pl-2 mt-1 absolute">{{errors.email}}</p>
        </div>
        <div class="relative"> 
          <input v-model="guest.confirm_email" @input="handleInput('confirm_email')" :class="{ '!bg-pink !text-white': guest.confirm_email !== '' }" class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="email" :id="`confirm_email_${guestNo}`" :name="`confirm_email_${guestNo}`" placeholder="Confirm Email" required/>
          <p class="text-rose-600 text-xs pl-2 mt-1 absolute">{{errors.confirm_email}}</p>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <textarea v-model="guest.dietary_requirements" @input="handleInput('dietary_requirements')" :class="{ '!bg-pink !text-white': guest.dietary_requirements !== '' }" class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-xl bg-white !w-full px-4 pt-3 uppercase md:w-1/2 h-full" :id="`dietary_requirements_${guestNo}`" :name="`dietary_requirements_${guestNo}`" placeholder="Dietary Requirements"></textarea>
        <p class="text-rose-600 text-xs pl-2 mt-1 absolute">{{errors.dietary_requirements}}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Guest } from '@lib/types';
import { ref } from 'vue';

const emit = defineEmits(['updateGuest']);

const props = defineProps<{
  guestNo: number, 
  errors: Guest,
  completed: boolean
}>();

const guest = ref<Guest>({
  first_name: '',
  last_name: '',
  email: '',
  confirm_email: '',
  dietary_requirements: ''
});

const updateGuestInput = () => {
  emit('updateGuest', [guest.value, props.guestNo]);
}

const handleInput = (field: keyof Guest) => {
  props.errors[field] = '';
  updateGuestInput();
}
</script>
