<script setup lang="ts">
import { useThrottleFn } from "@vueuse/core";
import { updateComponent } from "../../../lib/helpers";

const { params } = useRoute();
const componentId = Number(params.component);
const component = await useComponent(componentId);

const supabase = useSupabaseClient();
const state = reactive(component);
const toast = useToast();

async function onSubmit() {
  save();
}

const saveThrottled = useThrottleFn(() => {
  save();
}, 1000);

async function save() {
  const result = await updateComponent(state.value, supabase);

  if (result === "error") {
    toast.add({
      id: "error",
      color: "rose",
      title: "Error",
      description: "There was an error saving the component",
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

        <ul class="my-8">
          <li>Text</li>
          <li>Rich text</li>
          <li>Dropdown</li>
          <li>Checkbox</li>
          <li>Image</li>
        </ul>

        <UButton type="submit"> Save </UButton>
      </UForm>
      <pre>{{ state }}</pre>
    </UPageBody>
    <UNotifications />
  </UPage>
</template>
