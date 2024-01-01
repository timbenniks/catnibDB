<script setup lang="ts">
const links = [
  {
    label: "Dashboard",
    to: "/",
  },
  {
    label: "Cats",
    to: "/cats",
    children: [
      {
        label: "Cat overview",
        to: "/Cats",
        icon: "i-heroicons-list-bullet",
        description: "See all cats",
      },
      {
        label: "Add Cat",
        to: "/cats/new",
        icon: "i-heroicons-plus",
        description: "Add a new cat",
      },
    ],
  },
  {
    label: "Foster Families",
    to: "/families",
    children: [
      {
        label: "Families overview",
        to: "/families",
        icon: "i-heroicons-list-bullet",
        description: "See all families",
      },
      {
        label: "Add Family",
        to: "/families/new",
        icon: "i-heroicons-plus",
        description: "Add a new family",
      },
    ],
  },
  {
    label: "Site builder",
    to: "/sitebuilder",
    children: [
      {
        label: "Pages",
        to: "/sitebuilder/pages",
        icon: "i-heroicons-clipboard-document-list",
        description: "Edit your pages here",
      },
      {
        label: "Components",
        to: "/sitebuilder/components",
        icon: "i-heroicons-code-bracket-square",
        description: "Manage component config",
      },
      {
        label: "Asset manager",
        to: "/sitebuilder/media",
        icon: "i-heroicons-photo",
        description: "Manage media assets",
      },
    ],
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
</template>
