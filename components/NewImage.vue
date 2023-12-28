<script setup lang="ts">
import { useFileDialog } from "@vueuse/core";
import { v4 as uuid } from "uuid";
const props = defineProps(["location"]);
const supabase = useSupabaseClient();
const fileToUpload = ref();
const uploading = ref(false);
const emit = defineEmits(["newImage"]);
const error = ref(false);

const { files, open, reset, onChange } = useFileDialog({
  accept: "image/*",
  directory: false,
});
onChange(async (files: FileList) => {
  fileToUpload.value = files[0];
});

async function uploadToSupabase() {
  uploading.value = true;
  const filename = `${uuid()}-${fileToUpload.value.name}`;

  const { data, error: uploadIssue } = await supabase.storage
    .from(props.location ? props.location : "cat_images")
    .upload(filename, fileToUpload.value, {
      cacheControl: "3600",
      upsert: false,
    });

  uploading.value = false;

  if (data) {
    emit("newImage", filename);
  }

  if (uploadIssue) {
    error.value = true;
  }
}
</script>

<template>
  <template v-if="!error">
    <UButtonGroup size="sm" orientation="horizontal">
      <UButton
        icon="i-heroicons-photo"
        color="primary"
        variant="soft"
        label="Choose image"
        @click="open()"
      />
      <UButton
        icon="i-heroicons-x-mark"
        color="primary"
        variant="soft"
        :disabled="!files"
        @click="reset()"
        square
        :loading="uploading"
      />
    </UButtonGroup>

    <div v-if="files" class="mt-4">
      <p class="mb-4">
        Selected: <strong>{{ files[0].name }}</strong>
      </p>

      <UButton
        icon="i-heroicons-arrow-up-tray"
        color="primary"
        variant="solid"
        label="Upload"
        @click="uploadToSupabase"
      />
    </div>
  </template>
  <template v-else>
    <UAlert
      icon="i-heroicons-exclamation-triangle"
      title="Something went wrong with your upload."
      color="rose"
      variant="soft"
    />
  </template>
</template>
