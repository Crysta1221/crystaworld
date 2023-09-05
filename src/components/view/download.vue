<template>
  <navbar/>
  <div class="relative min-h-[600px]">
    <div class="mt-12 p-4 flex justify-center font-bold bg-teal-100 mb-12">
      <div class="py-16">  
        <div class="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
            <div class="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
              <div class="md:5/12 lg:w-5/12">
                <img src="/download.svg" alt="image" loading="lazy" width="380" height="350">
              </div>
              <div class="md:7/12 lg:w-6/12">
                <h1 class="text-2xl text-gray-900 font-bold md:text-4xl">Download</h1>
                <h3 class="mt-6 text-gray-600 text-base">
                  配布しているアプリケーション、データファイルなどをダウンロードできます。<br>
                </h3>
              </div>
            </div>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <div class="container mx-auto my-8 space-y-10">
      <div class="max-w-4xl mx-auto px-10 py-4 bg-white rounded-lg shadow-lg">
        <div class="flex flex-col justify-center py-12 items-center">

          <div class="flex justify-center items-center">
            <img class="w-64 h-64"
              src="/empty.svg"
              alt="image empty states">
          </div>
          <h1 class="text-gray-700 font-medium text-2xl text-center mb-3">ダウンロード可能なファイルがありません</h1>
          <p class="text-gray-500 text-center mb-6">新しいファイルが追加された場合はこちらに表示されます。</p>
        </div>
      </div>
      </div>
    </div>
  </div>
  <basefooter/>
</template>

<script>
import navbar from "@/components/layout/navbar.vue";
import basefooter from "@/components/layout/basefooter.vue";

export default {
components: {
  navbar,
  basefooter
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
  font-size:18px;
}
</style>
