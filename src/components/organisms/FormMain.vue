<template>
  <header class="h-1/2 flex items-end justify-center pb-8 px-8 md:px-12">
    <h1 class="font-serif uppercase text-[3.9rem] md:text-[6rem] lg:text-[7.5rem] text-pink text-center tracking-tighter leading-[0.8] w-full">
      Hattie & George Are Tying The Knot On 22.06.24.
    </h1>
  </header>
  <main class="h-1/2 flex items-start justify-center flex-wrap gap-28 pt-8 px-8 md:px-12">
    <AppButton>
      Okay
    </AppButton>
    <AppButton>
      Finally, it's about time he asked
    </AppButton>
  </main>
</template>

<script setup lang="ts">
import AppButton from '../atoms/AppButton.vue'
</script>
