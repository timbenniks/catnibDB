<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { params } = useRoute();
const catId = Number(params.cat);
const cat = await useCat(catId);

const schema = z.object({
  name: z.string(),
  email: z.string().email("Invalid email"),
  birth_date: z.string(), // todo parse date
  deceased: z.boolean(),
  sex: z.string(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  name: cat.value.name,
  birth_date: cat.value.birth_date,
  deceased: cat.value.deceased,
  sex: cat.value.sex,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data);
}

function save() {
  console.log(state);
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
    <UPageBody>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Name" name="name">
          <UInput
            v-model="state.name"
            size="xl"
            variant="none"
            :ui="{ variant: { none: 'p-0' }, size: { xl: 'text-5xl' } }"
            @blur="save"
          />
        </UFormGroup>

        <UFormGroup label="Birth Date" name="birth_date">
          <UInput type="date" v-model="state.birth_date" @change="save" />
        </UFormGroup>

        <UFormGroup label="Deceased" name="deceased">
          <UToggle v-model="state.deceased" @update:modelValue="save" />
        </UFormGroup>

        <UFormGroup label="Sex" name="sex">
          <USelectMenu
            v-model="state.sex"
            :options="['female', 'male']"
            @update:modelValue="save"
          />
        </UFormGroup>
      </UForm>
    </UPageBody>

    <pre>{{ cat }}</pre>
  </UPage>
</template>
