<template>
  <div class="space-y-5">
    <div class="flex flex-col md:flex-row gap-5">
      <div class="space-y-5 md:w-1/2">
        <input class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="text" :id="`first_name_${guestNo}`" :name="`first_name_${guestNo}`" placeholder="First name" required />
        <input class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="text" :id="`last_name_${guestNo}`" :name="`last_name_${guestNo}`" placeholder="Second name" required />
        <input class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="email" :id="`email_${guestNo}`" :name="`email_${guestNo}`" placeholder="Email" required/>
        <input class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="email" :id="`confirm_email_${guestNo}`" :name="`confirm_email_${guestNo}`" placeholder="Confirm Email" required/>
      </div>
      <textarea class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-xl bg-white w-full px-4 pt-3 uppercase md:w-1/2" :id="`dietary_requirements_${guestNo}`" :name="`dietary_requirements_${guestNo}`" placeholder="Dietary Requirements"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GuestFieldError } from '@lib/types';

defineProps<{
  guestNo: number, 
  errors: GuestFieldError
}>();
</script>
