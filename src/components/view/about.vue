<script setup>
import { SfButton } from '@storefront-ui/vue';
</script>

<template>
  <navbar />
  <div class="relative min-h-[600px]">
    <div class="mt-12 p-4 flex justify-center font-bold bg-orange-100 mb-12">
      <div class="py-16">  
        <div class="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
            <div class="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
              <div class="md:5/12 lg:w-5/12">
                <img src="/about.png" alt="image" loading="lazy" width="" height="">
              </div>
              <div class="md:7/12 lg:w-6/12">
                <h1 class="text-2xl text-gray-900 font-bold md:text-4xl">About CrystaWorld</h1>
                <p class="mt-6 text-gray-600 text-base">
                  CrystaWorldは、クリスタが運営するWebサイトです。<br>
                  主にフロントエンドによるWebサイト開発、バックエンドによるWebアプリケーション開発、サーバーの保守、Botの作成などを行っています。<br>
                </p>
              </div>
            </div>
        </div>
      </div>
    </div>
    <div class="mt-12 md:mt-0 flex justify-center font-bold">
      <h1>I work on...</h1>
    </div>
    <div class="mt-12 mb-14 flex flex-wrap gap-4 lg:gap-6 lg:flex-nowrap justify-center">
    <!-- Section 1 -->
    <div class="flex flex-col w-full max-w-[325px] sm:w-[375px] lg:w-[496px] items-center">
    <div class="w-24 h-24 rounded-full border-2 shadow-md flex items-center justify-center">
      <Icon size="2xl" icon="tabler:app-window-filled" color="#3d85c6" width="36" height="36" :class="{ 'text-disabled-900': false }" />
    </div>
      <div class="p-4 flex flex-col items-center">
        <h3 :class="['font-medium typography-text-base', { 'text-disabled-900': false }]">FrontEnd</h3>
        <p
          :class="[
            'mt-1 mb-4 font-normal typography-text-sm text-neutral-700 text-center',
            { 'text-disabled-700': false },
          ]"
        >
          <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-blue-400">Tailwind</span>
          <span class="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-purple-400">BootStrap</span>
          <span class="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-yellow-400">JavaScript</span>
          <span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-green-400">Vue.js</span>
          <div class="mt-2 text-center">
            主にVue3+Viteを使用してWebサイトやWenアプリケーションの開発を行っています。
          </div>        
        </p>
      </div>
    </div>
    <!-- Section 2 -->
    <div class="flex flex-col w-full max-w-[325px] sm:w-[375px] lg:w-[496px] items-center">
    <div class="w-24 h-24 rounded-full border-2 shadow-md flex items-center justify-center">
      <Icon size="2xl" icon="tabler:cloud-code" color="#3d85c6" width="36" height="36" :class="{ 'text-disabled-900': false }" />
    </div>
      <div class="p-4 flex flex-col items-center">
        <h3 :class="['font-medium typography-text-base', { 'text-disabled-900': false }]">BackEnd</h3>
        <p
          :class="[
            'mt-1 mb-4 font-normal typography-text-sm text-neutral-700 text-center',
            { 'text-disabled-700': false },
          ]"
        >
          <span class="bg-violet-100 text-violet-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-violet-400">Python</span>
          <span class="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-red-400">Java</span>
          <span class="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-yellow-400">JavaScript</span>
          <span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-green-400">Node.js</span>
          <div class="mt-2 text-center">
            Node.jsによるバックエンド開発が多いです。Java、Pythonは勉強中...
          </div> 
        </p>
      </div>
    </div>
    <!-- Section 3 -->
    <div class="flex flex-col w-full max-w-[325px] sm:w-[375px] lg:w-[496px] items-center">
    <div class="w-24 h-24 rounded-full border-2 shadow-md flex items-center justify-center">
      <Icon size="2xl" icon="tabler:server-2" color="#3d85c6" width="36" height="36" :class="{ 'text-disabled-900': false }" />
    </div>
      <div class="p-4 flex flex-col items-center">
        <h3 :class="['font-medium typography-text-base', { 'text-disabled-900': false }]">Server Management</h3>
        <p
          :class="[
            'mt-1 mb-4 font-normal typography-text-sm text-neutral-700 text-center',
            { 'text-disabled-700': false },
          ]"
        >
          <span class="bg-orange-100 text-orange-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-orange-400">Ubuntu</span>
          <span class="bg-sky-100 text-sky-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-sky-400">Docker</span>
          <span class="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-indigo-400">MySQL</span>
          <div class="mt-2 text-center">
            一般的なゲームサーバーの構築や保守をしたりしています。
          </div> 
        </p>
      </div>
    </div>
    </div>
  </div>
  <basefooter />
  </template>

<script>
import navbar from "@/components/layout/navbar.vue";
import basefooter from "@/components/layout/basefooter.vue";
import { Icon } from '@iconify/vue';

export default {
  components: {
    navbar,
    basefooter,
    Icon,
  }
}
</script>

<style scoped>
h1{
    font-size:30px;
}
h2{
    font-size:24px;
}
h3{
    font-size:20px;
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