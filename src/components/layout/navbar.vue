<template>
  <header class="fixed top-0 left-0 right-0 z-50 flex justify-center w-full py-2 px-4 lg:py-4 lg:px-6 bg-primary-700 border-b border-neutral-200">
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
        @click="open = true"
      >
        <SfIconMenu />
      </SfButton>
      <transition
        enter-active-class="transition duration-500 ease-in-out"
        leave-active-class="transition duration-500 ease-in-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
      <SfDrawer
        ref="drawerRef"
        v-model="open"
        :placement="placement"
        :class="[
          'bg-neutral-50',
          'border',
          'border-gray-300',
          { 'max-w-[370px]': placement === 'left' || placement === 'right' },
        ]"
      >
      <header class="flex items-center justify-between px-10 py-6 bg-primary-700">
        <div class="flex items-center text-white">Crysta World Menu</div>
        <SfButton square variant="tertiary" class="text-white ml-8" @click="open = false">
          <SfIconClose />
        </SfButton>
      </header>
      <div class="mt-4">
        <SfListItem class="border-b border-gray-300" size="lg" tag="router-link" to="/">
          <template #prefix><Icon icon="mdi:home" width="32" height="32" /></template>
          <span class="break-words ml-4">Home</span>
          <template #suffix><SfIconChevronRight /></template>
        </SfListItem>
        <SfListItem class="border-b border-gray-300" size="lg" tag="router-link" to="/product">
          <template #prefix><Icon icon="mdi:service-toolbox" width="32" height="32" /></template>
          <span class="break-words ml-4">Product</span>
          <template #suffix><SfIconChevronRight /></template>
        </SfListItem>
        <SfListItem class="border-b border-gray-300" size="lg" tag="router-link" to="/download">
          <template #prefix><Icon icon="mdi:download" width="32" height="32" /></template>
          <span class="break-words ml-4">Download</span>
          <template #suffix><SfIconChevronRight /></template>
        </SfListItem>
        <SfListItem class="border-b border-gray-300" size="lg" tag="router-link" to="/about">
          <template #prefix><Icon icon="mdi:account-group" width="32" height="32" /></template>
          <span class="break-words ml-4">About</span>
          <template #suffix><SfIconChevronRight /></template>
        </SfListItem>
        <SfListItem class="border-b border-gray-300" size="lg" tag="router-link" to="/contact">
          <template #prefix><Icon icon="mdi:account-box-outline" width="32" height="32" /></template>
          <span class="break-words ml-4">Contact</span>
          <template #suffix><SfIconChevronRight /></template>
        </SfListItem>
      </div>
      </SfDrawer>
    </transition>
      <!-- Right Menu -->
      <nav class="flex-1 flex justify-end lg:order-last lg:ml-4">
        <div class="flex flex-row flex-nowrap">
          <!-- site menu -->
          <SfButton
          class="hidden lg:flex text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 lg:mr-4"
          type="button"
          variant="tertiary"
          tag="router-link" to="/product"
          active-class="bg-primary-900"
          >
            <span class="hidden lg:flex whitespace-nowrap">Product</span>
          </SfButton>
          
          <SfButton
          class="hidden lg:flex text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 lg:mr-4"
          type="button"
          variant="tertiary"
          tag="router-link" to="/download"
          active-class="bg-primary-900"
          >
            <span class="hidden lg:flex whitespace-nowrap">Download</span>
          </SfButton>

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
  SfDrawer, 
  SfDrawerPlacement,
  useTrapFocus,
  SfIconClose,
  SfListItem,
  SfIconChevronRight
  } from '@storefront-ui/vue';

import { Icon } from '@iconify/vue';  
const inputValue = ref('');


const placement = ref<`${SfDrawerPlacement}`>('left');
const open = ref(false);
const drawerRef = ref();

useTrapFocus(drawerRef, { activeState: open });
</script>

  