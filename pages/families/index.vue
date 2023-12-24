<script setup lang="ts">
const families = await useFamilies();

const links = [
  {
    label: "Family Overview",
    icon: "i-heroicons-list-bullet",
    to: "/families",
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
  <UPage class="max-w-7xl mx-auto">
    <UPageBody>
      <UButton
        icon="i-heroicons-pencil-square"
        size="sm"
        color="primary"
        variant="solid"
        to="/families/new"
        class="mb-8"
      >
        New Family
      </UButton>
      <UTable
        :columns="selectedColumns"
        :rows="mapToTableRows(families)"
        @select="select"
      />
    </UPageBody>
  </UPage>
</template>
