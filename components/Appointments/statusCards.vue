<template>
    <div class="status-card-container">
      <div class="status-chip-container">
        <v-chip :color="statusColor" class="status-chip" flat>
          {{ statusText }}
          <v-icon right>mdi-chevron-right</v-icon>
        </v-chip>
      </div>
      <div class="status-card-header">
        <h6>Load</h6>
        <h4>123-456-789</h4>
      </div>
      <div class="status-card-body">
        <h6>Carrier</h6>
        <h4>A109201</h4>
      </div>
    </div>
  </template>
  
  <style scoped>
  .status-card-container {
    /* Styles to make the container fit well in a table cell */
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 8px;
    background-color: #a4c3e7;
    border-left: 4px solid #3d80cc;
    position: relative;
  }
  
  .status-card-header,
  .status-card-body {
    margin-bottom: 4px;
  }
  
  .status-chip-container {
    position: absolute;
    top: 0;
    right: 0;
  }
  .status-chip {
    margin-top: 5px;
    margin-right: 10px;
    border-radius: 3px;
  }
  /* v-chip{
      color: white;
    } */
  </style>
  
  <script>
  export default {
    props: {
      //   load: String,
      //   carrier: String,
      status: String,
    },
    computed: {
      statusColor() {
        switch (this.status) {
          case "late":
            return "red";
          case "on-time":
            return "green";
          case "early":
            return "purple";
          default:
            return "grey";
        }
      },
      statusText() {
        switch (this.status) {
          case "late":
            return "2 hrs late";
          case "on-time":
            return "on time";
          case "early":
            return "Early";
          default:
            return "";
        }
      },
    },
  };
  </script>
  
  <!-- <template>
    <v-row no-gutters>
      <v-col class="blue-card"></v-col>
      <v-col>
        <v-card class="status-card" flat>
          <h6>Load</h6>
          <h4>123-456-789</h4>
          <h6>Carrier</h6>
          <h4>123-456-789</h4>
        </v-card>
      </v-col>
      <v-col class="red-label">
        <v-chip :color="statusColor" class="status-chip" flat>
          {{statusText}}
          <v-icon right>mdi-chevron-right</v-icon>
        </v-chip>
      </v-col>
    </v-row>
  </template>
  
  <script>
  export default {
    data(){
      return{
          status: 'early'
      };
    },
    computed:{
      statusColor(){
      switch (this.status){
          case 'late':
              return 'red';
          case 'on-time':
              return 'green';
          case 'early':
              return 'purple';
          default:
              return 'grey';
      }
    },
    statusText(){
      switch(this.status){
          case 'late':
              return '2 hrs late';
          case 'on-time':
              return 'on time';
          case 'early':
              return 'Early';
          default:
              return ' '
      }
    }
    }
  };
  </script> -->
  