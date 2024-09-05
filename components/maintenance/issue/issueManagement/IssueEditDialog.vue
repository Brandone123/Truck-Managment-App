<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="issueFormForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="font-weight-bold">Details</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-autocomplete variant="outlined" flat density="compact" v-model="localIssue.asset_name"
                            label="Select Asset" :items="assetList" item-title="name" item-value="name"
                            :rules="[validation.required]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localIssue.reported_date"
                            label="Reported Date" type="datetime-local" :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localIssue.meter"
                            label="Primary Meter (mi)" type="number" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localIssue.due_meter"
                            label="Primary Meter Due (mi)" type="number" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-autocomplete variant="outlined" flat density="compact" v-model="localIssue.reported_by"
                            :items="technicians" item-title="full_name" item-value="user_id" label="Reported By"
                            :rules="[validation.required]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" v-model="localIssue.priority"
                            :items="priorities" label="Priority" item-value="value" item-title="text"
                            :rules="[validation.required]"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" v-model="localIssue.source"
                            :items="sources" label="Source" item-value="value" item-title="text"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" v-model="localIssue.status"
                            :items="statuses" label="Status" item-value="value" item-title="text"></v-select>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <v-card class="mt-3">
                    <v-card-title class="font-weight-bold">Assignement</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-autocomplete v-model="localIssue.assigned_to" :disabled="isUpdating" :items="technicians"
                            color="blue-grey-lighten-2" item-title="full_name" item-value="user_id"
                            label="Assign Technician" chips closable-chips multiple density="compact"
                            variant="outlined">
                            <template v-slot:chip="{ props, item }">
                              <v-chip v-bind="props" :prepend-avatar="getAvatarIcon(item.raw.full_name, 24, 18)"
                                :text="item.raw.full_name"></v-chip>
                            </template>

                            <template v-slot:item="{ props, item }">
                              <v-list-item v-bind="props" :prepend-avatar="getAvatarIcon(item.raw.full_name, 32, 24)"
                                :subtitle="item.raw.job_title" :title="item.raw.full_name"></v-list-item>
                            </template>
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-autocomplete v-model="localIssue.watchers" :disabled="isUpdating" :items="technicians"
                            color="blue-grey-lighten-2" item-title="full_name" item-value="user_id" label="Add Watchers"
                            chips closable-chips multiple density="compact" variant="outlined">
                            <template v-slot:chip="{ props, item }">
                              <v-chip v-bind="props" :prepend-avatar="getAvatarIcon(item.raw.full_name, 24, 18)"
                                :text="item.raw.full_name"></v-chip>
                            </template>

                            <template v-slot:item="{ props, item }">
                              <v-list-item v-bind="props" :prepend-avatar="getAvatarIcon(item.raw.full_name, 32, 24)"
                                :subtitle="item.raw.job_title" :title="item.raw.full_name"></v-list-item>
                            </template>
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="font-weight-bold">Overdue Settings</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="8">
                      <v-text-field variant="outlined" flat density="compact" v-model="localIssue.due_date"
                        label="Due Date" type="date" required></v-text-field>
                      <span>(optional) Considered overdue after this date</span>
                    </v-col>

                  </v-row>
                </v-card-text>

              </v-card>

              <v-card class="mt-3">
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea variant="outlined" flat density="compact" v-model="localIssue.summary" label="Summary"
                        :rules="[validation.required]"></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea variant="outlined" flat density="compact" v-model="localIssue.description"
                        label="Description" required></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-card>
                <v-card-title class="font-weight-bold">Photos</v-card-title>
                <v-card-text>
                  <v-file-input v-model="localIssue.photos" :show-size="1000" color="primary" label="Pick An Photos"
                    placeholder="Select your photo" prepend-icon="mdi-camera" variant="outlined" density="compact"
                    counter multiple accept="image/png, image/jpeg, image/jpg, image/bmp">
                    <template v-slot:selection="{ fileNames }">
                      <template v-for="(fileName, index) in fileNames" :key="index">
                        <v-chip v-if="index < 2" class="me-2" color="primary" size="small" label>
                          {{ fileName }}
                        </v-chip>

                        <span v-else-if="index === 2 && localIssue.photos"
                          class="text-overline text-grey-darken-3 mx-2">
                          +{{ localIssue.photos.length - 2 }} File(s)
                        </span>
                      </template>
                    </template>
                  </v-file-input>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6">
              <v-card>
                <v-card-title class="font-weight-bold">Document</v-card-title>
                <v-card-text>
                  <v-file-input v-model="localIssue.documents" :show-size="1000" color="primary"
                    label="Upload A Document" placeholder="Select your document" prepend-icon="mdi-paperclip"
                    variant="outlined" density="compact" counter multiple>
                    <template v-slot:selection="{ documentsName }">
                      <template v-for="(document, index) in documentsName" :key="index">
                        <v-chip v-if="index < 2" class="me-2" color="primary" size="small" label>
                          {{ document }}
                        </v-chip>
                        <span v-else-if="index === 2 && localIssue.documents"
                          class="text-overline text-grey-darken-3 mx-2">
                          +{{ localIssue.documents.length - 2 }} File(s)
                        </span>
                      </template>
                    </template>
                  </v-file-input>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="saveIssue">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { Issues } from '@/types/maintenance/issue';
