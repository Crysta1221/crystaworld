<template>
    <div class="text-center mt-36">
      <navbar/>   
      <img src="/404.svg" alt="404" class="header__logo mx-auto" width="450" height="450">
      <p class="text-3xl font-bold mb-4">404 Not Found</p>
      <p>申し訳ございませんがお探しのページは見つかりませんでした。</p>
      <SfButton
        type="button"
        variant="primary"
        tag="router-link" to="/"
        class="mt-8 mb-12"
      >
        ホームに戻る
      </SfButton>
      <basefooter/>
    </div>
    
  </template>
  
  <script setup>
  import {
    SfButton,
    SfIconMenu,
  } from '@storefront-ui/vue';
  </script>
  
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