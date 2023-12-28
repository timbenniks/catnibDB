<script setup lang="ts">
const props = defineProps(["bucket"]);
const imageModalOpen = ref(false);
const emit = defineEmits(["addNewImage"]);

const { assets, refresh } = await useAssets(props.bucket);

function addNew(image: string) {
  refresh();
  imageModalOpen.value = false;
  emit("addNewImage", image);
}
</script>

<template>
  <UButton
    icon="i-heroicons-plus"
    size="sm"
    color="primary"
    variant="soft"
    label="Add Image"
    :trailing="false"
    class="mt-4"
    @click="imageModalOpen = true"
  />
  <USlideover v-model="imageModalOpen" :ui="{ width: 'w-screen max-w-3xl' }">
    <UCard
      :ui="{
        rounded: 'rounded-none',
        body: { base: 'flex-1' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        shadow: 'shadow-none',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6">Media manager</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="imageModalOpen = false"
          />
        </div>
      </template>

      <h3 class="text-base mb-4">Upload Image</h3>
      <new-image @newImage="addNew" :location="bucket" />

      <UDivider label="OR" class="my-4" />

      <h3 class="text-base mb-4">Select Image</h3>

      <div class="grid grid-cols-3 gap-4">
        <UCard
          v-for="asset in assets"
          :key="asset.id"
          @click="addNew(asset.name)"
          class="cursor-pointer"
        >
          <NuxtImg
            v-if="asset.url"
            provider="cloudinary"
            :src="asset.url"
            width="300"
            height="169"
            fit="fill"
            :modifiers="{ gravity: 'subject' }"
            class="rounded-lg"
            loading="lazy"
          />
          <template #footer>
            <div class="flex justify-between space-x-2">
              <ul>
                <li class="line-clamp-1 text-xs font-bold">
                  {{ asset.name }}
                </li>
                <li class="text-xs">
                  {{ asset.mimetype }} &mdash; {{ asset.size }}
                </li>
              </ul>
            </div>
          </template>
        </UCard>
      </div>
    </UCard>
  </USlideover>
</template>
