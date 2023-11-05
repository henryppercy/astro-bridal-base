<template>
  <div class="space-y-5">
    <div class="flex flex-col md:flex-row gap-5 bg-white-light p-6 rounded-xl">
      <div class="space-y-7 md:w-1/2">
        <div class="relative">
          <input @input="removeFieldError('first_name')" @focus="removeHighlightOnFocus('first_name')" @blur="e => highlightCompletedField(e, 'first_name')" :class="{ 'bg-pink text-white': completedFields.first_name }" class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="text" :id="`first_name_${guestNo}`" :name="`first_name_${guestNo}`" placeholder="First name" required />
          <p class="text-rose-600 text-xs pl-2 mt-1 absolute">{{errors.first_name}}</p>
        </div>
        <div class="relative">
          <input @input="removeFieldError('last_name')" @focus="removeHighlightOnFocus('last_name')" @blur="e => highlightCompletedField(e, 'last_name')" :class="{ 'bg-pink text-white': completedFields.last_name }" class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="text" :id="`last_name_${guestNo}`" :name="`last_name_${guestNo}`" placeholder="Second name" required />
          <p class="text-rose-600 text-xs pl-2 mt-1 absolute" >{{errors.last_name}}</p>
        </div>
        <div class="relative"> 
          <input @input="removeFieldError('email')" @focus="removeHighlightOnFocus('email')" @blur="e => highlightCompletedField(e, 'email')" :class="{ 'bg-pink text-white': completedFields.email }" class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="email" :id="`email_${guestNo}`" :name="`email_${guestNo}`" placeholder="Email" required/>
          <p class="text-rose-600 text-xs pl-2 mt-1 absolute">{{errors.email}}</p>
        </div>
        <div class="relative"> 
          <input @input="removeFieldError('confirm_email')" @focus="removeHighlightOnFocus('confirm_email')" @blur="e => highlightCompletedField(e, 'confirm_email')" :class="{ 'bg-pink text-white': completedFields.confirm_email }" class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="email" :id="`confirm_email_${guestNo}`" :name="`confirm_email_${guestNo}`" placeholder="Confirm Email" required/>
          <p class="text-rose-600 text-xs pl-2 mt-1 absolute">{{errors.confirm_email}}</p>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <textarea @input="removeFieldError('dietary_requirements')" @focus="removeHighlightOnFocus('dietary_requirements')" @blur="e => highlightCompletedField(e, 'dietary_requirements')" :class="{ 'bg-pink text-white': completedFields.dietary_requirements }" class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-xl bg-white !w-full px-4 pt-3 uppercase md:w-1/2 h-full" :id="`dietary_requirements_${guestNo}`" :name="`dietary_requirements_${guestNo}`" placeholder="Dietary Requirements"></textarea>
        <p class="text-rose-600 text-xs pl-2 mt-1 absolute">{{errors.dietary_requirements}}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Guest } from '@lib/types';
import { defineProps, ref } from 'vue';

const props = defineProps<{
  guestNo: number, 
  errors: Guest
}>();

type completedFields = {
  first_name: boolean,
  last_name: boolean,
  email: boolean,
  confirm_email: boolean,
  dietary_requirements: boolean
}

const completedFields = ref<completedFields>({
  first_name: false,
  last_name: false,
  email: false,
  confirm_email: false,
  dietary_requirements: false
});

const highlightCompletedField = (e: Event, field: keyof completedFields) => {
  const target = e.target as HTMLInputElement;

  if (target.value.length > 0) {
    completedFields.value[field] = true;
  } else {
    completedFields.value[field] = false;
  }
}

const removeHighlightOnFocus = (field: keyof completedFields) => {  
  completedFields.value[field] = false;
}

const removeFieldError = (field: keyof completedFields) => {
  props.errors[field] = '';
}
</script>
