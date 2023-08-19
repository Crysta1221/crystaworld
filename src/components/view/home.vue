<script setup>
import { SfButton, SfIconPackage, SfIconWarehouse, SfIconPublishedWithChanges } from '@storefront-ui/vue';

const cardDetails = [
  {
    icon: SfIconPackage,
    title: 'Free shipping',
    description: 'Learn about our commitments to ethics, our team, our communities and more.',
    buttonText: 'Read more',
    isDisabled: false,
  },
  {
    icon: SfIconWarehouse,
    title: 'Click & Collect',
    description: 'Learn about our commitments to ethics, our team, our communities and more.',
    buttonText: 'Read more',
    isDisabled: false,
  },
  {
    icon: SfIconPublishedWithChanges,
    title: 'Free 30-Day returns',
    description: 'Learn about our commitments to ethics, our team, our communities and more.',
    buttonText: 'Read more',
    isDisabled: true,
  },
];
</script>

<template>
  <navbar />
  <div class="relative min-h-[600px]">
    <picture>
      <source srcset="/background.svg" media="(min-width: 768px)" />
      <img
        src="/background.svg"
        class="absolute w-full h-full z-[-1] object-cover"
      />
    </picture>
    <div class="md:flex md:flex-row-reverse md:justify-center max-w[1536px] mx-auto md:min-h-[600px]">
      <div class="flex flex-col md:basis-2/4 md:items-stretch md:overflow-hidden">
        <img
          src="/hero.svg"
          class="h-full sm:h-[80%] md:h-[75%] object-cover object-left opacity-0 animate-fade-in"
          alt="hero image"
        />
      </div>
      <div class="p-4 md:p-10 md:max-w-[768px] md:flex md:flex-col md:justify-center md:items-start md:basis-2/4">
        <h1 class="typography-display-2 md:typography-display-1 md:leading-[67.5px] font-bold mt-2 mb-4">
          Crysta World
        </h1>
        <p class="typography-text-base md:typography-text-lg head-3">
          ゲームに役立つサービスを作成・提供するグループです
        </p>
        <div class="flex flex-col md:flex-row gap-4 mt-6">
          <SfButton size="lg"> グループ概要 </SfButton>
          <SfButton size="lg" variant="secondary" class="bg-white"> サービス一覧 </SfButton>
        </div>
      </div>
    </div>
  </div>
  <!-- Second Section -->
  <div>
    
  </div>
  <!-- Footer Section -->
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