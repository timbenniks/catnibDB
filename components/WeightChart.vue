<script setup>
import { LineChart } from "vue-chart-3";

const props = defineProps(["data"]);

function getLabelsForData() {
  return props.data.map((d) => {
    return new Date(d.Date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  });
}

function getDataForData() {
  return props.data.map((d) => {
    return d.Weight;
  });
}

const chartRef = ref();

const chartData = computed(() => ({
  labels: getLabelsForData(),
  datasets: [
    {
      data: getDataForData(),
      label: "Weight",
    },
  ],
}));

const options = ref({
  plugins: {
    legend: {
      display: false,
    },
  },
});
</script>
<template>
  <LineChart ref="chartRef" :chartData="chartData" :options="options" />
</template>
