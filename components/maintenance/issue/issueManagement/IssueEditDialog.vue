<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
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
                          <SharedInputVehicleAutoCompleteInput variant="outlined" flat density="compact"
                            v-model="localIssue.asset_name" item-value="name" label="Select Vehicle"
                            :rules="[validation.required]" @selection="updateSelectedVehicle" />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localIssue.reported_date"
                            label="Reported Date" type="datetime-local" :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field :disabled="!localIssue.asset_name" variant="outlined" flat density="compact"
                            v-model="localIssue.meter" label="Primary Meter (mi)" type="number" required></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localIssue.due_meter"
                            label="Primary Meter Due (mi)" type="number" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <SharedInputEmployeeAutoCompleteInput :fetchData="false" variant="outlined" flat
                            density="compact" :disabled="isUpdating" label="Reported By"
                            v-model="localIssue.reported_by" :rules="[validation.required]" />
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
                    <v-card-title class="font-weight-bold">Assignment</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <SharedInputTechnicianNameAutoCompleteInput :fetchData="false" variant="outlined" flat
                            density="compact" label="Assign Technician" :disabled="isUpdating"
                            v-model="localIssue.assigned_to" :rules="[validation.required]"/>
                        </v-col>
                        <v-col cols="12">
                          <SharedInputEmployeeAutoCompleteInput :fetchData="false" variant="outlined" flat
                            density="compact" label="Add Watchers" :disabled="isUpdating" v-model="localIssue.watcher_ids"
                            multiple />
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
                        label="Description"></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-card>
                <v-card-title class="font-weight-bold d-flex">
                  Photos <span v-if="localIssue.photos">({{ localIssue.photos?.length
                    }})</span>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="addPhoto">
                    <v-icon>mdi-plus</v-icon>
                    <span class="ml-2" style="cursor: pointer;">Add Photos</span>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-list v-if="localIssue.photos?.length">
                    <template v-for="(photo, index) in localIssue.photos" :key="index">
                      <v-list-item>
                        <v-list-item-title>{{ photo.name }}</v-list-item-title>
                        <template v-slot:append>
                          <v-btn variant="text" size="small" color="error" icon="mdi-delete"
                            @click.stop="removePhoto(index)">
                          </v-btn>
                        </template>
                      </v-list-item>
                      <v-divider v-if="index + 1 < localIssue.photos.length"></v-divider>
                    </template>
                  </v-list>
                  <input ref="fileInput" type="file" multiple accept="image/*" @change="storeFile($event, 'photos')"
                    style="display: none;" />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6">
              <v-card>
                <v-card-title class="font-weight-bold d-flex">
                  Documents <span v-if="localIssue.documents">({{
                    localIssue.documents?.length
                  }})</span>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="addDocument">
                    <v-icon>mdi-plus</v-icon>
                    <span class="ml-2" style="cursor: pointer;">Add Documents</span>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-list v-if="localIssue.documents?.length">

                    <template v-for="(document, index) in localIssue.documents" :key="index">
                      <v-list-item>
                        <v-list-item-title>{{ document.name }}</v-list-item-title>
                        <template v-slot:append>
                          <v-btn variant="text" size="small" color="error" icon="mdi-delete"
                            @click.stop="removeDocument(index)">
                          </v-btn>
                        </template>
                      </v-list-item>
                      <v-divider v-if="index + 1 < localIssue.documents.length"></v-divider>
                    </template>
                  </v-list>
                  <input ref="documentfile" type="file" multiple accept="application/pdf"
                    @change="storeFile($event, 'documents')" style="display: none;" />

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
import { ref, computed, watch, onMounted } from 'vue';
import type { Issues } from '@/types/maintenance/issue';
import { useValidation } from '~/composables/formValidation';
import { useRouter } from 'vue-router';
import { isArray } from 'chart.js/helpers';
import type { Asset } from '~/types/maintenance/assetTypes';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  vehicleName: {
    type: String,
    required: true,
  },
  issue: {
    type: Object as PropType<Partial<Issues>>,
    required: true,
  },
});

