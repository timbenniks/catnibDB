<script setup lang="ts">
const props = defineProps(["famId", "label", "name"]);
const emit = defineEmits(["select"]);
const families = await useFamilies();

const selected = ref(families.value?.find((fam) => fam.id === props.famId)?.id);
const current = computed(() =>
  families.value?.find((fam) => fam.id === selected.value)
);

function save() {
  emit(
    "select",
    families.value?.find((fam) => fam.id === selected.value)
  );
}
</script>

<template>
  <UFormGroup :label="label" :name="name">
    <USelectMenu
      v-model="selected"
      :options="families"
      placeholder="Select family"
      value-attribute="id"
      option-attribute="name"
      @update:modelValue="save"
    >
      <template #label>
        <template v-if="current && current.name">{{ current.name }}</template>
        <template v-else>Select Family</template>
      </template>
    </USelectMenu>
  </UFormGroup>
</template>
