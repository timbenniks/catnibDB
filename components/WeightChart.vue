<script setup>
import { LineChart } from "vue-chart-3";

const props = defineProps(["data"]);

const data1 = ref([3000, 4000, 6000, 7000]);
const doughnutRef = ref();

const testData = computed(() => ({
  labels: ["1 dec", "6 dec", "10 dec", "11 dec"],
  datasets: [
    {
      data: data1.value,
      label: "Weight",
    },
  ],
}));

const options = ref({
  responsive: true,
});
</script>
<template>
  <div>
    <pre>{{ data }}</pre>
    <LineChart ref="doughnutRef" :chartData="testData" :options="options" />
  </div>
</template>
