<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Supplier #{{ supplier.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="font-weight-bold text-primary">Supplier Details</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">Name</v-col>
                      <v-col cols="12" md="6">{{ supplier.name ? supplier.name : "N/A" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Phone Number</v-col>
                      <v-col cols="12" md="6">{{ supplier.phone ? supplier.phone : "N/A" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">address</v-col>
                      <v-col cols="12" md="6">{{ supplier.address ? supplier.address : "N/A" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Location</v-col>
                      <v-col cols="12" md="6">{{ supplier.location ? supplier.location : "N/A" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Parts/Supplies Provided</v-col>
                      <v-col cols="12" md="6">{{ supplier.parts_supplied ? supplier.parts_supplied : "N/A" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">country</v-col>
                      <v-col cols="12" md="6">{{ supplier.country }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">
                        <span  style="cursor: pointer; border-bottom: 1px dotted;">Charging Vendor</span>
                      </v-col>
                      <v-col cols="12" md="6" class="text-primary">{{ supplier.classification?.charging ? "Yes" : "No" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">
                        <span  style="cursor: pointer; border-bottom: 1px dotted;">Fuel Vendor</span>
                      </v-col>
                      <v-col cols="12" md="6" class="text-primary">{{ supplier.classification?.fuel ? "Yes" : "No" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">
                        <span  style="cursor: pointer; border-bottom: 1px dotted;">Service Vendor</span> 
                      </v-col>
                      <v-col cols="12" md="6" class="text-primary">{{ supplier.classification?.service ? "Yes" : "No" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">
                        <span  style="cursor: pointer; border-bottom: 1px dotted;">Vehicle Vendor</span>
                      </v-col>
                      <v-col cols="12" md="6" class="text-primary">{{ supplier.classification?.vehicle ? "Yes" : "No" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">
                        <span  style="cursor: pointer; border-bottom: 1px dotted;">Parts Vendor</span>
                      </v-col>
                      <v-col cols="12" md="6" class="text-primary">{{ supplier.classification?.parts ? "Yes" : "No" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Notes</v-col>
                      <v-col cols="12" md="6">{{ supplier.notes ? supplier.notes : "N/A" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="font-weight-bold text-primary">Contact Informations</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">Contact name</v-col>
                  <v-col cols="12" md="6">
                    {{ supplier.contact_information?.name ? supplier.contact_information?.name : "N/A" }}
                  </v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Contact Email</v-col>
                  <v-col cols="12" md="6">
                    {{ supplier.contact_information?.email ? supplier.contact_information?.email : "N/A" }}
                  </v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Contact phone</v-col>
                  <v-col cols="12" md="6">
                    {{ supplier.contact_information?.phone ? supplier.contact_information?.phone : "N/A" }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type { Supplier } from '@/types/maintenance/supplierTypes';

const props = defineProps({
  modelValue: Boolean,
  supplier: {
    type: Object as any,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close']);

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};
</script>