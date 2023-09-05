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
    <div class="flex justify-center">
      <section class="">
        <div class="container max-w-5xl px-4 py-12 mx-auto">
          <div class="grid gap-4 mx-4 sm:grid-cols-12">
            <div class="col-span-12 sm:col-span-3">
              <div class="text-center sm:text-left mb-14 before:block before:w-24 before:h-3 before:mb-5 before:rounded-md before:mx-auto sm:before:mx-0 before:dark:bg-emerald-400">
                <h3 class="text-3xl font-semibold">Experience</h3>
                <span class="text-sm font-bold tracking-wider uppercase dark:text-gray-400">2018-2023</span>
              </div>
            </div>
            <div class="relative col-span-12 px-4 space-y-6 sm:col-span-9">
              <div class="col-span-12 space-y-12 relative px-4 sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:w-0.5 sm:before:-left-3 before:dark:bg-gray-700">
                <div class="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-emerald-400">
                  <h3 class="text-xl font-semibold tracking-wide">CrystaWorld 誕生</h3>
                  <time class="text-xs tracking-wide uppercase dark:text-gray-400">Oct 2018</time>
                  <p class="mt-3">当初はWindows向けのツール配布のために作成されました。</p>
                </div>
                <div class="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-emerald-400">
                  <h3 class="text-xl font-semibold tracking-wide">フロントエンド開発移行</h3>
                  <time class="text-xs tracking-wide uppercase dark:text-gray-400">Mar 2019</time>
                  <p class="mt-3">プログラミング言語が古く新しいOSに対応できなくなったためWeb開発に移行しました。</p>
                </div>
                <div class="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-emerald-400">
                  <h3 class="text-xl font-semibold tracking-wide">Crysta Worldのブログをリリース</h3>
                  <time class="text-xs tracking-wide uppercase dark:text-gray-400">Sep 2022</time>
                  <p class="mt-3">hugoによる静的サイトジェネレータを用いてブログをリリースしました。<br><a style="text-decoration:underline;" href="https://crysta1221.github.io" target="_blank">https://crysta1221.github.io</a></p>
                </div>
                <div class="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-emerald-400">
                  <h3 class="text-xl font-semibold tracking-wide">Crysta Worldのウェブサイトをリリース</h3>
                  <time class="text-xs tracking-wide uppercase dark:text-gray-400">Sep 2023</time>
                  <p class="mt-3">今までGoogle Siteで構築していたウェブサイトをVue3+Vite+Tailwind CSSで再構築しました。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>         
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