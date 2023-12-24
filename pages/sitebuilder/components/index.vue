<script setup lang="ts">
const components = await useComponents();

const links = [
  {
    label: "Pages",
    icon: "i-heroicons-clipboard-document-list",
    to: "/sitebuilder/pages",
  },
  {
    label: "Components",
    icon: "i-heroicons-code-bracket-square",
    to: "/sitebuilder/components",
  },
];

const columns = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];

const selectedColumns = ref([...columns]);

function mapToTableRows(items: any) {
  return items.map((item: any) => {
    return {
      id: item.id,
      title: item.title,
      created_at: new Date(item.created_at).toLocaleString("fr-FR"),
      class: "bg-gray-50 dark:bg-gray-950",
    };
  });
}

function select(row: any) {
  navigateTo(`/sitebuilder/components/${row.id}`);
}
</script>

<template>
  <UPage class="max-w-7xl mx-auto">
    <UPageBody>
      <UButton
        icon="i-heroicons-pencil-square"
        size="sm"
        color="primary"
        variant="solid"
        to="/sitebuilder/components/new"
        class="mb-8"
      >
        New Component
      </UButton>

      <UTable
        :columns="selectedColumns"
        :rows="mapToTableRows(components)"
        @select="select"
      />
    </UPageBody>
  </UPage>
</template>
