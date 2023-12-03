<script setup lang="ts">
import { ref } from "vue";
import { type UseDraggableReturn, VueDraggable } from "vue-draggable-plus";

const {
  public: { supaseImgBase },
} = useRuntimeConfig();

const props = defineProps(["images"]);
const emit = defineEmits(["updatedImageOrder"]);

const el = ref<UseDraggableReturn>();

const images = ref(
  props.images
    .trim()
    .split(",")
    .map((image: string, index: number) => {
      return {
        id: index,
        url: `${supaseImgBase}${image}`,
      };
    })
);

const onUpdate = () => {
  const toEmit = images.value.map((image: any) => {
    return image.url.split(supaseImgBase)[1];
  });

  emit("updatedImageOrder", toEmit.toString());
};
</script>
<template>
  <div class="flex">
    <VueDraggable
      ref="el"
      v-model="images"
      :animation="150"
      ghostClass="ghost"
      class="grid grid-cols-6 gap-4"
      @update="onUpdate"
    >
      <div v-for="image in images" class="cursor-move">
        <NuxtImg
          provider="cloudinary"
          :src="image.url"
          :key="image.id"
          width="160"
          height="152"
          fit="fill"
          :modifiers="{ gravity: 'subject' }"
          class="rounded-lg"
        />
      </div>
    </VueDraggable>
  </div>
</template>

<style scoped lang="postcss">
.ghost {
  @apply opacity-50;
}
</style>
