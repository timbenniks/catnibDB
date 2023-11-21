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
  <UContainer :ui="{ constrained: 'max-w-xl' }">
    <img src="/chats.svg" class="w-20 my-5 mx-auto" />

    <UCard class="mt-10">
      <template #header>
        <div class="flex justify-between">
          <h1 class="font-bold text-xl">Logged in</h1>
          <UColorModeButton />
        </div>
      </template>

      <section>
        <UAlert
          color="green"
          variant="subtle"
          icon="i-heroicons-check-badge"
          title="Validating"
          description="Thanks for clicking on the magic link. We are validating your login now."
        />
      </section>
    </UCard>
  </UContainer>
</template>
