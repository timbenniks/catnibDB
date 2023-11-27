<script setup lang="ts">
import { useThrottleFn } from "@vueuse/core";
import { translateTreatmentLabel } from "../../lib/helpers";
const { params } = useRoute();
const catId = Number(params.cat);
const cat = await useCat(catId);

const state = reactive(cat);

const treatments = computed(() => {
  let result: any[] = [];

  cat.value.treatments.map((treatment: any) => {
    result.push({
      label: `${treatment.date}: ${translateTreatmentLabel(
        treatment.treatment_type
      )} ${
        treatment.treatment_outcome &&
        treatment.treatment_outcome !== "not_applicable"
          ? ` (${treatment.treatment_outcome})`
          : ""
      }`,
      content: treatment.notes,
    });
  });

  return result;
});

function selectHostFamily(fam: any) {
  state.value.host_family_id = fam;
  save();
}

function selectAdoptionFamily(fam: any) {
  state.value.adoption_family_id = fam;
  save();
}

async function onSubmit() {
  save();
}

const saveThrottled = useThrottleFn(() => {
  save();
}, 1000);

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
    <UPageBody class="max-w-4xl">
      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Name" name="name">
          <UInput
            v-model="state.name"
            size="xl"
            variant="none"
            :ui="{ variant: { none: 'p-0' }, size: { xl: 'text-5xl' } }"
            @blur="save"
          />
        </UFormGroup>

        <div class="grid grid-cols-2 gap-4">
          <UCard>
            <NuxtImg
              provider="cloudinary"
              src="https://qudljltfyoctkydecbon.supabase.co/storage/v1/object/public/cat_images/IMG_7738.JPG"
              width="500"
              height="415"
              fit="fill"
              :modifiers="{ gravity: 'subject' }"
            />
          </UCard>
          <UCard>
            <div class="grid grid-cols-2 gap-8 mb-8">
              <UFormGroup label="Birth Date" name="birth_date">
                <UInput type="date" v-model="state.birth_date" @change="save" />
              </UFormGroup>

              <UCheckbox
                v-model="state.deceased"
                name="deceased"
                label="Deceased"
                @update:modelValue="save"
                class="pt-7"
              />
            </div>
            <UFormGroup label="Sex" name="sex" class="mb-8">
              <USelectMenu
                v-model="state.sex"
                :options="['female', 'male']"
                @update:modelValue="save"
              />
            </UFormGroup>

            <div class="grid grid-cols-2 gap-8 mb-8">
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
          </UCard>
        </div>

        <UCard :ui="{ base: '' }">
          <template #header>
            <p class="font-bold">Adoption</p>
          </template>
          <div class="grid grid-cols-4 gap-6 mb-8">
            <UCheckbox
              v-model="state.deed_of_transfer"
              name="deed_of_transfer"
              label="Deed of transfer"
              @update:modelValue="save"
              class="pt-7"
            />

            <UCheckbox
              v-model="state.reserved"
              name="reserved"
              label="Reserved"
              @update:modelValue="save"
              class="pt-7"
            />

            <UCheckbox
              v-model="state.adopted"
              name="adopted"
              label="Adopted"
              @update:modelValue="save"
              class="pt-7"
            />

            <UFormGroup label="Adoption Date" name="adoption_date">
              <UInput
                type="date"
                v-model="state.adoption_date"
                @change="save"
              />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-2 gap-8">
            <FamilySelector
              v-if="cat.host_family_id"
              label="Host Family"
              name="host_family_id"
              :fam-id="cat.host_family_id ? cat.host_family_id.id : false"
              @select="selectHostFamily"
            />

            <FamilySelector
              label="Adoption Family"
              name="adoption_family_id"
              :fam-id="
                cat.adoption_family_id ? cat.adoption_family_id.id : false
              "
              @select="selectAdoptionFamily"
            />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <p class="font-bold">About</p>
          </template>
          <div class="grid grid-cols-2 gap-6">
            <UFormGroup label="Color" name="color">
              <UInput
                name="color"
                v-model="state.color"
                @update:modelValue="saveThrottled"
                variant="outline"
              />
            </UFormGroup>
            <div class="grid grid-cols-2 gap-6">
              <UCheckbox
                v-model="state.with_dogs"
                name="with_dogs"
                label="Good with dogs"
                @update:modelValue="save"
                class="pt-7"
              />
              <UCheckbox
                v-model="state.with_cats"
                name="with_cats"
                label="Good with cats"
                @update:modelValue="save"
                class="pt-7"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6 my-8">
            <UFormGroup label="Character" name="character">
              <UTextarea
                v-model="state.character"
                @update:modelValue="saveThrottled"
                variant="outline"
              />
            </UFormGroup>

            <UFormGroup label="History" name="history">
              <UTextarea v-model="state.history" variant="outline" />
            </UFormGroup>
          </div>

          <UFormGroup label="Care received" name="care_received" class="mb-8">
            <UTextarea v-model="state.care_received" variant="outline" />
          </UFormGroup>

          <UFormGroup label="Notes" name="notes">
            <UTextarea v-model="state.notes" variant="outline" />
          </UFormGroup>
        </UCard>

        <UCard>
          <template #header>
            <p class="font-bold">Medical</p>
          </template>
          <div class="grid grid-cols-3 gap-6 mb-8">
            <UCheckbox
              v-model="state.certificate_healthy"
              name="certificate_healthy"
              label="Certificate healthy"
              @update:modelValue="save"
            />

            <UCheckbox
              v-model="state.health_book"
              name="health_book"
              label="Carne Sante"
              @update:modelValue="save"
            />

            <UCheckbox
              v-model="state.sterilised"
              name="sterilised"
              label="Sterilised"
              @update:modelValue="save"
            />
          </div>
          <div class="grid grid-cols-3 gap-8 mb-8">
            <UCheckbox
              v-model="state.chipped"
              name="chipped"
              label="Chipped"
              @update:modelValue="save"
              class="pt-7"
            />
            <UFormGroup label="Chip ID" name="chip_id">
              <UInput
                name="color"
                v-model="state.chip_id"
                @update:modelValue="saveThrottled"
                variant="outline"
              />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-2 gap-8">
            <UFormGroup label="Treatments">
              <UAccordion
                color="primary"
                multiple
                variant="soft"
                :items="treatments"
              />
            </UFormGroup>

            <UFormGroup label="Weight">
              <UTable :rows="cat.weights" />
            </UFormGroup>
          </div>
        </UCard>
      </UForm>
    </UPageBody>
  </UPage>
</template>
