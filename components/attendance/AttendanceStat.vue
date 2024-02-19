<template>
     <client-only>
      <apexchart
      type="bar"
      height="300px"
      width="700px"
      :options="chartOptions"
      :series="chartData"
      :data="chartData"
      >
      </apexchart>
    </client-only>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

const chartOptions = {
        chart: {
          type: 'bar',
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
            show: true,
            position: "top",
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Exemple de libellés pour les mois
        },
        yaxis: {
          title: {
            text: 'Number of occurrences', // Titre de l'axe des y
          },
        },
        colors: ['#3f51b5', '#ff5722'], // Couleurs des barres
      };

      const chartData = [
        {
          name: 'Absent',
          data: [5, 3, 2, 4, 6, 1, 5, 9, 4, 7, 8, 10], // Exemple de données pour les absences, vous devez fournir les données réelles ici
        },
        {
          name: 'Early Clock Out',
          data: [2, 1, 3, 2, 4, 2, 6, 7, 2, 1, 3, 1], // Exemple de données pour les départs anticipés, vous devez fournir les données réelles ici
        },
      ];
</script>