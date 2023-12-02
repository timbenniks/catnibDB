<script setup lang="ts">
//navigateTo(`/cats/`);\

const data = [
  {
    Date: "2023-11-09",
    Weight: 3200,
  },
  {
    Date: "2023-11-12",
    Weight: 4300,
  },
];
</script>

<template>
  <weight-chart :data="data" />
</template>
