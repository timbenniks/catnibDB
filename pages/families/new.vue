<script setup lang="ts">
import { newFamily } from "../../lib/helpers";
const supabase = useSupabaseClient();

const state = reactive({
  name: "",
});

const newFamilyError = ref(false);

async function onSubmit() {
  const result = await newFamily(state.name, supabase);

  if (result.error) {
    newFamilyError.value = true;
  } else {
    navigateTo(`/families/${result.data.id}`);
  }
}

const links = [
  {
    label: "All Families",
    icon: "i-heroicons-list-bullet",
    to: "/families",
  },
  {
    label: "Add new family",
    icon: "i-heroicons-plus",
    to: "/families/new",
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
        v-if="!newFamilyError"
      >
        <UFormGroup label="Name" name="name">
          <UInput
            v-model="state.name"
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
        v-if="newFamilyError"
        color="red"
        variant="subtle"
        icon="i-heroicons-exclamation-triangle-20-solid"
        title="There was an error"
        description="Please reload this page to try again."
      />
    </UPageBody>
  </UPage>
</template>
