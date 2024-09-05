<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="supplierForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="text-primary">Details</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="Name" v-model="localSupplier.name"
                        :rules="[validation.required]"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="Phone Number"
                        v-model="localSupplier.phone" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="Website" v-model="localSupplier.website"
                        required></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="Address" v-model="localSupplier.address"
                        required></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="Address Line 2"
                        v-model="localSupplier.address_line2" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="City" v-model="localSupplier.city"
                        required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="State/Province/Region"
                        v-model="localSupplier.state" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="Zip/Postal Code"
                        v-model="localSupplier.zip" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="Country" v-model="localSupplier.country"
                        required></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-textarea variant="outlined" density="compact" label="Notes"
                        v-model="localSupplier.notes"></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-card class="mt-2">
                <v-card-title class="text-primary">Watchers</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-autocomplete v-model="localSupplier.watchers" :disabled="isUpdating" :items="technicians" color="blue-grey-lighten-2"
                        item-title="full_name" item-value="user_id" label="Add Watchers" chips closable-chips multiple density="compact"
                        variant="outlined">
                        <template v-slot:chip="{ props, item }">
                          <v-chip v-bind="props" :prepend-avatar="getAvatarIcon(item.raw.full_name, 24, 18)" :text="item.raw.full_name"></v-chip>
                        </template>

                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props" :prepend-avatar="getAvatarIcon(item.raw.full_name, 32, 24)" :subtitle="item.raw.job_title"
                            :title="item.raw.full_name"></v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="text-primary">Contact Person</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" class="pb-0">
                          <v-text-field variant="outlined" density="compact" label="Contact Name"
                            v-model="localSupplier.contact_information.name"
                            :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                          <v-text-field variant="outlined" density="compact" label="Phone"
                            v-model="localSupplier.contact_information.phone"
                            :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                          <v-text-field variant="outlined" density="compact" label="Email"
                            v-model="localSupplier.contact_information.email"
                            :rules="[validation.required]"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12">
                  <v-card>
                    <v-card-title class="text-primary">Classification</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" class="pb-0">
                          <v-checkbox hide-details color="primary" variant="outlined" density="compact" label="Charging"
                            v-model="localSupplier.classification.charging">
                          </v-checkbox>
                          <div class="ml-7 text-caption">Charging classification allows vendor to be listed on Charging
                            Entries</div>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                          <v-checkbox  hide-details color="primary" variant="outlined" density="compact" label="Fuel"
                            v-model="localSupplier.classification.fuel"></v-checkbox>
                          <div class="ml-7 text-caption">Fuel classification allows vendor to be listed on Fuel Entries</div>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                          <v-checkbox hide-details color="primary" variant="outlined" density="compact" label="Parts"
                            v-model="localSupplier.classification.parts"></v-checkbox>
                          <div class="ml-7 text-caption">Parts classification allows vendor to be listed on Parts and Purchase Orders</div>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                          <v-checkbox hide-details color="primary" variant="outlined" density="compact" label="Service"
                            v-model="localSupplier.classification.service"></v-checkbox>
                          <div class="ml-7 text-caption">Service classification allows vendor to be listed on Service Entries, Work Orders, and Warranties</div>
                        </v-col>
                        <v-col hide-details cols="12" class="pb-0">
                          <v-checkbox color="primary" variant="outlined" density="compact" label="Vehicle"
                            v-model="localSupplier.classification.vehicle"></v-checkbox>
                          <div class="ml-7 text-caption">Vehicle classification allows vendor to be listed on Vehicle Acquisitions</div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="saveSupplier">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { Supplier } from '@/types/maintenance/supplierTypes';
import { useValidation } from '~/composables/formValidation';

const props = defineProps({
  modelValue: Boolean,
  supplier: {
    type: Object as any,
    default: () => ({
      id: null,
      name: '',
      location: '',
      parts_supplied: '',
      phone: '',
      website: '',
      address: '',
      address_line2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      contact_information: {
        name: '',
        email: '',
        phone: '',
      },
      classification: {},
      notes: '',
      watchers: []
    })
  },
});

const validation = useValidation();
const emit = defineEmits(['update:modelValue', 'close', 'save']);
const supplierForm = ref<HTMLFormElement | null>(null)

const localSupplier = ref(JSON.parse(JSON.stringify(props.supplier)));

const title = computed(() => (props.supplier && props.supplier.id ? 'Edit Supplier' : 'Add Supplier'));

const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList)

const isUpdating = ref(false)

function getAvatarIcon(label: any, size: any, circleSize: any) {
      // Générer les initiales à partir du label
  const words = label.split(' ');
  const initials = words.map((word: string) => word.charAt(0).toUpperCase());

  // Créer un canvas et un contexte 2D
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  // Générer une couleur unique pour l'avatar
  const colorHash = label.split('').reduce((acc: number, char: string) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
  const color = `#${(colorHash & 0xFFFFFF).toString(16).padStart(6, '0')}`;

  // Dessiner le fond avec la couleur unique
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, circleSize / 2, 0, 2 * Math.PI);
  ctx.fill();

  // Dessiner les initiales en blanc
  ctx.font = `${(circleSize * 0.6)}px Arial`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials.slice(0, 2).join(''), size / 2, size / 2);

  return canvas.toDataURL();

}

onMounted(() => {
  employeeStore.fetchEmployeeList();
})

watch(
  () => props.supplier,
  (newSupplier) => {
    localSupplier.value = JSON.parse(JSON.stringify(newSupplier));
  }
);

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const saveSupplier = async () => {
  const formStatus = await supplierForm.value?.validate() || false

  if (!formStatus.valid) {
    return
  }

  emit('save', localSupplier.value);
  emit('update:modelValue', false);
  emit('close');
};
</script>