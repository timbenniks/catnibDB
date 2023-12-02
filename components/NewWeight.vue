<script setup lant="ts">
const props = defineProps(["catid"]);
const state = reactive({
  id: "new",
  cat_id: props.catid,
  date: "",
  weight_gr: "",
});

const emit = defineEmits(["newWeight"]);

function onSubmit() {
  emit("newWeight", state);
}
</script>
<template>
  <UForm :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Birth Date" name="birth_date">
      <UInput type="date" v-model="state.date" required />
    </UFormGroup>

    <UFormGroup label="Weight (grams)" name="weight">
      <UInput type="number" v-model="state.weight_gr" required />
    </UFormGroup>

    <UButton type="submit">Save</UButton>
  </UForm>
</template>
