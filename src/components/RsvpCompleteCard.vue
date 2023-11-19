<template>
  <div class="bg-pink rounded-3xl py-4 px-6 md:px-10 md:py-5 flex flex-col md:flex-row justify-between max-md:gap-4">
    <div v-if="!requestPending" >
      <h2 class="uppercase text-white tracking-widest md:text-lg">{{ guest.first_name }} {{ guest.last_name }}</h2>
      <p class="uppercase text-white tracking-widest md:text-lg">{{  guest.email }}</p>
      <p class="uppercase text-white tracking-widest md:text-lg">{{ guest.dietary_requirements ? guest.dietary_requirements : 'No Dietary Requirements' }}</p>
    </div>
    <div v-if="!requestPending" class="flex gap-4 md:h-10">
      <button v-if="!onlyGuest" type="button" @click.prevent="deleteGuest" class="rounded-full bg-white text-pink px-5 py-1 uppercase tracking-[0.1rem] hover:text-white hover:bg-pink hover:ring-2 hover:ring-white w-1/2 md:w-fit">Delete</button>
      <button @click.prevent="editGuest" type="button" class="rounded-full bg-white text-pink px-5 py-1 uppercase tracking-[0.1rem] hover:text-white hover:bg-pink hover:ring-2 hover:ring-white w-1/2 md:w-fit">Edit</button>
    </div>
    <div v-if="requestPending" class="animate-pulse space-y-3 w-full">
      <div class="bg-white/70 h-5 rounded-xl w-full"></div>
      <div class="bg-white/70 h-5 rounded-xl w-full"></div>
      <div class="bg-white/70 h-5 rounded-xl w-full"></div>
    </div>
    <div v-if="requestPending" class="animate-pulse w-full md:flex md:justify-end">
      <div class="bg-white/70 h-7 w-1/2 rounded-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Guest } from '@lib/types';

const props = defineProps<{
  guest: Guest,
  guestNo: number,
  onlyGuest: boolean,
  requestPending: boolean
}>();

const emit = defineEmits(['deleteGuest', 'editGuest']);

const deleteGuest = () => {
  emit('deleteGuest', props.guestNo);
}

const editGuest = () => {
  emit('editGuest', props.guestNo);
}
</script>
