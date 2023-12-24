<script setup lang="ts">
import { useThrottleFn } from "@vueuse/core";
import { updateFamily, deleteFamily } from "../../lib/helpers";

const { params } = useRoute();
const familyId = Number(params.family);
const family = await useFamily(familyId);

const supabase = useSupabaseClient();
const state = reactive(family);
const toast = useToast();

async function delFamily() {
  await deleteFamily(state.value.id, supabase);
  navigateTo("/families");
}

async function onSubmit() {
  save();
}

const saveThrottled = useThrottleFn(() => {
  save();
}, 1000);

async function save() {
  const result = await updateFamily(state.value, supabase);

  if (result === "error") {
    toast.add({
      id: "error",
      color: "rose",
      title: "Error",
      description: "There was an error saving the family",
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
    label: "Family Overview",
    icon: "i-heroicons-list-bullet",
    to: "/families",
  },
];
</script>

<template>
  <UPage class="max-w-4xl mx-auto">
    <UPageBody>
      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Name" name="name">
          <UInput
            v-model="state.name"
            size="xl"
            variant="none"
            :ui="{ variant: { none: 'p-0' }, size: { xl: 'text-5xl' } }"
            @update:modelValue="saveThrottled"
          />
        </UFormGroup>

        <UCard :ui="{ base: '', background: 'bg-gray-50 dark:bg-gray-950' }">
          <template #header>
            <p class="font-bold">Family information</p>
          </template>

          <div class="grid grid-cols-2 gap-8">
            <UFormGroup label="email" name="Email">
              <UInput
                type="email"
                v-model="state.email"
                @update:modelValue="saveThrottled"
              />
            </UFormGroup>

            <UFormGroup label="phone" name="Phone">
              <UInput
                type="tel"
                v-model="state.phone"
                @update:modelValue="saveThrottled"
              />
            </UFormGroup>

            <UFormGroup label="Address" name="address">
              <UInput
                v-model="state.address"
                @update:modelValue="saveThrottled"
              />
            </UFormGroup>

            <UFormGroup label="Family type" name="family_type">
              <USelectMenu
                v-model="state.family_type"
                :options="['host', 'adoption', 'both']"
                @update:modelValue="save"
              />
            </UFormGroup>
          </div>
        </UCard>
        <UButton type="submit"> Save </UButton>
        <UButton variant="link" color="rose" @click="delFamily">Delete</UButton>
      </UForm>
    </UPageBody>
    <UNotifications />
  </UPage>
</template>
