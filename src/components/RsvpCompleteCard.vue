<template>
  <div class="bg-pink rounded-xl px-10 py-5 flex justify-between">
    <div>
      <h2 class="uppercase text-white tracking-widest text-lg">{{ guest.first_name }} {{ guest.last_name }}</h2>
      <p class="uppercase text-white tracking-widest text-lg">{{  guest.email }}</p>
      <p class="uppercase text-white tracking-widest text-lg">{{ guest.dietary_requirements ? guest.dietary_requirements : 'No Dietary Requirements' }}</p>
    </div>
    <div class="space-x-4">
      <button v-if="!onlyGuest" @click.prevent="deleteGuest" class="rounded-full bg-white text-pink px-5 py-1 uppercase tracking-[0.1rem] hover:text-white hover:bg-pink hover:ring-2 hover:ring-white">Delete</button>
      <button @click.prevent="editGuest" class="rounded-full bg-white text-pink px-5 py-1 uppercase tracking-[0.1rem] hover:text-white hover:bg-pink hover:ring-2 hover:ring-white">Edit</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Guest } from '@lib/types';

const props = defineProps<{
  guest: Guest,
  guestNo: number,
  onlyGuest: boolean
}>();

const emit = defineEmits(['deleteGuest', 'editGuest']);

const deleteGuest = () => {
  emit('deleteGuest', props.guestNo);
}

const editGuest = () => {
  emit('editGuest', props.guestNo);
}
</script>
