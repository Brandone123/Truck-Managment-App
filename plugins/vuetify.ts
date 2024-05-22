
import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
// import PerfectScrollbar from 'vue3-perfect-scrollbar';
// import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import 'vuetify/styles'
// import '@/scss/style.scss';
// import {
//   BlueTheme,
// } from "@/theme/LightTheme";

import {VCalendar} from 'vuetify/labs/VCalendar'
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components : {
      ...components,
      VCalendar,
    },
    directives,
    // theme: {
    //   defaultTheme: "BlueTheme",
    //   themes: {
    //     BlueTheme,
    //   },
    // },
  });
  nuxtApp.vueApp.use(vuetify);
  // nuxtApp.vueApp.use(PerfectScrollbar);
  // nuxtApp.vueApp.use(VueApexCharts);
  nuxtApp.vueApp.use(VueTablerIcons);
});