const commonListStore = useMaintenanceCommonListStore()

onMounted(() => {
  commonListStore.fetchList('employees')
})

const authStore = useAuthStore()

const router = useRouter();
const validation = useValidation();
const emit = defineEmits(['update:modelValue', 'close', 'save']);
const issueFormForm = ref<HTMLFormElement | null>(null)

const mediaStore = useMediaStore()

const localIssue = ref<Partial<Issues>>(JSON.parse(JSON.stringify(props.issue || {})));

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList)

const step = ref(1);

const { modelValue, issue } = toRefs(props);


const fileInput = ref<HTMLInputElement | null>(null);


function addPhoto() {
  fileInput.value?.click();
}

function removePhoto(index: number) {
  localIssue.value.photos?.splice(index, 1);
}

async function storeFile(event: any, location: string) {
  const files = (event.target as HTMLFormElement).files as FileList;

  if (files.length === 0) {
    return;
  }

  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const { data, error } = await mediaStore.uploadFile(file);
    if (data) {
      switch (location) {
        case 'photos':
          if (!Array.isArray(localIssue.value.photos)) {
            localIssue.value.photos = [];
          }
          // Add file data to photos array
          localIssue.value.photos.push(data);
          break;
        case 'documents':
          if (!Array.isArray(localIssue.value.documents)) {
            localIssue.value.documents = [];
          }
          // Add file data to documents array
          localIssue.value.documents.push(data);
          break;
      }
    }
  }

  //clear input value
  if (event.target) {
    (event.target as HTMLFormElement).value = null
  }
}

const documentfile = ref<HTMLInputElement | null>(null);

function addDocument() {
  documentfile.value?.click();
}

function removeDocument(index: number) {
  localIssue.value.documents?.splice(index, 1);
}

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
  const words = Boolean(label) ? label.split(' ') : ['N', 'A'];
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
  const colorHash = (Boolean(label) ? label.split('') : ['N', 'A']).reduce((acc: number, char: string) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
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

const saveIssue = async () => {
  let validForm1 = await validateForm1()
  if (!validForm1) {
    return;
  }

  emit('save', localIssue.value);
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

// const getVehicleName = (vehicleName: any) => {
//   const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleName)
//   return vehicleName ? vehicleName.name : ''
// }

// const getUserName = (userId: any) => {
//   const useName = users.value.find((user) => user.id === userId)
//   return useName ? useName.name : ''
// }

const vehicleMeter = ref()

watch(() => props.modelValue, (newValue) => {
  if (router.currentRoute.value.path === '/maintenance/FailureManagement') {
    localIssue.value.asset_name = props.vehicleName
  }
  if (router.currentRoute.value.path === '/maintenance/FaultManagement') {
    localIssue.value.asset_name = props.vehicleName
  }
  if (router.currentRoute.value.path === '/maintenance/RecallManagement') {
    localIssue.value.asset_name = props.vehicleName
  }
  if (router.currentRoute.value.path === '/maintenance/WorkOrders') {
    if (props.vehicleName) {
      localIssue.value.asset_name = props.vehicleName
    }
  }
  if (title.value === 'Create Issue') {
    localIssue.value.reported_date = new Date().toISOString().slice(0, 16).replace('T', ' ');
    localIssue.value.status = 'Open'
    localIssue.value.source = 'Manual Input'
    localIssue.value.priority = 'No Priority'
    localIssue.value.reported_by = authStore.user?.id
  }
})

const updateSelectedVehicle = (asset: Asset) => {
  vehicleMeter.value = asset.odometer;
  if (title.value === 'Create Issue') {
    localIssue.value.meter = vehicleMeter.value;
  }
}

watch(() => localIssue.value.asset_name, (newAssetName) => {
  if (newAssetName && title.value === 'Create Issue') {
    localIssue.value.meter = (vehicleMeter.value as string);
  }
});
</script>