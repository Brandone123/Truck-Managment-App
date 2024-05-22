<script lang="ts">
import { ref, computed } from 'vue';

export default {
  props: {
    yard_space: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const { yard_space } = props;

    const dialog = ref(false);

    const title = computed(() => {
      return 'Yard Space Info';
    });

    return {
      yard_space,
      dialog,
      title,
    };
  },
};
</script>

<template>
  <v-dialog v-model="dialog" width="800px" scrollable>
    <template v-slot:activator="{ props }">
      <v-btn variant="text" color="primary" class="text-none px-1" v-bind="props">
        <span class="mr-2">
          {{ yard_space.id }}
        </span>
      </v-btn>
    </template>

    <v-card class="grey-background">
      <v-toolbar color="primary" :title="title" density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card class="px-5 py-5 mx-5 my-5">
        <section>
          <div>
            <strong class="ml-5">Yard Space ID:</strong> {{ yard_space.id }}
            <strong class="ml-5">Space Number:</strong> {{ yard_space.space_number }}
            <strong class="ml-5">Is Occupied ?:</strong> {{ yard_space.is_occupied }}
            <strong class="ml-5">Current Vehicule :</strong> {{ yard_space.current_vehicle_id }}
          </div>
        </section>
      </v-card>
    </v-card>
  </v-dialog>
</template>