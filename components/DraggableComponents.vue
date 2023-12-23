<script lang="ts" setup>
import { VueDraggable } from "vue-draggable-plus";

type component_field = {
  id: string;
  type: string;
  label: string;
  values?: string;
  required?: boolean;
  content?: any;
};

type component = {
  id: number;
  created_at: string;
  title: string;
  fields: [component_field];
  api_id: "string";
};

const emit = defineEmits(["save"]);

const props = defineProps<{
  currentComponents: [component];
  availableComponents: [component];
}>();

const components = ref(props.currentComponents || []);

function onUpdate() {
  save();
}

function addComponent(id: number) {
  components.value.push(
    props.availableComponents.find((comp: component) => comp.id === id)
  );
  save();
}

function removeComponent(index: number) {
  components.value?.splice(index, 1);
  save();
}

function save() {
  emit("save");
}
</script>

<template>
  <div class="flex flex-col">
    <div class="space-x-2 mb-4">
      <UButton
        v-for="availableComponent in availableComponents"
        :label="availableComponent.title"
        color="primary"
        variant="soft"
        @click="addComponent(availableComponent.id)"
        icon="i-heroicons-plus"
      />
    </div>

    <VueDraggable
      v-model="components"
      animation="150"
      ghostClass="ghost"
      @update="onUpdate"
    >
      <UCard
        v-for="(component, index) in components"
        :key="component.id"
        :ui="{ background: 'bg-gray-50 dark:bg-gray-950' }"
        class="mb-4"
      >
        <template #header>
          <div class="flex justify-between">
            <div class="flex cursor-grab">
              <UIcon name="i-heroicons-bars-4" class="mt-1 mr-2" />
              <p class="font-bold text-xl">{{ component.title }}</p>
            </div>
            <UButton
              icon="i-heroicons-x-mark"
              size="xs"
              color="primary"
              square
              variant="solid"
              @click="removeComponent(index)"
            />
          </div>
        </template>
        <UFormGroup
          class="mb-8 last:mb-0"
          v-for="field in component.fields"
          :label="field.label"
          :name="field.id"
          :key="field.id"
        >
          <UInput
            v-model="field.content"
            :name="field.id"
            :required="!!field.required"
            @blur="save"
          />
        </UFormGroup>
      </UCard>
    </VueDraggable>
  </div>
</template>

<style lang="postcss">
.ghost {
  @apply !bg-primary;
}
</style>
