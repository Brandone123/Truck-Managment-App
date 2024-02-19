<style scoped>
.heading {
  color: #1767c0;
  font-size: 20px;
  text-decoration: solid;
}
.date-fixer {
  margin-left: 93%;
}
.calendar {
  font-size: small;
  font-weight: bold;
}
.date-container {
  margin-top: 5%;
}
.v-card-text {
  padding: 0%;
}
.time {
  font-size: larger;
  font-weight: bold;
  margin-bottom: 80px;
}
.m-headers {
  font-weight: bolder;
  display: flex;
}
v-card {
  width: fit-content;
}
.v-data-table :deep() thead{
  /* z-index: 5; */
  position: relative;
  overflow: visible;
  margin-bottom: 20px;
}
.v-data-table :deep() tbody tr:first-child{
  padding-top: 20px;
}
/* .v-data-table .v-data-table__wrapper table {
    border-collapse: separate;
    border-spacing: 0 1rem;
} */
</style>
<template>
  <div text-h6 class="heading">Apointment Manager</div>

  <div class="date-container">
    <div class="date-fixer">
      <span class="mdi mdi-chevron-left"></span>
      <span class="mdi mdi-calendar calendar"> Today</span>
      <span class="mdi mdi-chevron-right"></span>
    </div>
    <hr />
  </div>
  
  <v-row>
    <v-col>
      <v-container>
        <v-select label="Select Date and Time"> </v-select>
      </v-container>
    </v-col>
    <v-col>
      <v-container>
        <v-select label="Select Carrier"> </v-select>
      </v-container>
    </v-col>
    <v-col>
      <v-container>
        <v-card class="mx-auto" color="grey-lighten-3" max-width="400">
          <v-card-text>
            <v-text-field
              :loading="loading"
              density="compact"
              variant="solo"
              label="Search For load numbers"
              append-inner-icon="mdi-magnify"
              single-line
              hide-details
              @click:append-inner="onClick"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-container>
    </v-col>
  </v-row>

  <v-data-table-virtual
    :headers="headers"
    :items="appointments"
    item-key="id"
    class="elevation-1"
  >
  <template v-slot:headers="{columns}">
    <tr>
    <th v-for="(header,i) in columns" :key="i" class="text-center">
      <v-card flat class="mt-n5" style="position: relative;">
        {{ header.title }}
      </v-card>
    </th>
  </tr>
  </template>
    <template v-slot:item.time="{ item }">
      <div>
        <div class="time">{{ item.time }}</div>
        <div>{{ item.localDelivery.confirmed }}</div>
      </div>
    </template>

    <template v-slot:item.localDelivery="{ item }">
      <status-card :status="item.localDelivery.status" />
    </template>

    <template v-slot:item.freight="{ item }">
      <status-card :status="item.freight.status" />
    </template>

    <template v-slot:item.overnight="{ item }">
      <status-card :status="item.overnight.status" v-if="item.overnight.display == false?false:true"/>
    </template>

    <template v-slot:item.nothing="{ item }">
      <status-card :status="item.nothing.status" />
    </template>
  </v-data-table-virtual>
</template>

<script>
import StatusCard from "@/components/yardCheck/statusCards.vue";

export default {
  components: {
    StatusCard,
  },
  data() {
    return {
      headers: [
        { title: "", key: "time", sortable: false, align: "start" },
        { title: "Local Delivery", key: "localDelivery" },
        { title: "Freight", key: "freight" },
        { title: "Overnight", key: "overnight" },
        { title: " ", key: "nothing" },
      ],
      appointments: [
        {
          id: 1,
          time: "08:00 AM",
          localDelivery: { status: "late" },
          freight: { status: "on-time" },
          overnight: { status: "early", display:false },
          nothing: { status: "late" },
        },

        {
          id: 2,
          time: "09:00 AM",
          localDelivery: { status: "early" },
          freight: { status: "on-time" },
          overnight: { status: "on-time" },
          nothing: { status: "late" },
        },
        {
          id: 3,
          time: "10:00 AM",
          localDelivery: { status: "early" },
          freight: { status: "on-time" },
          overnight: { status: "early" },
          nothing: { status: "early" },
        },
        {
          id: 4,
          time: "11:00 AM",
          localDelivery: { status: "late" },
          freight: { status: "late" },
          overnight: { status: "" },
          nothing: { status: "on-time" },
        },
        {
          id: 5,
          time: "12:00 PM",
          localDelivery: { status: "early" },
          freight: { status: "on-time" },
          overnight: { status: "early" },
          nothing: { status: "early" },
        },
      ],
    };
  },
};
</script>
