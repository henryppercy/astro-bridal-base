<template>
  <table class="w-full text-sm text-left text-stone-50 table-auto">
    <caption class="p-5 text-lg font-semibold text-left bg-stone-800">
      <h2 class="uppercase">Guest List</h2>
      <p class="mt-1 text-sm font-normal text-stone-400">
        Here's the roster of guests who've replied to the invitation so far.
      </p>
    </caption>
    <thead class="text-xs text-stone-100 uppercase bg-stone-700">
      <tr>
        <th scope="col" class="px-5 py-3">
          <span class="flex gap-x-2">Guest <button @click="toggleAZ"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path class="fill-stone-300" d="M3 18v-2h6v2H3Zm0-5v-2h12v2H3Zm0-5V6h18v2H3Z"/></svg></button></span>
        </th>
        <th scope="col" class="px-5 py-3">
          <span class="flex gap-x-2 whitespace-nowrap">RSVP Status <button @click="toggleRsvp"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path class="fill-stone-300" d="M3 18v-2h6v2H3Zm0-5v-2h12v2H3Zm0-5V6h18v2H3Z"/></svg></button></span>
        </th>
        <th scope="col" class="px-5 py-3">
          <span class="flex gap-x-2">Dietary Requirements <button @click="toggleDiet"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path class="fill-stone-300" d="M3 18v-2h6v2H3Zm0-5v-2h12v2H3Zm0-5V6h18v2H3Z"/></svg></button></span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(guest, index) in guestsRef" :key="index" class="bg-stone-700 border-t border-t-stone-50 hover:bg-stone-600">
        <th class="flex items-center px-5 py-4 text-stone-50 whitespace-nowrap">
          <div>
            <div class="text-base font-semibold">{{`${guest.first_name} ${guest.last_name}`}}</div>
            <div class="font-normal text-stone-400">{{guest.email}}</div>
          </div>  
        </th>
        <td class="px-5 py-4">
          <div class="flex items-center">
            <span v-if="guest.rsvp === 'yes'" class="flex items-center"><div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div><p class="whitespace-nowrap">{{ guest.first_name === 'Henry' ? 'So Rainbow Rhythms' : 'Attending' }}</p></span>
            <span v-if="guest.rsvp === 'no'" class="flex items-center"><div class="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div> <p>Declined</p></span>
          </div>
        </td>
        <td class="px-5 py-4">
          {{guest.dietary_requirements}}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Guest } from '@lib/types';

const props = defineProps<{
  guests: Guest[];
  guestsAZ: Guest[];
  guestsZA: Guest[];
  guestsAttending: Guest[];
  guestsNotAttending: Guest[];
  guestsRequirements: Guest[];
  guestsNoRequirements: Guest[];
}>();

const sortAZ = ref('az');
const sortRsvp = ref('yes');
const sortDiet = ref('requirements');

const guestsRef = ref(props.guests);

function toggleAZ() {
  if (sortAZ.value === 'az') {
    guestsRef.value = props.guestsZA;
    sortAZ.value = 'za';
  } else {
    guestsRef.value = props.guestsAZ;
    sortAZ.value = 'az';
  }
}

function toggleRsvp() {
  if (sortRsvp.value === 'yes') {
    guestsRef.value = props.guestsNotAttending;
    sortRsvp.value = 'no';
  } else {
    guestsRef.value = props.guestsAttending;
    sortRsvp.value = 'yes';
  }
}

function toggleDiet() {
  if (sortDiet.value === 'requirements') {
    guestsRef.value = props.guestsNoRequirements;
    sortDiet.value = 'noRequirements';
  } else {
    guestsRef.value = props.guestsRequirements;
    sortDiet.value = 'requirements';
  }
}
</script>
