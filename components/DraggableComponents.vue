<template>
  <div class="flex flex-col">
    <VueDraggable
      v-model="list1"
      animation="150"
      ghostClass="ghost"
      :group="{ name: 'people', pull: 'clone', put: false }"
      :clone="clone"
      :sort="false"
      class="flex flex-row gap-2 p-4 w-300px bg-gray-500/5 rounded"
    >
      <div
        v-for="item in list1"
        :key="item.id"
        class="cursor-move h-50px bg-gray-500/5 rounded p-3"
      >
        {{ item.name }}
      </div>
    </VueDraggable>
    <VueDraggable
      v-model="list2"
      animation="150"
      group="people"
      ghostClass="ghost"
      class="flex flex-col mt-4 gap-2 p-4 w-full m-auto bg-gray-500/5 rounded overflow-auto"
    >
      <div
        v-for="item in list2"
        :key="item.id"
        class="cursor-move h-50px bg-gray-500/5 rounded p-3"
      >
        {{ item.name }}
      </div>
    </VueDraggable>
  </div>
</template>

<script lang="ts" setup>
import { VueDraggable } from "vue-draggable-plus";

const list1 = ref([
  {
    name: "Joao",
    id: "1",
  },
  {
    name: "Jean",
    id: "2",
  },
  {
    name: "Johanna",
    id: "3",
  },
  {
    name: "Juan",
    id: "4",
  },
]);

const list2 = ref([]);

function clone(element: Record<"name" | "id", string>) {
  const len = list2.value.length;
  return {
    name: `${element.name}-clone-${len}`,
    id: `${element.id}-clone-${len}`,
  };
}
</script>
