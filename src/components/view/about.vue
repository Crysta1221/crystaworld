<script setup>
import { SfButton } from '@storefront-ui/vue';
</script>

<template>
    <navbar />
    <basefooter />
  </template>

<script>
import navbar from "@/components/layout/navbar.vue";
import basefooter from "@/components/layout/basefooter.vue";

export default {
  components: {
    navbar,
    basefooter,
  }
}
</script>

<style scoped>
h1{
    font-size:32px;
}
h2{
    font-size:24px;
}
.head-3{
  font-size:18px;
}

.animate-fade-in {
  animation: fade-in 1s ease-in-out forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateX(0);
  }
  to {
    opacity: 1;
    transform: translateX(-50px);
  }
}
</style>