<script setup lang="ts">
import { newPage } from "../../../lib/helpers";
const supabase = useSupabaseClient();

const state = reactive({
  title: "",
});

const newPageError = ref(false);

async function onSubmit() {
  const result = await newPage(state.title, supabase);

  if (result.error) {
    newPageError.value = true;
  } else {
    navigateTo(`/sitebuilder/pages/${result.data.id}`);
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
      <UForm
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
        v-if="!newPageError"
      >
        <UFormGroup label="Title" name="title">
          <UInput
            v-model="state.title"
            size="xl"
            variant="outline"
            :ui="{ size: { xl: 'text-5xl' } }"
            autofocus
          />
        </UFormGroup>
        <UButton
          type="submit"
          size="xl"
          icon="i-heroicons-arrow-right"
          :trailing="true"
          >Next step</UButton
        >
      </UForm>
      <UAlert
        v-if="newPageError"
        color="red"
        variant="subtle"
        icon="i-heroicons-exclamation-triangle-20-solid"
        title="There was an error"
        description="Please reload this page to try again."
      />
    </UPageBody>
  </UPage>
</template>
