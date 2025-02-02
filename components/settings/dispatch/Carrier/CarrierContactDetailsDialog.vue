<template>
    <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen scrollable>
      <v-card class="grey-background">
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Contact Details #{{ contact.id }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="font-weight-bold">Contact Information</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">Name</v-col>
                    <v-col cols="12" md="6">{{ contact.contact_name }}</v-col>
                  </v-row>
                  <v-divider class="my-3"></v-divider>
                  <v-row>
                    <v-col cols="12" md="6">Department</v-col>
                    <v-col cols="12" md="6">{{ contact.department }}</v-col>
                  </v-row>
                  <v-divider class="my-3"></v-divider>
                  <v-row>
                    <v-col cols="12" md="6">Carrier</v-col>
                    <v-col cols="12" md="6"><span class="text-primary">{{ carrierName }}</span></v-col>
                  </v-row>
                  <v-divider class="my-3"></v-divider>
                  <v-row>
                    <v-col cols="12" md="6">Email</v-col>
                    <v-col cols="12" md="6">{{ contact.email }}</v-col>
                  </v-row>
                  <v-divider class="my-3"></v-divider>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea class="mt-3" variant="outlined" flat density="compact" v-model="contact.notes" label="Notes" readonly></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
  
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="font-weight-bold">Phone Information</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">Direct Line</v-col>
                    <v-col cols="12" md="6">{{ contact.direct_line }}</v-col>
                  </v-row>
                  <v-divider class="my-3"></v-divider>
                  <v-row>
                    <v-col cols="12" md="6">Direct Fax</v-col>
                    <v-col cols="12" md="6">{{ contact.direct_fax }}</v-col>
                  </v-row>
                  <v-divider class="my-3"></v-divider>
                  <v-row>
                    <v-col cols="12" md="6">Alt Phone 1</v-col>
                    <v-col cols="12" md="6">{{ contact.alt_phone_1 }}</v-col>
                  </v-row>
                  <v-divider class="my-3"></v-divider>
                  <v-row>
                    <v-col cols="12" md="6">Alt Phone 2</v-col>
                    <v-col cols="12" md="6">{{ contact.alt_phone_2 }}</v-col>
                  </v-row>
                  <v-divider class="my-3"></v-divider>
                  <v-row>
                    <v-col cols="12" md="6">Extension</v-col>
                    <v-col cols="12" md="6">{{ contact.extension }}</v-col>
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
  import { ref, computed, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean,
    contact: {
      type: Object as PropType<any>,
      required: true,
    },
    carriers: {
      type: Array as PropType<any[]>,
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
  
  const carrierName = computed(() => {
    const carrier = props.carriers.find(c => c.id === props.contact.carrier_id);
    return carrier ? carrier.name : 'Unknown';
  });
  </script>