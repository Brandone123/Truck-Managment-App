<template>
  <div
    class="status-card-container"
    :style="{ backgroundColor: backgroundColor }"
  >
    <v-dialog v-model="dialog" activator="parent" width="1024">
      <v-card>
        <div text-h6 class="bg-primary heading font-weight-bold text-uppercase">
          Load Details
        </div>
        <v-table fixed-header height="auto">
          <thead>
            <tr>
              <th class="text-left font-weight-black">Attribute</th>
              <th class="text-left font-weight-black">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in details" :key="item.attribute">
              <td>{{ item.attribute }}</td>
              <td>{{ item.value }}</td>
            </tr>
          </tbody>
        </v-table>
        <v-btn color="primary" class="mr-2 text-none" flat>
          <v-icon>mdi-file</v-icon>
          view
        </v-btn>
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="status-chip-container">
      <v-chip :color="statusColor" class="status-chip" variant="flat">
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
  border-left: 4px solid #3d80cc;
  position: relative;
}
.heading {
  color: #1767c0;
  font-size: 15px;
  text-align: center;
  text-transform: capitalize;
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
    backgroundColor() {
      switch (this.status) {
        case "late":
          return "#a4c3e7";
        case "on-time":
          return "#a4c3e7";
        case "early":
          return "#a4c3e7";
        default:
          return "#e7e7e7";
      }
    },
  },
  data() {
    return {
      dialog: false,
      details: [
        {
          attribute: "load Number",
          value: "123-456-789",
        },
        {
          attribute: "carrier",
          value: "A109201",
        },
        {
          attribute: "status",
          value: this.status,
        },
        {
          attribute: "mode",
          value: "road",
        },
        {
          attribute: "equipment",
          value: "books",
        },
        {
          attribute: "temperature",
          value: "40F",
        },
        {
          attribute: "weight",
          value: "40 pounds",
        },
        {
          attribute: "volume",
          value: "10",
        },
      ],
    };
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
