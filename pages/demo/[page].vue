<script setup lang="ts">
import type { RealtimeChannel } from "@supabase/supabase-js";

definePageMeta({
  layout: "meta",
});

const supabase = useSupabaseClient();
const { params } = useRoute();
const pageId = Number(params.page);

let realtimeChannel: RealtimeChannel;

const { data: page, refresh: refreshPage } = await useAsyncData(
  "page",
  async () => {
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("id", pageId)
      .single();
    return data;
  }
);

onMounted(() => {
  // Real time listener for new workouts
  realtimeChannel = supabase
    .channel("public:page")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "pages" },
      () => refreshPage()
    );

  realtimeChannel.subscribe();
});

onUnmounted(() => {
  supabase.removeChannel(realtimeChannel);
});
</script>

<template>
  <main class="p-8">
    <p class="font-bold">Page ID: {{ page.id }}</p>
    <ul class="mb-2">
      <li>Slug: {{ page.slug }}</li>
      <li>Title: {{ page.title }}</li>
      <li>Description: {{ page.description }}</li>
    </ul>
    <img
      class="mb-8"
      v-if="page.image"
      width="300"
      :src="`https://res.cloudinary.com/dwfcofnrd/image/fetch/f_auto,q_auto,g_auto:subject,ar_16:9,w_500,c_fill/https://qudljltfyoctkydecbon.supabase.co/storage/v1/object/public/content_images/${page.image}`"
    />

    <div v-for="comp in page.components" :key="comp.id" class="ml-8 mb-8">
      <p class="font-bold">Component: {{ comp.title }}</p>
      <ul class="mb-4">
        <li>id: {{ comp.id }}</li>
        <li>API ID: {{ comp.api_id }}</li>
      </ul>
      <div
        v-for="field in comp.fields"
        :key="field.id"
        class="bg-slate-500 p-8"
      >
        <h1 v-if="field.content" class="text-3xl font-bold text-slate-100">
          {{ field.content }}
        </h1>
      </div>
    </div>
  </main>
</template>
