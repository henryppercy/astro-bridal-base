<template>
  <form @submit.prevent="submitForm" class="flex flex-col md:flex-row gap-5">
    <div class="space-y-7">
      <div class="flex flex-col md:flex-row gap-5">
        <div class="space-y-5 md:w-1/2">
          <input class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="text" id="first_name_1" name="first_name" placeholder="First name" required />
          <input class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="text" id="last_name_1" name="last_name" placeholder="Second name" required />
          <input class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="email" id="email_1" name="email" placeholder="Email" required/>
          <input class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-full bg-white w-full h-10 px-4 uppercase" type="email" id="confirm_email_1" name="confirm_email" placeholder="Confirm Email" required/>
        </div>
        <textarea class="placeholder-white-light border-white-light focus:outline-none focus:border-black border-[0.25rem] rounded-xl bg-white w-full px-4 pt-3 uppercase md:w-1/2" type="text" id="dietary_requirements" placeholder="Dietary Requirements" name="dietary_requirements"></textarea>
      </div>
    </div>

    <div class="flex justify-center">
      <button class="font-sans uppercase text-sm md:text-xl tracking-[0.1rem] md:tracking-[0.3rem] border-[0.25rem] border-black hover:bg-black hover:text-white transition-colors rounded-full px-5 py-1 h-fit whitespace-nowrap" type="submit">Submit</button>
    </div>
  </form>
</template>

<script setup lang="ts">
const submitForm = async (e: Event) => {
  const formData = new FormData(e.currentTarget as HTMLFormElement);

  try {
    const response = await fetch('/api/guests', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('Error submitting form:', data);
    } else {
      console.log('Successfully submitted');
    }
  } catch (error) {
    console.error('There was an error:', error);
  }
};
</script>
