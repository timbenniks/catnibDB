<script setup lang="ts">
const {
  public: { supaseImgBase },
} = useRuntimeConfig();

const props = defineProps(["images"]);

const image = computed(() => {
  const imageName = props.images.split(",")[0];

  return `${supaseImgBase}cat_images/${imageName}`;
});
</script>

<template>
  <NuxtImg
    v-if="images"
    provider="cloudinary"
    :src="image"
    width="500"
    height="475"
    fit="fill"
    :modifiers="{ gravity: 'subject' }"
    class="rounded-lg"
    loading="lazy"
  />
</template>
