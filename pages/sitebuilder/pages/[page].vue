<script setup lang="ts">
import { updatePage, deletePage } from "../../../lib/helpers";
const { assets: content_images } = await useAssets("content_images");
const { params } = useRoute();
const pageId = Number(params.page);
const page = await usePage(pageId);

const supabase = useSupabaseClient();
const state = reactive(page);
const toast = useToast();

const availableComponents = await useComponents();

const {
  public: { supaseImgBase },
} = useRuntimeConfig();

const imageModalOpen = ref(false);

async function onSubmit() {
  save();
}

async function save() {
  const result = await updatePage(state.value, supabase);

  if (result === "error") {
    toast.add({
      id: "error",
      color: "rose",
      title: "Error",
      description: "There was an error saving the page",
      icon: "i-heroicons-exclamation-triangle",
      timeout: 2000,
    });
  } else {
    toast.add({
      id: "saved",
      title: "Saved",
      description: "Information is automatically saved",
      icon: "i-heroicons-check-badge",
      timeout: 2000,
    });
  }
}

function addNewImage(image: string) {
  state.value.image = image;

  imageModalOpen.value = false;
  save();
}

function deleteImage() {
  state.value.image = "";
  save();
}

async function delPage() {
  await deletePage(state.value.id, supabase);
  navigateTo("/sitebuilder/pages");
}
</script>

<template>
  <UPage class="max-w-full">
    <UPageBody>
      <div class="px-8 flex">
        <UForm
          :state="state"
          class="space-y-4 w-full max-w-xl h-screen"
          @submit="onSubmit"
        >
          <UFormGroup label="Name" name="name">
            <UInput
              v-model="state.title"
              size="xl"
              variant="none"
              :ui="{ variant: { none: 'p-0' }, size: { xl: 'text-5xl' } }"
              @blur="save"
            />
          </UFormGroup>

          <UCard :ui="{ background: 'bg-gray-50 dark:bg-gray-950' }">
            <UCheckbox
              v-model="state.published"
              name="published"
              label="Published"
              @update:modelValue="save"
              class="mb-8"
            />
            <UFormGroup label="Slug" name="slug" class="mb-8">
              <UInput type="text" v-model="state.slug" @blur="save" />
            </UFormGroup>

            <UFormGroup label="Description" name="description" class="mb-8">
              <UTextarea
                v-model="state.description"
                @blur="save"
                variant="outline"
              />
            </UFormGroup>
            <UFormGroup label="Image" name="image">
              <div v-if="state.image" class="relative w-[200px]">
                <NuxtImg
                  provider="cloudinary"
                  :src="`${supaseImgBase}content_images/${state.image}`"
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
                  @click="deleteImage()"
                />
              </div>

              <select-media
                @addNewImage="addNewImage"
                bucket="content_images"
                v-else
              />
            </UFormGroup>
          </UCard>

          <DraggableComponents
            :availableComponents="availableComponents"
            :currentComponents="state.components"
            @save="save"
          />

          <UButton type="submit"> Save </UButton>
          <UButton variant="link" color="rose" @click="delPage">Delete</UButton>
        </UForm>
        <div class="w-full max-w-7xl ml-4">
          <h3 class="mb-2">Page preview</h3>
          <iframe
            :src="`http://localhost:3000/demo/${pageId}`"
            class="w-full h-screen border-2 border-primary rounded-lg"
          />
        </div>
      </div>
    </UPageBody>
    <UNotifications />
  </UPage>
</template>
