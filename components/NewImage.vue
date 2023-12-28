<script setup lang="ts">
import { useFileDialog } from "@vueuse/core";
import { v4 as uuid } from "uuid";
const props = defineProps(["location"]);
const emit = defineEmits(["newImage"]);

const supabase = useSupabaseClient();

const fileToUpload = ref();
const previewImage = ref();
const uploading = ref(false);
const error = ref(false);

const { files, open, reset, onChange } = useFileDialog({
  accept: "image/*",
  directory: false,
  multiple: false,
});

onChange((files) => {
  if (files) {
    fileToUpload.value = files[0];
    previewImage.value = URL.createObjectURL(files[0]);
  }
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
    <UButton
      icon="i-heroicons-photo"
      color="primary"
      variant="soft"
      :label="files ? 'Select another image' : 'Choose image'"
      @click="open()"
    />

    <div v-if="files" class="mt-4">
      <div class="flex space-x-4 mb-4">
        <img :src="previewImage" width="100" class="rounded-lg" />
        <ul class="mb-4 text-xs">
          <li>
            File: <strong>{{ files[0].name }}</strong>
          </li>
          <li>
            Size: <strong>{{ files[0].size }}</strong>
          </li>
          <li>
            Type: <strong>{{ files[0].type }}</strong>
          </li>
          <li>
            Last modified:
            <strong>{{ new Date(files[0].lastModified) }}</strong>
          </li>
        </ul>
      </div>
      <div class="flex space-x-4">
        <UButton
          icon="i-heroicons-arrow-up-tray"
          color="primary"
          variant="solid"
          label="Upload"
          @click="uploadToSupabase"
        />

        <UButton
          icon="i-heroicons-x-mark"
          color="primary"
          variant="link"
          :disabled="!files"
          @click="reset()"
          label="Clear selection"
          :loading="uploading"
        />
      </div>
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
