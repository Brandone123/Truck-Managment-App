<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="maintenanceForm">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="localMaintenance.asset_name" label="Asset Name" variant="solo" flat
                    density="compact" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select v-model="localMaintenance.maintenance_type" :items="['Routine', 'Repair', 'Inspection']"
                    label="Maintenance Type" variant="solo" flat density="compact" required></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="localMaintenance.date" label="Date" type="date" variant="solo" flat
                    density="compact" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="localMaintenance.technician" label="Technician" variant="solo" flat
                    density="compact" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="localMaintenance.description" label="Description of Work" variant="solo" flat
                    density="compact" required></v-textarea>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="2">
              <h3>Part Used</h3>
              <v-row v-for="(part, index) in localMaintenance.Part_used" :key="index">
                <v-col cols="3">
                  <v-text-field v-model="part.name" label="Part Name" variant="solo" flat
                    density="compact"></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field v-model="part.quantity" label="Quantity" variant="solo" flat density="compact"
                    type="number"></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field v-model="part.cost" label="Cost" variant="solo" flat density="compact"
                    type="number"></v-text-field>
                </v-col>
                <v-col cols="3" class="justify-center text-center">
                  <v-btn dark color="red" class="text-none text-capitalize" @click="removeItem(index)">
                    Remove Part <v-icon class="ml-1">mdi-minus</v-icon>
                  </v-btn>
                </v-col>
                <v-divider></v-divider>
              </v-row>
              <v-row class="justify-center mb-5 mt-5">
                <v-btn @click="addPart" dark color="primary" class="text-none text-capitalize">
                  Add Part <v-icon class="ml-1">mdi-plus</v-icon>
                </v-btn>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="localMaintenance.labor_cost" label="Labor Cost" variant="solo" flat
                    density="compact" type="number" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="localMaintenance.total_cost" label="Total Cost" variant="solo" flat
                    density="compact" type="number" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select v-model="localMaintenance.status" :items="['Completed', 'Pending', 'In Progress']"
                    label="Status" variant="solo" flat density="compact" required></v-select>
                </v-col>
              </v-row>

            </v-window-item>
          </v-window>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step > 1" color="primary" @click="step -= 1"><v-icon>mdi-chevron-left</v-icon>Back</v-btn>
        <v-btn v-if="step < 2" color="primary" @click="step += 1">Next<v-icon>mdi-chevron-right</v-icon></v-btn>
        <v-btn v-if="step == 2" color="primary" variant="text" @click="saveMaintenance">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  maintenance: {
    type: Object,
    default: () => ({
      asset_name: '',
      maintenance_type: '',
      date: '',
      technician: '',
      description: '',
      Part_used: [],
      labor_cost: 0,
      total_cost: 0,
      status: 'Pending',
    }),
  },
});

const emit = defineEmits(['update:modelValue', 'save']);

const localMaintenance = ref({ ...props.maintenance });

const step = ref(1)

watch(
  () => props.maintenance,
  (newMaintenance) => {
    localMaintenance.value = { ...newMaintenance };
  }
);

const title = computed(() => (props.maintenance && props.maintenance.id ? 'Edit Maintenance Record' : 'Add Maintenance Record'));

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
};

const addPart = () => {
  localMaintenance.value.Part_used.push({ name: '', quantity: 0, cost: 0 });
};

const removeItem = (index: number) => {
  localMaintenance.value.Part_used.splice(index, 1);
};

const updateTotals = () => {
  let subtotal = 0;

  localMaintenance.value.Part_used.forEach((item: any) => {
    let total = item.quantity * item.cost;
    subtotal += total
  });

  localMaintenance.value.total_cost = subtotal + localMaintenance.value.labor_cost;
}

const saveMaintenance = () => {
  emit('save', localMaintenance.value);
  emit('update:modelValue', false);
};

watch(() => localMaintenance.value.Part_used,
  updateTotals,
  { deep: true }
);

watch(() => localMaintenance.value.labor_cost,
  updateTotals,
  { deep: true }
);
</script>

<style scoped></style>