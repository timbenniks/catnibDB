<script setup lang="ts">
const pages = await usePages();

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
    key: "slug",
    label: "Slug",
  },
  {
    key: "status",
    label: "Status",
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
      slug: item.slug ? item.slug : "-",
      title: item.title ? item.title : "-",
      status: item.published ? "published" : "draft",
      created_at: new Date(item.created_at).toLocaleString("fr-FR"),
      class: "bg-gray-50 dark:bg-gray-950",
    };
  });
}

function select(row: any) {
  navigateTo(`/sitebuilder/pages/${row.id}`);
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
        to="/sitebuilder/pages/new"
        class="mb-8"
      >
        New Page
      </UButton>
      <UTable
        :columns="selectedColumns"
        :rows="mapToTableRows(pages)"
        @select="select"
      />
    </UPageBody>
  </UPage>
</template>
