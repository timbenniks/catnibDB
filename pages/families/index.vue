<script setup lang="ts">
const families = await useFamilies();

const links = [
  {
    label: "All Families",
    icon: "i-heroicons-list-bullet",
    to: "/families",
  },
  {
    label: "Add new family",
    icon: "i-heroicons-plus",
    to: "/families/new",
  },
];

const columns = [
  {
    key: "name",
    label: "Nom",
  },
  {
    key: "family_type",
    label: "Type de famille",
  },
  {
    key: "address",
    label: "Addresse",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "phone",
    label: "Portable",
  },
];

const selectedColumns = ref([...columns]);

function mapToTableRows(items: any) {
  return items.map((item: any) => {
    return {
      id: item.id,
      name: item.name ? item.name : "-",
      family_type: item.family_type ? item.family_type : "-",
      birth_date: item.birth_date ? item.birth_date : "-",
      address: item.address ? item.address : "-",
      email: item.email ? item.email : "-",
      phone: item.phone ? item.phone : "-",
      class: "bg-gray-50 dark:bg-gray-950",
    };
  });
}

function select(row: any) {
  navigateTo(`/families/${row.id}`);
}
</script>

<template>
  <UPage :ui="{ wrapper: 'max-w-full', left: 'pl-8' }">
    <template #left>
      <UAside>
        <UPageLinks :links="links" />
      </UAside>
    </template>
    <UPageBody>
      <UTable
        :columns="selectedColumns"
        :rows="mapToTableRows(families)"
        @select="select"
      />
    </UPageBody>
  </UPage>
</template>
