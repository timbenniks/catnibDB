<script setup lang="ts">
import { useThrottleFn } from "@vueuse/core";
import { updateComponent } from "../../../lib/helpers";

const { params } = useRoute();
const componentId = Number(params.component);
const component = await useComponent(componentId);

const supabase = useSupabaseClient();
const state = reactive(component);
const toast = useToast();

function addField(type: string) {
  const field = {
    type,
    id: "",
    label: "",
    values: "",
  };

  if (type === "dropdown") {
    field.values = "option1|option2";
  }

  state.value.fields.push(field);
}

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

        <div class="space-x-2">
          <UButton
            label="Text"
            color="primary"
            variant="soft"
            @click="addField('text')"
            icon="i-heroicons-plus"
          />
          <UButton
            label="Rich text"
            color="primary"
            variant="soft"
            @click="addField('rich_text')"
            icon="i-heroicons-plus"
          />
          <UButton
            label="Dropdown"
            color="primary"
            variant="soft"
            @click="addField('dropdown')"
            icon="i-heroicons-plus"
          />
          <UButton
            label="Checkbox"
            color="primary"
            variant="soft"
            @click="addField('checkbox')"
            icon="i-heroicons-plus"
          />
          <UButton
            label="Image"
            color="primary"
            variant="soft"
            @click="addField('image')"
            icon="i-heroicons-plus"
          />
        </div>

        <UCard
          v-for="(field, index) in state.fields"
          :ui="{ base: '', background: 'bg-gray-50 dark:bg-gray-950' }"
        >
          <template #header>
            <p class="font-bold">{{ field.type }} field</p>
          </template>
          <div class="grid grid-cols-2 gap-8">
            <UFormGroup
              label="API ID"
              name="id"
              description="API ID, use camel case"
            >
              <UInput
                v-model="state.fields[index].id"
                name="id"
                placeholder="Field ID"
              />
            </UFormGroup>

            <UFormGroup
              label="Label"
              name="label"
              description="Human readable label"
            >
              <UInput
                v-model="state.fields[index].label"
                name="label"
                placeholder="Field label"
              />
            </UFormGroup>

            <UFormGroup
              description="Please use value|value|value"
              label="Values"
              name="values"
              v-if="field.values"
            >
              <UInput
                v-model="state.fields[index].values"
                name="values"
                placeholder="Field values"
              />
            </UFormGroup>
          </div>
        </UCard>

        <UButton type="submit"> Save </UButton>
      </UForm>
    </UPageBody>
    <UNotifications />
  </UPage>
</template>
