<script setup lant="ts">
const props = defineProps(["catid"]);
const state = reactive({
  id: "new",
  cat_id: props.catid,
  date: "",
  notes: "",
  treatment_type: "",
  treatment_outcome: "not_applicable",
});

const emit = defineEmits(["newTreatment"]);

function onSubmit() {
  emit("newTreatment", state);
}
</script>
<template>
  <UForm :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Birth Date" name="birth_date">
      <UInput type="date" v-model="state.date" required />
    </UFormGroup>

    <UFormGroup label="Treatment Type" name="treatment_type">
      <USelectMenu
        required
        v-model="state.treatment_type"
        :options="[
          'vaccination_first',
          'vaccination_second',
          'test_fiv',
          'test_felv',
          'deworm',
          'antiparasite_internal',
          'antiparasite_external',
          'corona',
          'giardiasis',
          'ringworm',
          'diarrhea',
          'cat_fluother',
        ]"
      />
    </UFormGroup>

    <UFormGroup label="Treatment Outome" name="treatment_outcome">
      <USelectMenu
        required
        v-model="state.treatment_outcome"
        :options="['not_applicable', 'positive', 'negative']"
      />
    </UFormGroup>

    <UFormGroup label="Notes" name="notes">
      <UTextarea v-model="state.notes" variant="outline" />
    </UFormGroup>

    <UButton type="submit">Save</UButton>
  </UForm>
</template>
