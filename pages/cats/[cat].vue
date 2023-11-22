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

const state = reactive(cat);

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
    <UPageBody class="max-w-3xl">
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

        <div class="grid grid-cols-2 gap-8">
          <UCard>
            <NuxtImg
              provider="cloudinary"
              src="https://qudljltfyoctkydecbon.supabase.co/storage/v1/object/public/cat_images/IMG_7738.JPG"
              width="500"
              height="500"
              fit="thumbnail"
            />
          </UCard>
          <UCard>
            <div class="flex gap-6 mb-6">
              <UFormGroup label="Birth Date" name="birth_date">
                <UInput type="date" v-model="state.birth_date" @change="save" />
              </UFormGroup>
              <UFormGroup label="Adoption Date" name="adoption_date">
                <UInput
                  type="date"
                  v-model="state.adoption_date"
                  @change="save"
                />
              </UFormGroup>
            </div>
            <UFormGroup label="Sex" name="sex" class="mb-6">
              <USelectMenu
                v-model="state.sex"
                :options="['female', 'male']"
                @update:modelValue="save"
              />
            </UFormGroup>

            <div class="flex gap-6 mb-6">
              <UFormGroup label="Arrival Date" name="arrival_date">
                <UInput
                  type="date"
                  v-model="state.arrival_date"
                  @change="save"
                />
              </UFormGroup>
              <UFormGroup label="Protocol Date" name="protocol_date">
                <UInput
                  type="date"
                  v-model="state.protocol_date"
                  @change="save"
                />
              </UFormGroup>
            </div>

            <div class="flex gap-6 mb-6">
              <UFormGroup label="Deceased" name="deceased">
                <UToggle v-model="state.deceased" @update:modelValue="save" />
              </UFormGroup>
              <UFormGroup label="Chipped" name="chipped">
                <UToggle v-model="state.chipped" @update:modelValue="save" />
              </UFormGroup>
              <UFormGroup label="Sterilised" name="sterilised">
                <UToggle v-model="state.sterilised" @update:modelValue="save" />
              </UFormGroup>
              <UFormGroup label="Adopted" name="adopted">
                <UToggle v-model="state.adopted" @update:modelValue="save" />
              </UFormGroup>
            </div>
          </UCard>
        </div>
      </UForm>
    </UPageBody>
    <pre>{{ cat }}</pre>
  </UPage>
</template>
