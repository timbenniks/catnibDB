<script setup lang="ts">
import { useThrottleFn } from "@vueuse/core";
import { updatePage, deletePage } from "../../../lib/helpers";
import type { DraggableComponents } from "#build/components";

const { params } = useRoute();
const pageId = Number(params.page);
const page = await usePage(pageId);

const supabase = useSupabaseClient();
const state = reactive(page);
const toast = useToast();

const {
  public: { supaseImgBase },
} = useRuntimeConfig();

const imageModalOpen = ref(false);

async function onSubmit() {
  save();
}

const saveThrottled = useThrottleFn(() => {
  save();
}, 1000);

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

async function delPage() {
  await deletePage(state.value.id, supabase);
  navigateTo("/sitebuilder/pages");
}

const links = [
  {
    label: "All Pages",
    icon: "i-heroicons-clipboard-document-list",
    to: "/sitebuilder/pages",
  },
  {
    label: "Add new page",
    icon: "i-heroicons-document-plus",
    to: "/sitebuilder/pages/new",
  },
  {
    label: "All Components",
    icon: "i-heroicons-code-bracket-square",
    to: "/sitebuilder/components",
  },
  {
    label: "Add new component",
    icon: "i-heroicons-plus",
    to: "/sitebuilder/components/new",
  },
];
</script>

<template>
  <UPage :ui="{ wrapper: 'max-w-full', left: 'pl-4' }">
    <template #left>
      <UAside>
        <UPageLinks :links="links" />
      </UAside>
    </template>
    <UPageBody class="max-w-4xl">
      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Name" name="name">
          <UInput
            v-model="state.title"
            size="xl"
            variant="none"
            :ui="{ variant: { none: 'p-0' }, size: { xl: 'text-5xl' } }"
            @update:modelValue="saveThrottled"
          />
        </UFormGroup>

        <div class="grid grid-cols-2 gap-4">
          <UCard
            class="relative"
            :ui="{ background: 'bg-gray-50 dark:bg-gray-950' }"
          >
            <NuxtImg
              v-if="state.image"
              provider="cloudinary"
              :src="`${supaseImgBase}${state.image}`"
              width="500"
              fit="fill"
              :modifiers="{ gravity: 'subject', ar: '16:9' }"
              class="rounded-lg"
            />
            <UButton
              icon="i-heroicons-plus"
              size="sm"
              color="primary"
              variant="soft"
              label="Add Image"
              :trailing="false"
              class="mt-4"
              v-else
              @click="imageModalOpen = true"
            />
            <UModal v-model="imageModalOpen">
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
                      @click="imageModalOpen = false"
                    />
                  </div>
                </template>
                <new-image @newImage="addNewImage" />
              </UCard>
            </UModal>
          </UCard>
          <UCard :ui="{ background: 'bg-gray-50 dark:bg-gray-950' }">
            <UCheckbox
              v-model="state.published"
              name="published"
              label="Published"
              @update:modelValue="save"
              class="mb-8"
            />
            <UFormGroup label="Slug" name="slug" class="mb-8">
              <UInput
                type="text"
                v-model="state.slug"
                @change="saveThrottled"
              />
            </UFormGroup>

            <UFormGroup label="Description" name="description">
              <UTextarea
                v-model="state.description"
                @update:modelValue="saveThrottled"
                variant="outline"
              />
            </UFormGroup>
          </UCard>
        </div>
        <UButton type="submit"> Save </UButton>
        <UButton variant="link" color="rose" @click="delPage">Delete </UButton>
      </UForm>
      <DraggableComponents />

      <pre class="mt-12">{{ page }}</pre>
    </UPageBody>
    <UNotifications />
  </UPage>
</template>
