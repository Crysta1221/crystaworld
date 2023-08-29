<script setup>
import { SfButton, SfInput, SfRadio, SfCheckbox, SfSelect, SfIconCheckCircle, SfIconClose } from '@storefront-ui/vue';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

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
    <div class="container mx-auto mb-24">
      <form @submit.prevent="request">
      <div class="mb-4">
        <label for="name" class="block font-bold mb-2">お名前 <font color="red">*</font></label>
        <input type="text" id="name" name="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-green-600 dark:placeholder-gray-400" required>
      </div>
      <div class="mb-4">
        <label for="email" class="block font-bold mb-2">メールアドレス <font color="red">*</font></label>
        <input type="email" id="email" name="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-green-600 dark:placeholder-gray-400" required>
      </div>
      <div class="mb-4">
        <fieldset role="radiogroup">
        <label for="donate" class="block font-bold mb-2">寄付方法 <font color="red">*</font></label> 
          <SfSelect id="donate" name="donate" required>
            <option value="Amazon ギフト券">Amazon ギフト券</option>
            <option value="Apple ギフトカード">Apple ギフトカード</option>
            <option value="WebMoney">WebMoney</option>
          </SfSelect>
        </fieldset>
      </div>
      <div class="mb-4">
        <label for="code" class="block font-bold mb-2">ギフトコード <font color="red">*</font></label>
        <input type="code" id="code" name="code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-green-600 dark:placeholder-gray-400" required>
      </div>
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">送信</button>
    </form>
    <div
    role="alert"
    class="mt-8 flex items-start md:items-center shadow-md bg-positive-100 pr-2 pl-4 ring-1 ring-positive-200 typography-text-sm md:typography-text-base py-1 rounded-md"
    v-if="sent"
    >
      <SfIconCheckCircle class="my-2 mr-2 text-positive-700 shrink-0" />
      <p class="py-2 mr-2">フォームは正しく送信されました! 数秒後にリダイレクトします...</p>
    </div>
    </div>
    <basefooter />
  </template>

<script>
import navbar from "@/components/layout/navbar.vue";
import basefooter from "@/components/layout/basefooter.vue";
import Donate from "../../markdown/donate.md";
import axios from "axios";

export default {
  data() {
    return {
      my_text: 'https://donorbox.org/crysta1221',
      copied: false,
      sent: false,
      fadeout: false,
    }
  },
  methods: {
    copyLink() {
      navigator.clipboard.writeText(this.my_text).then(() => {
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      }).catch((e) => {
        console.error(e)
      })
    },
    request: async function() {
      var name = "entry.1454020375" + "=" + document.getElementById("name").value;
      var mail = "entry.2038478853" + "=" + document.getElementById("email").value;
      var method = "entry.750705808" + "=" + document.getElementById("donate").value;
      var code = "entry.1506693516" + "=" + document.getElementById("code").value;
      
      var url = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSebVzQvkv_XYeIyHyNuzQeCsnNVHp6_2Y2OB1ykLTnxHZKSrg/formResponse?"+
      name + "&" + mail + "&" + method + "&" + code;

      if (name && mail && method && code) {
        axios.get(url);
        this.sent = true;
        setTimeout(() => {
          window.location.href = "/donate";
          this.sent = false;
        }, 5000);
      }
    }
  },
  components: {
    navbar,
    basefooter,
  },
}
</script>

<style scoped>
h1{
    font-size:32px;
}
h2{
    font-size:24px;
}

.fadeout {
  opacity: 0;
}
</style>