import { useValidation } from '~/composables/formValidation';
import { useRouter } from 'vue-router';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  vehicleId: {
    type: Number,
    required: true,
  },
  issue: {
    type: Object as PropType<Partial<Issues>>,
    required: true,
  },
});

const authStore = useAuthStore()

const router = useRouter();
const validation = useValidation();
const emit = defineEmits(['update:modelValue', 'close', 'save']);
const issueFormForm = ref<HTMLFormElement | null>(null)

const localIssue = ref<Partial<Issues>>(JSON.parse(JSON.stringify(props.issue || { photos: [] })));

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList)

const step = ref(1);
const { modelValue, issue } = toRefs(props);

// onMounted(() => {
//   assetStore.fetchAssets();
//   techniciansStore.fetchTechnicians();
// })

watch([modelValue, issue], ([newModelValue, newIssue]) => {
  if (newModelValue === false) {
    resetForm();
  }

  if (newIssue) {
    localIssue.value = { ...newIssue };
  }
})

const isUpdating = ref(false)
const timeout = ref(null)

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

const title = computed(() => (props.issue && props.issue.id ? 'Edit Issue' : 'Create Issue'));

const validateForm1 = async () => {
  let formStatus = await issueFormForm.value?.validate()
  return formStatus.valid ? true : false
}

const nextWindow = async () => {
  switch (step.value) {
    case 1:
      let valid = await validateForm1()
      if (valid) {
        step.value = 2
      }
      break
    default:
      //do nothing
      break;
  }
}

function convertFilesToBlobs(files: File[]): Blob[] {
  return files.map((file) => new Blob([file]));
}

const saveIssue = async () => {
  let validForm1 = await validateForm1()
  if (!validForm1) {
    return;
  }

  emit('save', { ...localIssue.value, photos: localIssue.value.photos?.map((photo) => photo.name), documents: localIssue.value.documents?.map((document) => document.name) });
  emit('update:modelValue', false);
  emit('close');
};

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const sources = [
  { text: 'Third-Party System', value: 'third-party system' },
  { text: 'Samsara DVIR', value: 'samsara dvir' },
  { text: 'Manual Input', value: 'manual input' },
];
const priorities = [
  { text: 'No Priority', value: 'no priority' },
  { text: 'Low', value: 'low' },
  { text: 'Medium', value: 'medium' },
  { text: 'High', value: 'high' }
];
const statuses = [
  { text: 'Open', value: 'open' },
  { text: 'Resolved', value: 'resolved' },
  { text: 'Closed', value: 'closed' },
  { text: 'Overdue', value: 'overdue' }
];

const user = [{ label: authStore.user?.name, value: authStore.user?.id }]

const resetForm = () => {
  step.value = 1
  localIssue.value = {} as Partial<Issues>
}

const getVehicleName = (vehicleId: any) => {
  const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleId)
  return vehicleName ? vehicleName.name : ''
}

// const getUserName = (userId: any) => {
//   const useName = users.value.find((user) => user.id === userId)
//   return useName ? useName.name : ''
// }

watch(() => props.modelValue, (newValue) => {
  if (router.currentRoute.value.path === '/maintenance/FailureManagement') {
    localIssue.value.asset_name = getVehicleName(props.vehicleId)
  }
  if (router.currentRoute.value.path === '/maintenance/FaultManagement') {
    localIssue.value.asset_name = getVehicleName(props.vehicleId)
  }
  if (router.currentRoute.value.path === '/maintenance/RecallManagement') {
    localIssue.value.asset_name = getVehicleName(props.vehicleId)
  }
  if (router.currentRoute.value.path === '/maintenance/WorkOrders') {
    if (props.vehicleId) {
      localIssue.value.asset_name = getVehicleName(props.vehicleId)
    }
  }
  if (title.value === 'Create Issue') {
    localIssue.value.reported_date = new Date().toISOString().slice(0, 16).replace('T', ' ');
    localIssue.value.status = 'Open'
    localIssue.value.source = 'Manual Input'
    localIssue.value.priority = 'No Priority'
  }
})
</script>