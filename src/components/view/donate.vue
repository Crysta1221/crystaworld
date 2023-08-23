<script setup>
import { SfButton } from '@storefront-ui/vue';
</script>

<template>
    <navbar />
    <div class="relative min-h-[600px] mt-12">
      <picture>
        <source srcset="/background.svg" media="(min-width: 768px)" style="@media (min-width:767px) {height: 80%;}"/>
        <img
          src="/background.svg"
          class="absolute w-full md:h-[80%] sm:h-[40%] z-[-1] md:object-cover"
        />
      </picture>
      <div class="md:flex md:flex-row-reverse md:justify-center max-w[1536px] mx-auto md:min-h-[600px]">
        <div class="flex flex-col md:basis-2/4 md:items-stretch md:overflow-hidden">
        </div>
        <div class="p-4 md:p-10 md:max-w-[768px] md:flex md:flex-col md:justify-center md:items-start md:basis-2/4">
        <h1 class="typography-display-2 md:typography-display-1 md:leading-[67.5px] font-bold mt-2 mb-4 p-8">
            寄付
        </h1>
      </div>
      </div>
    </div>
    <div class="prose max-w-none text-center ml-10 -mt-96 md:-mt-20 lg:-mt-24 mr-10">
      <Donate/>
    </div>
    <div class="text-center mb-4 flex justify-center">
      <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfnOqjgzpn10_cHPNL5ie1YnMRMbq9mmjeR2rIYnHAfn7IOcg/viewform?embedded=true" width="800" height="850" frameborder="0" marginheight="0" marginwidth="0">読み込んでいます…</iframe>
    </div>
    <basefooter />
  </template>

<script>
import navbar from "@/components/layout/navbar.vue";
import basefooter from "@/components/layout/basefooter.vue";
import Donate from "../../markdown/donate.md";
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
</style>