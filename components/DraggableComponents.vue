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

const {
  public: { supaseImgBase },
} = useRuntimeConfig();

const imageModalOpen = ref(false);

function onUpdate() {
  save();
}

function setRichTextContent(field: any, content: string) {
  field.content = content;
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

function addNewImage(field: any, image: string) {
  field.content = image;
  imageModalOpen.value = false;
  save();
}

function deleteImage(field: any) {
  field.content = "";
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
          :label="field.type !== 'checkbox' ? field.label : false"
          :name="field.id"
          :key="field.id"
        >
          <UInput
            v-if="field.type === 'text'"
            v-model="field.content"
            :name="field.id"
            :required="!!field.required"
            @blur="save"
          />

          <USelect
            v-if="field.type === 'dropdown'"
            v-model="field.content"
            :name="field.id"
            :required="!!field.required"
            :options="field.values?.split('|')"
            @blur="save"
          />
          <div v-if="field.type === 'rich_text'">
            <QuillEditor
              theme="snow"
              :name="field.id"
              contentType="html"
              :content="field.content"
              @update:content="(content:string) => setRichTextContent(field,
            content)"
              @blur="save"
            />
          </div>

          <UCheckbox
            v-if="field.type === 'checkbox'"
            v-model="field.content"
            :name="field.id"
            :required="!!field.required"
            :label="field.label"
            @change="save"
          />

          <div v-if="field.type === 'image'" class="relative w-[200px]">
            <div v-if="field.content !== ''">
              <NuxtImg
                provider="cloudinary"
                :src="`${supaseImgBase}content_images/${field.content}`"
                width="200"
                fit="fill"
                :modifiers="{ gravity: 'subject', ar: '16:9' }"
                class="rounded-lg"
              />
              <UButton
                icon="i-heroicons-x-mark"
                size="xs"
                color="primary"
                variant="solid"
                square
                class="absolute right-2 bottom-2"
                @click="deleteImage(field)"
              />
            </div>
            <select-media
              @addNewImage="(image:string) => addNewImage(field,
            image)"
              bucket="content_images"
              v-else
            />
          </div>
        </UFormGroup>
      </UCard>
    </VueDraggable>
  </div>
</template>

<style lang="postcss">
.ghost {
  @apply !bg-primary;
}

.ql-stroke {
  @apply stroke-gray-600 dark:stroke-white;
}

.ql-toolbar.ql-snow {
  border: none;
  @apply ring-1 ring-inset ring-gray-300 dark:ring-gray-600 dark:bg-gray-950 text-gray-900 rounded-t-lg;
}

.ql-container.ql-snow {
  border: none;
  @apply ring-1 ring-inset ring-gray-300 dark:ring-gray-700 dark:bg-gray-900 text-gray-900 rounded-b-lg dark:text-white;
}
</style>
