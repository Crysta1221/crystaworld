<template>
    <footer class="">
      <div class="bg-neutral-900 justify-end px-4 py-10 md:flex md:py-6 max-w-[1536px] mx-auto">
        <div class="flex justify-center py-2 gap-x-4 md:self-start">
          <a href="https://twitter.com/Crysta1221" target="_blank">
            <SfButton
              class="text-white active:text-white hover:text-white hover:!bg-neutral-500 active:!bg-transparent"
              square
              type="button"
              variant="tertiary"
            >
              <Icon icon="mdi:twitter" color="white" width="26" height="26"/>
            </SfButton>
          </a>
          <a href="https://github.com/Crysta1221" target="_blank">
            <SfButton
              class="text-white active:text-white hover:text-white hover:!bg-neutral-500 active:!bg-transparent"
              square
              type="button"
              variant="tertiary"
            >
              <Icon icon="mdi:github" color="white" width="26" height="26"/>
            </SfButton>
          </a>   
        </div>
        <div class="flex items-center justify-center gap-6 py-2 my-4 md:ml-auto md:my-0">
        <SfLink
          v-for="{ label, link } in bottomLinks"
          :key="label"
          variant="secondary"
          class="text-white no-underline typography-text-sm active:text-white active:underline hover:text-white hover:underline"
          :href="link"
        >
          {{ label }}
        </SfLink>
        </div>
        <p
          class="flex items-center justify-center py-2 leading-5 text-center text-sm text-white/50 font-body md:ml-6"
        >
          ©CrystaWorld 2023
        </p>
      </div>
    </footer>
</template>

<script lang="ts" setup>
import {
    SfButton,
    SfLink,
    SfListItem,
} from '@storefront-ui/vue';
import { Icon } from '@iconify/vue';


const bottomLinks = [
  {
    label: 'Terms',
    link: '/terms',
  },
  {
    label: 'Privacy policy',
    link: '/policy',
  },
  {
    label: 'Donate',
    link: '/donate',
  },
];

</script>
  