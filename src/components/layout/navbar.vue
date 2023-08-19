<template>
  <header class="flex justify-center w-full py-2 px-4 lg:py-4 lg:px-6 bg-primary-700 border-b border-neutral-200">
    <div class="flex flex-wrap lg:flex-nowrap items-center flex-row justify-start h-full max-w-[1536px] w-full">
      <!-- Logo -->
      <a
        href="/"
        class="inline-block mr-4 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm shrink-0"
      >
        <picture>
          <source srcset="/logo.svg" media="(min-width: 768px)" />
          <img
            src="/icon.svg"
            alt="logo"
            class="w-8 h-8 md:h-6 md:w-[176px] lg:w-[10rem] lg:h-[1.75rem]"
          />
        </picture>
      </a>
      <SfButton
        aria-label="Open categories"
        class="text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 lg:hidden order-first lg:order-1 mr-4"
        square
        variant="tertiary"
      >
        <SfIconMenu />
      </SfButton>
      <!-- Right Menu -->
      <nav class="flex-1 flex justify-end lg:order-last lg:ml-4">
        <div class="flex flex-row flex-nowrap">
          <!-- site menu -->
          <SfButton
          class="hidden lg:flex text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 lg:mr-4"
          type="button"
          variant="tertiary"
          tag="router-link" to="/about"
          active-class="bg-primary-900"
          >
            <span class="hidden lg:flex whitespace-nowrap">About</span>
          </SfButton>

          <SfButton
          class="hidden lg:flex text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 lg:mr-4"
          type="button"
          variant="tertiary"
          tag="router-link" to="/services"
          active-class="bg-primary-900"
          >
            <span class="hidden lg:flex whitespace-nowrap">Services</span>
          </SfButton>
          
          <SfButton
          class="hidden lg:flex text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 lg:mr-4"
          type="button"
          variant="tertiary"
          tag="router-link" to="/info"
          active-class="bg-primary-900"
          >
            <span class="hidden lg:flex whitespace-nowrap">Info</span>
          </SfButton>
          <SfButton
          class="hidden lg:flex text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 lg:mr-4"
          type="button"
          variant="tertiary"
          tag="router-link" to="/contact"
          active-class="bg-primary-900"
          >
            <span class="hidden lg:flex whitespace-nowrap">Contact</span>
          </SfButton>

          <!-- Small Button-->
          <a href="https://twitter.com/Crysta1221" target="_blank">
          <SfButton 
            type="button"
            square 
            variant="tertiary"
            class="text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-2 -ml-0.5 rounded-md"
          >
            <Icon icon="mdi:twitter" color="white" width="26" height="26"/>
          </SfButton>
          </a>
          <a href="https://github.com/Crysta1221" target="_blank">
          <SfButton 
            type="button"
            square 
            variant="tertiary"
            class="text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-2 -ml-0.5 rounded-md"
          >
            <Icon icon="mdi:github" color="white" width="26" height="26"/>
          </SfButton>
          </a>
        </div>
      </nav>
    </div>
  </header>
</template>

  
<script lang="ts" setup>
import { ref } from 'vue';
import {
  SfButton,
  SfIconMenu,
  } from '@storefront-ui/vue';

import { Icon } from '@iconify/vue';  
const inputValue = ref('');

</script>

  