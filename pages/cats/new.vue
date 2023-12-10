<script setup lang="ts">
import { newCat } from "../../lib/helpers";
const supabase = useSupabaseClient();

const state = reactive({
  name: "",
});

const newCatError = ref(false);

async function onSubmit() {
  const result = await newCat(state.name, supabase);

  if (result.error) {
    newCatError.value = true;
  } else {
    navigateTo(`/cats/${result.data.id}`);
  }
}

const links = [
  {
    label: "All cats",
    icon: "i-heroicons-list-bullet",
    to: "/",
  },
  {
    label: "Add new cat",
    icon: "i-heroicons-plus",
    to: "/cats/new",
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
        v-if="!newCatError"
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
        v-if="newCatError"
        color="red"
        variant="subtle"
        icon="i-heroicons-exclamation-triangle-20-solid"
        title="There was an error"
        description="Please reload this page to try again."
      />
    </UPageBody>
  </UPage>
</template>
