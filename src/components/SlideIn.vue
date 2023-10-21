<template>
  <TransitionGroup
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
    enter-active-class="transition-all ease-[cubic-bezier(0.3, 0, 0, 1)] duration-500"
    leave-active-class="transition-all ease-[cubic-bezier(1, 0, 0, 0.3)] duration-500"
  >
    <slot />
  </TransitionGroup>
</template>
