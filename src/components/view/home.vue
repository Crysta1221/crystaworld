<script setup>
import { SfButton } from '@storefront-ui/vue';
import { Icon } from '@iconify/vue';
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
          あったらをカタチに。
        </h1>
        <p class="typography-text-base md:typography-text-lg head-3">
          ゲームに役立つサービスを作成・提供するグループです
        </p>
        <div class="flex flex-col md:flex-row gap-4 mt-6">
          <SfButton size="lg" tag="router-link" to="about"> グループ概要 </SfButton>
          <SfButton size="lg" variant="secondary" class="bg-white" tag="router-link" to="services"> サービス一覧 </SfButton>
        </div>
      </div>
    </div>
  </div>
  <!-- Second Section -->
  <div class="mt-10 mb-10 flex justify-center">
    <h1>提供サービス</h1>
  </div>
  <div class="mt-12 mb-14 flex flex-wrap gap-4 lg:gap-6 lg:flex-nowrap justify-center">
    <!-- Section 1 -->
    <div class="flex flex-col w-full max-w-[325px] sm:w-[375px] lg:w-[496px] items-center">
    <div class="w-24 h-24 rounded-full border-2 shadow-md flex items-center justify-center">
      <Icon size="2xl" icon="mdi:minecraft" color="#1cdb24" width="36" height="36" :class="{ 'text-disabled-900': false }" />
    </div>
      <div class="p-4 flex flex-col items-center">
        <p :class="['font-medium typography-text-base', { 'text-disabled-900': false }]">Minecraft開発</p>
        <p
          :class="[
            'mt-1 mb-4 font-normal typography-text-sm text-neutral-700 text-center',
            { 'text-disabled-700': false },
          ]"
        >
          データパックやコマンド、小規模なプラグイン開発
        </p>
        <SfButton size="sm" variant="secondary" :disabled="false" class="mt-auto" @click="McSec">Learn More</SfButton>
      </div>
    </div>
    <!-- Section 2 -->
    <div class="flex flex-col w-full max-w-[325px] sm:w-[375px] lg:w-[496px] items-center">
    <div class="w-24 h-24 rounded-full border-2 shadow-md flex items-center justify-center">
      <Icon size="2xl" icon="logos:discord-icon" width="36" height="36" :class="{ 'text-disabled-900': false }" />
    </div>
      <div class="p-4 flex flex-col items-center">
        <p :class="['font-medium typography-text-base', { 'text-disabled-900': false }]">Bot開発</p>
        <p
          :class="[
            'mt-1 mb-4 font-normal typography-text-sm text-neutral-700 text-center',
            { 'text-disabled-700': false },
          ]"
        >
          SNSサービス、Discord用のコミュニティ向けBotの開発
        </p>
        <SfButton size="sm" variant="secondary" :disabled="false" class="mt-auto" @click="BotSec">Learn More</SfButton>
      </div>
    </div>
    <!-- Section 3 -->
    <div class="flex flex-col w-full max-w-[325px] sm:w-[375px] lg:w-[496px] items-center">
    <div class="w-24 h-24 rounded-full border-2 shadow-md flex items-center justify-center">
      <Icon size="2xl" icon="logos:web-dev-icon" width="36" height="36" :class="{ 'text-disabled-900': false }" />
    </div>
      <div class="p-4 flex flex-col items-center">
        <p :class="['font-medium typography-text-base', { 'text-disabled-900': false }]">Webサイト制作</p>
        <p
          :class="[
            'mt-1 mb-4 font-normal typography-text-sm text-neutral-700 text-center',
            { 'text-disabled-700': false },
          ]"
        >
          小規模なビジネス・個人向けのWebサイト制作
        </p>
        <SfButton size="sm" variant="secondary" :disabled="false" class="mt-auto" @click="WebSec">Learn More</SfButton>
      </div>
    </div>
    <!-- Section 4 -->
    <div class="flex flex-col w-full max-w-[325px] sm:w-[375px] lg:w-[496px] items-center">
    <div class="w-24 h-24 rounded-full border-2 shadow-md flex items-center justify-center">
      <Icon size="2xl" icon="mdi:server" color="#0b5394" width="36" height="36" :class="{ 'text-disabled-900': false }" />
    </div>
      <div class="p-4 flex flex-col items-center">
        <p :class="['font-medium typography-text-base', { 'text-disabled-900': false }]">サーバー運用</p>
        <p
          :class="[
            'mt-1 mb-4 font-normal typography-text-sm text-neutral-700 text-center',
            { 'text-disabled-700': false },
          ]"
        >
          Minecraftなどのゲームサーバーの構築・運用
        </p>
        <SfButton size="sm" variant="secondary" :disabled="false" class="mt-auto" @click="SrvSec">Learn More</SfButton>
      </div>
    </div>
  </div>
  <!-- Minecraft Section -->
  <div id="minecraft-section" class="flex flex-col items-center justify-center bg-emerald-200 md:flex-row md:justify-center">
    <div class="w-full md:w-1/2">
      <img src="/mc_section.svg" alt="Minecraft Section" class="w-full h-auto">
    </div>
    <div class="w-full md:w-1/2 px-4 md:px-8">
      <h2 class="text-2xl font-bold mb-4">Minecraft Development</h2>
      <p class="text-lg text-neutral-700 mb-4">
        Minecraftでデータパックやコマンド、Skriptによる小規模なプラグインなどの開発をしています。<br>
        一部データパックや配布マップはGithub、ブログにて公開されています。<br>
        データパックの依頼も受け付けています。詳しくはContactページをご覧ください。
      </p>
      <SfButton size="md" variant="primary" :disabled="false" @click="redirectToExternalSite">ブログへ</SfButton>
    </div>
    <div class="h-8 md:hidden"></div>
  </div>
  <!-- Discord Section -->
  <div id="bot-section" class="flex flex-col items-center justify-center bg-blue-200 md:flex-row md:justify-center">
    <div class="w-full md:w-1/2">
      <img src="/discord_section.svg" alt="Web Section" class="w-full h-auto">
    </div>
    <div class="w-full md:w-1/2 px-4 md:px-8">
      <h2 class="text-2xl font-bold mb-4">Discord Bot Develop</h2>
      <p class="text-lg text-neutral-700 mb-4">
        SNSツール、Discordで使えるコミュニティ向けのBotを開発しています。<br>
        メンバーを管理したり、音楽を再生したり、ゲームのプロフィールを見たり...必要な機能を一つのBotに。<br>
        開発秘話はブログにて公開中! Botは現在誠意を込めて開発中です。
      </p>
      <SfButton size="md" variant="primary" :disabled="false" @click="redirectToExternalSite">ブログへ</SfButton>
    </div>
    <div class="h-8 md:hidden"></div>
  </div>
  <!-- WebPage Section -->
  <div id="web-section" class="flex flex-col items-center justify-center bg-orange-200 md:flex-row md:justify-center">
    <div class="w-full md:w-1/2">
      <img src="/web_section.svg" alt="Web Section" class="w-full h-auto">
    </div>
    <div class="w-full md:w-1/2 px-4 md:px-8">
      <h2 class="text-2xl font-bold mb-4">Website Development</h2>
      <p class="text-lg text-neutral-700 mb-4">
        Vue3 + Vite + Tailwind や通常の HTML + CSS + JavaScriptをはじめとするWebサイトやサービスの制作を行っています。<br>
        リリース済みのサービスなどはServicesページにてご覧いただけます。<br>
      </p>
      <SfButton size="md" variant="primary" :disabled="false" tag="router-link" to="product">サービス一覧</SfButton>
    </div>
    <div class="h-8 md:hidden"></div>
  </div>
  <!-- Server Section -->
  <div id="srv-section" class="flex flex-col items-center justify-center bg-violet-200 md:flex-row md:justify-center">
    <div class="w-full md:w-1/2">
      <img src="/server_section.svg" alt="Web Section" class="w-full h-auto">
    </div>
    <div class="w-full md:w-1/2 px-4 md:px-8">
      <h2 class="text-2xl font-bold mb-4">Server Management</h2>
      <p class="text-lg text-neutral-700 mb-4">
        Minecraftのサーバーホストを行っています。プラグインサーバーやMODサーバーなど様々なサーバーの提供が可能です。<br>
        サーバーの構築を自動で行うツールも現在開発しています。(ブログにて進捗を公開予定!)
      </p>
      <SfButton size="md" variant="primary" :disabled="false" @click="redirectToExternalSite">ブログへ</SfButton>
    </div>
    <div class="h-8 md:hidden"></div>
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
  },
  methods: {
    redirectToExternalSite() {
      window.open('https://crysta1221.github.io', '_blank');
    },
    McSec(){
      const minecraftSection = document.getElementById('minecraft-section');
      minecraftSection.scrollIntoView({ behavior: 'smooth' });
    },
    BotSec(){
      const minecraftSection = document.getElementById('bot-section');
      minecraftSection.scrollIntoView({ behavior: 'smooth' });
    },
    WebSec(){
      const minecraftSection = document.getElementById('web-section');
      minecraftSection.scrollIntoView({ behavior: 'smooth' });
    },
    SrvSec(){
      const minecraftSection = document.getElementById('srv-section');
      minecraftSection.scrollIntoView({ behavior: 'smooth' });
    },
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