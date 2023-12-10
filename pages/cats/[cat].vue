<script setup lang="ts">
import { useThrottleFn } from "@vueuse/core";
import { translateLabel, updateCat } from "../../lib/helpers";

const { params } = useRoute();
const catId = Number(params.cat);
const cat = await useCat(catId);
const supabase = useSupabaseClient();

const treatmentModalOpen = ref(false);
const weightModalOpen = ref(false);
const imageModalOpen = ref(false);
const state = reactive(cat);
const toast = useToast();
const imagecard = ref();

const {
  public: { supaseImgBase },
} = useRuntimeConfig();

function scrollToImages() {
  imagecard.value?.$el.scrollIntoView({ behavior: "smooth" });
}

const treatments = computed(() => {
  let result: any[] = [];

  cat.value.treatments.map((treatment: any) => {
    result.push({
      label: `${treatment.date}: ${translateLabel(treatment.treatment_type)} ${
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

const weights = computed(() => {
  let result: any[] = [];

  cat.value.weights.map((weight: any) => {
    result.push({
      Date: weight.date,
      Weight: weight.weight_gr,
    });
  });

  return result;
});

const images = computed(() => {
  let result = [];
  if (cat.value.images !== null) {
    result = cat.value.images
      .trim()
      .split(",")
      .map((image: string, index: number) => {
        return `${supaseImgBase}${image}`;
      });
  }

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

async function addNewTreatment(treatment: any) {
  state.value.treatments.push(treatment);
  treatmentModalOpen.value = false;
  const { error } = await supabase.from("treatments").insert(treatment);

  if (error) {
    toast.add({
      id: "error",
      color: "rose",
      title: "Error",
      description: "There was an error saving the treatment",
      icon: "i-heroicons-exclamation-triangle",
      timeout: 2000,
    });
  }

  save();
}

async function addNewWeight(weight: any) {
  state.value.weights.push(weight);
  weightModalOpen.value = false;
  const { error } = await supabase.from("weight").insert(weight);

  if (error) {
    toast.add({
      id: "error",
      color: "rose",
      title: "Error",
      description: "There was an error saving the weight",
      icon: "i-heroicons-exclamation-triangle",
      timeout: 2000,
    });
  }

  save();
}

function addNewImage(image: string) {
  let images = state.value.images;

  if (images === "") {
    state.value.images = image;
  } else {
    state.value.images = `${images},${image}`;
  }

  imageModalOpen.value = false;
  save();
}

function deleteImage(image: string) {
  if (state.value.images === null) {
    return;
  }

  const cleanedUpImage = image.split(supaseImgBase)[1];
  const imagesAsArray = state.value.images.split(",").map((image: string) => {
    return image;
  });

  state.value.images = imagesAsArray
    .filter((img: string) => img !== cleanedUpImage)
    .toString();

  save();
}

async function onSubmit() {
  save();
}

const saveThrottled = useThrottleFn(() => {
  save();
}, 1000);

async function save() {
  const result = await updateCat(state.value, supabase);

  if (result === "error") {
    toast.add({
      id: "error",
      color: "rose",
      title: "Error",
      description: "There was an error saving the weight",
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
          <UCard
            class="relative"
            :ui="{ background: 'bg-gray-50 dark:bg-gray-950' }"
          >
            <MainImage :images="cat.images" v-if="cat.images !== ''" />
            <client-only>
              <UButton
                icon="i-heroicons-pencil-square"
                size="sm"
                color="primary"
                variant="solid"
                square
                class="absolute right-8 bottom-8"
                @click="
                  state.images === ''
                    ? (imageModalOpen = true)
                    : scrollToImages()
                "
              />
            </client-only>
          </UCard>
          <UCard :ui="{ background: 'bg-gray-50 dark:bg-gray-950' }">
            <UFormGroup label="Birth Date" name="birth_date">
              <UInput type="date" v-model="state.birth_date" @change="save" />
            </UFormGroup>

            <UCheckbox
              v-model="state.deceased"
              name="deceased"
              label="Deceased"
              @update:modelValue="save"
              class="my-8"
            />

            <UFormGroup label="Sex" name="sex" class="mb-8">
              <USelectMenu
                v-model="state.sex"
                :options="['female', 'male']"
                @update:modelValue="save"
              />
            </UFormGroup>

            <UFormGroup label="Arrival Date" name="arrival_date" class="mb-8">
              <UInput type="date" v-model="state.arrival_date" @change="save" />
            </UFormGroup>

            <UFormGroup label="Protocol Date" name="protocol_date">
              <UInput
                type="date"
                v-model="state.protocol_date"
                @change="save"
              />
            </UFormGroup>
          </UCard>
        </div>

        <UCard :ui="{ base: '', background: 'bg-gray-50 dark:bg-gray-950' }">
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

        <UCard :ui="{ background: 'bg-gray-50 dark:bg-gray-950' }">
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
              <UTextarea
                v-model="state.history"
                variant="outline"
                @update:modelValue="saveThrottled"
              />
            </UFormGroup>
          </div>

          <UFormGroup label="Care received" name="care_received" class="mb-8">
            <UTextarea
              v-model="state.care_received"
              variant="outline"
              @update:modelValue="saveThrottled"
            />
          </UFormGroup>

          <UFormGroup label="Notes" name="notes">
            <UTextarea
              v-model="state.notes"
              variant="outline"
              @update:modelValue="saveThrottled"
            />
          </UFormGroup>
        </UCard>

        <UCard
          ref="imagecard"
          :ui="{ background: 'bg-gray-50 dark:bg-gray-950' }"
        >
          <template #header>
            <p class="font-bold">Images</p>
          </template>

          <div class="grid grid-cols-6 gap-4">
            <div
              v-if="cat.images !== ''"
              v-for="image in images"
              :key="image"
              class="relative"
            >
              <NuxtImg
                provider="cloudinary"
                :src="image"
                width="160"
                height="152"
                fit="fill"
                :modifiers="{ gravity: 'subject' }"
                class="rounded-lg"
              />
              <UButton
                icon="i-heroicons-x-mark"
                size="xs"
                color="primary"
                variant="solid"
                square
                class="absolute right-1 bottom-1"
                @click="deleteImage(image)"
              />
            </div>
          </div>

          <UButton
            icon="i-heroicons-plus"
            size="sm"
            color="primary"
            variant="soft"
            label="Add Image"
            :trailing="false"
            class="mt-4"
            @click="imageModalOpen = true"
          />
          <UModal v-model="imageModalOpen">
            <UCard>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3
                    class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                  >
                    Add Image
                  </h3>
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-x-mark-20-solid"
                    class="-my-1"
                    @click="imageModalOpen = false"
                  />
                </div>
              </template>
              <new-image @newImage="addNewImage" />
            </UCard>
          </UModal>
        </UCard>

        <UCard :ui="{ background: 'bg-gray-50 dark:bg-gray-950' }">
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
              <UButton
                icon="i-heroicons-plus"
                size="sm"
                color="primary"
                variant="soft"
                label="Add Treatment"
                :trailing="false"
                class="mt-4"
                @click="treatmentModalOpen = true"
              />
              <UModal v-model="treatmentModalOpen">
                <UCard>
                  <template #header>
                    <div class="flex items-center justify-between">
                      <h3
                        class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                      >
                        Add Treatment
                      </h3>
                      <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark-20-solid"
                        class="-my-1"
                        @click="treatmentModalOpen = false"
                      />
                    </div>
                  </template>
                  <new-treatment
                    :catid="cat.id"
                    @newTreatment="addNewTreatment"
                  />
                </UCard>
              </UModal>
            </UFormGroup>

            <UFormGroup label="Weight">
              <weight-chart :data="weights" />
              <UButton
                icon="i-heroicons-plus"
                size="sm"
                color="primary"
                variant="soft"
                label="Add Weight"
                :trailing="false"
                class="mt-4"
                @click="weightModalOpen = true"
              />
              <UModal v-model="weightModalOpen">
                <UCard>
                  <template #header>
                    <div class="flex items-center justify-between">
                      <h3
                        class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                      >
                        Add Weight
                      </h3>
                      <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark-20-solid"
                        class="-my-1"
                        @click="weightModalOpen = false"
                      />
                    </div>
                  </template>
                  <new-weight :catid="cat.id" @newWeight="addNewWeight" />
                </UCard>
              </UModal>
            </UFormGroup>
          </div>
        </UCard>
      </UForm>
      <pre>{{ cat }}</pre>
    </UPageBody>
    <UNotifications />
  </UPage>
</template>
