<template>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Daily Yard Check Reports</v-card-title>
          <v-card-text>
            <v-btn color="primary" @click="generateReport">Generate Report</v-btn>
            <v-list dense>
              <v-list-item
                v-for="report in reports"
                :key="report.id"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ report.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ report.date }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="viewReport(report.id)">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </template>
  
  <script>
  export default {
    name: 'DailyYardCheckReports',
    data() {
      return {
        reports: [
          { id: 1, title: 'Yard Report - April 29, 2024', date: 'April 29, 2024' },
          { id: 2, title: 'Yard Report - April 28, 2024', date: 'April 28, 2024' },
          // Add more reports as needed
        ],
      };
    },
    methods: {
      generateReport() {
        // This method would ideally call a backend service to generate a new report
        console.log('Generating report...');
      },
      viewReport(id) {
        // This method would open a detailed view of the selected report
        console.log('Viewing report with ID:', id);
      },
    },
  };
  </script>
  