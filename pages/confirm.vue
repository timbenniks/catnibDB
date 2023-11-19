<script setup lang="ts">
definePageMeta({
  layout: "meta",
});

const user = useSupabaseUser();
watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/");
    }
  },
  { immediate: true }
);
</script>
<template>
  <UAlert
    color="green"
    variant="subtle"
    icon="i-heroicons-check-badge"
    title="Validating"
    description="Thanks for clickign ont he magic link. We are validating your login now."
  />
</template>
