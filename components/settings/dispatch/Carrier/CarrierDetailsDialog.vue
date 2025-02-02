<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Carrier Details #{{ carrier.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="font-weight-bold">Carrier Details</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">Name</v-col>
                  <v-col cols="12" md="6">{{ carrier.name }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Type</v-col>
                  <v-col cols="12" md="6">{{ carrier.carrier_type }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">MC Number</v-col>
                  <v-col cols="12" md="6">{{ carrier.mc_number }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">DOT Number</v-col>
                  <v-col cols="12" md="6">{{ carrier.dot_number }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Status</v-col>
                  <v-col cols="12" md="6">
                    <v-chip density="compact" variant="flat" :color="getStatusColor(carrier.status)">
                      {{ carrier.status }}
                    </v-chip>
                  </v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12">
                    <v-textarea class="mt-3" variant="outlined" flat density="compact" v-model="carrier.notes" label="Notes" readonly></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="font-weight-bold">Address</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">Phone</v-col>
                  <v-col cols="12" md="6">{{ carrier.phone }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Fax</v-col>
                  <v-col cols="12" md="6">{{ carrier.fax }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Email</v-col>
                  <v-col cols="12" md="6">{{ carrier.email }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Address</v-col>
                  <v-col cols="12" md="6">{{ carrier.address_line_1 }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">City</v-col>
                  <v-col cols="12" md="6">{{ carrier.city }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">State</v-col>
                  <v-col cols="12" md="6">{{ carrier.state }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Zip Code</v-col>
                  <v-col cols="12" md="6">{{ carrier.zip_code }}</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeModal">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  carrier: {
    type: Object as PropType<any>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const closeModal = () => {
  emit('update:modelValue', false);
};

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'primary';
    case 'Inactive':
      return 'secondary';
    default:
      return 'grey';
  }
};
</script>