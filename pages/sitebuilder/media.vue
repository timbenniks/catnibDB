<script setup lang="ts">
const { assets: cat_images, refresh: catRefresh } = await useAssets(
  "cat_images"
);
const { assets: content_images, refresh: contentRefresh } = await useAssets(
  "content_images"
);
const imageModalContentOpen = ref(false);
const imageModalCatOpen = ref(false);

async function refreshList() {
  await catRefresh();
  await contentRefresh();
}

async function deleteImage(name: string, bucket: string) {
  const res = await useDeleteAsset(name, bucket);

  console.log(res);

  await refreshList();
}

async function addNewImage() {
  await refreshList();
  imageModalContentOpen.value = false;
  imageModalCatOpen.value = false;
}
</script>

<template>
  <UPage :ui="{ wrapper: 'max-w-full px-8' }">
    <UPageBody>
      <h1 class="text-5xl mb-8">Asset manager</h1>
      <div class="mb-12">
        <h2 class="text-xl font-bold mb-2">Cat Images</h2>

        <UButton
          icon="i-heroicons-plus"
          size="sm"
          color="primary"
          variant="soft"
          label="Add cat image"
          :trailing="false"
          class="mb-8"
          @click="imageModalCatOpen = true"
        />
        <UModal v-model="imageModalCatOpen">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3
                  class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                >
                  Add Image
                </h3>
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark-20-solid"
                  class="-my-1"
                  @click="imageModalCatOpen = false"
                />
              </div>
            </template>
            <new-image @newImage="addNewImage" location="cat_images" />
          </UCard>
        </UModal>
        <div
          class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4"
        >
          <UCard v-for="asset in cat_images" :key="asset.id">
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
                <UButton
                  icon="i-heroicons-x-mark"
                  size="xs"
                  color="primary"
                  variant="solid"
                  square
                  @click="deleteImage(asset.name, 'cat_images')"
                />
              </div>
            </template>
          </UCard>
        </div>
      </div>

      <div class="mb-12">
        <h2 class="text-xl mb-4 font-bold">Content Images</h2>
        <UButton
          icon="i-heroicons-plus"
          size="sm"
          color="primary"
          variant="soft"
          label="Add content image"
          :trailing="false"
          class="mb-8"
          @click="imageModalContentOpen = true"
        />
        <UModal v-model="imageModalContentOpen">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3
                  class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                >
                  Add Image
                </h3>
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark-20-solid"
                  class="-my-1"
                  @click="imageModalContentOpen = false"
                />
              </div>
            </template>
            <new-image @newImage="addNewImage" location="content_images" />
          </UCard>
        </UModal>
        <div
          class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4"
        >
          <UCard v-for="asset in content_images" :key="asset.id">
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
                <UButton
                  icon="i-heroicons-x-mark"
                  size="xs"
                  color="primary"
                  variant="solid"
                  square
                  @click="deleteImage(asset.name, 'content_images')"
                />
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </UPageBody>
  </UPage>
</template>
