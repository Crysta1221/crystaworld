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
        <h1 class="typography-display-2 md:typography-display-1 md:leading-[67.5px] font-bold mt-2 mb-4">
            プライバシーポリシー
        </h1>
        <p class="typography-text-base md:typography-text-lg">
            2023年8月14日 最終更新
        </p>
      </div>
      </div>
    </div>
    <div class="prose max-w-none text-left ml-10 -mt-96 md:-mt-20 lg:-mt-24 mr-10">
      <Privacy/>
    </div>
    <basefooter />
  </template>

<script>
import navbar from "@/components/layout/navbar.vue";
import basefooter from "@/components/layout/basefooter.vue";
import Privacy from "../../markdown/privacy.md";
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