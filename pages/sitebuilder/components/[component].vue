<script setup lang="ts">
import {
  updateComponent,
  deleteComponent,
  translateLabel,
} from "../../../lib/helpers";
import camelCase from "camelcase";

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
    content: "",
    required: false,
  };

  if (type === "dropdown") {
    field.values = "option1|option2";
  }

  state.value?.fields.push(field);
}

function removeField(index: number) {
  state.value?.fields.splice(index, 1);
  save();
}

async function onSubmit() {
  save();
}

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

async function delComponent() {
  await deleteComponent(state.value.id, supabase);
  navigateTo("/sitebuilder/components");
}

const links = [
  {
    label: "Pages",
    icon: "i-heroicons-clipboard-document-list",
    to: "/sitebuilder/pages",
  },
  {
    label: "Components",
    icon: "i-heroicons-code-bracket-square",
    to: "/sitebuilder/components",
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
            @blur="save()"
          />
        </UFormGroup>
        <UFormGroup label="API ID" name="api_id" description="Use camel case">
          <UInput
            v-model="state.api_id"
            name="api_id"
            required
            placeholder="Component API ID"
            @blur="
              state.api_id = camelCase(state.api_id);
              save();
            "
          />
        </UFormGroup>

        <div class="space-x-2">
          <UButton
            :label="translateLabel('text')"
            color="primary"
            variant="soft"
            @click="addField('text')"
            icon="i-heroicons-plus"
          />
          <UButton
            :label="translateLabel('rich_text')"
            color="primary"
            variant="soft"
            @click="addField('rich_text')"
            icon="i-heroicons-plus"
          />
          <UButton
            :label="translateLabel('dropdown')"
            color="primary"
            variant="soft"
            @click="addField('dropdown')"
            icon="i-heroicons-plus"
          />
          <UButton
            :label="translateLabel('checkbox')"
            color="primary"
            variant="soft"
            @click="addField('checkbox')"
            icon="i-heroicons-plus"
          />
          <UButton
            :label="translateLabel('image')"
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
            <div class="flex justify-between">
              <p class="font-bold text-xl">
                {{ translateLabel(field.type) }} field
              </p>
              <UButton
                icon="i-heroicons-x-mark"
                size="xs"
                color="primary"
                square
                variant="solid"
                @click="removeField(index)"
              />
            </div>
          </template>
          <div class="grid grid-cols-2 gap-8">
            <UFormGroup label="API ID" name="id" description="Use camel case">
              <UInput
                v-model="state.fields[index].id"
                name="id"
                placeholder="Field API ID"
                @blur="
                  state.fields[index].id = camelCase(state.fields[index].id)
                "
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

            <UFormGroup>
              <UCheckbox
                v-model="state.fields[index].required"
                name="required"
                label="Required field"
              />
            </UFormGroup>
          </div>
        </UCard>

        <UButton type="submit"> Save </UButton>
        <UButton variant="link" color="rose" @click="delComponent"
          >Delete
        </UButton>
      </UForm>
    </UPageBody>
    <UNotifications />
  </UPage>
</template>
