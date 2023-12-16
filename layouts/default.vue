<script setup lang="ts">
const links = [
  {
    label: "Dashboard",
    to: "/",
  },
  {
    label: "Cats",
    to: "/cats",
  },
  {
    label: "Foster Families",
    to: "/families",
  },
  {
    label: "Site builder",
    to: "/sitebuilder",
  },
];

async function logout() {
  await useLogout();
}
</script>

<template>
  <UHeader :links="links" :ui="{ container: 'max-w-full' }">
    <template #logo>
      CatnipDB <span class="font-light">Libres Chats de Bastide</span>
      <UBadge label="v0.1" variant="subtle" class="mb-0.5" />
    </template>

    <template #right>
      <UTooltip text="Log out">
        <UButton
          color="white"
          icon="i-heroicons-user"
          variant="ghost"
          @click="logout"
        />
      </UTooltip>
      <UColorModeButton />
    </template>
  </UHeader>

  <UMain>
    <NuxtPage />
  </UMain>

  <UFooter>
    <template #left> Copyright © {{ new Date().getFullYear() }} </template>
  </UFooter>
</template>
