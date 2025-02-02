<template>
  <v-dialog v-model="dialog" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="inspectionForm">
          <v-row v-if="!inspection.id">
            <v-col cols="12" md="6">
              <SharedInputFormInput @selection="selectForm" variant="solo" density="comfortable"
                v-model="inspectionFormId" label="Form" :rules="[validation.required]" flat />
            </v-col>

            <v-col cols="12" md="6">
              <!-- <SharedInputVehicleAutoCompleteInput variant="solo" density="comfortable"
                :disabled="!localInspection.inspection_form_id" :custom-filter="customFilter"
                v-model="localInspection.vehicle_id" label="Select Vehicle" :rules="[validation.required]" /> -->
              <SharedInputVehicleAutoCompleteInput variant="solo" density="comfortable" :disabled="!inspectionFormId"
                v-model="vehicleId" label="Select Vehicle" :rules="[validation.required]" />
            </v-col>
          </v-row>

          <v-expand-transition>
            <v-col
              v-if="(Object.keys(responses).length && inspectionFormElements && (inspection.id || (inspectionFormId && vehicleId)) && dialog)"
              class="pt-0">
              <v-card class="mt-3" v-for="(section, sectionIndex) in inspectionFormElements" :key="sectionIndex">
                <div v-for="(item, index) in section" class="pa-2">
                  <div v-if="item.type == 'section'" class="text-h6">{{ item.label }}</div>

                  <div v-else>
                    <v-row>
                      <v-col cols="12" md="6">
                        <p>{{ item.label }} <span v-if="item.required">*</span></p>
                        <p class="text-caption" v-if="item.description">{{ item.description }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <!-- Free Text -->
                        <v-textarea :rules="getValidationRules(item)" v-model="responses[item.id].value"
                          v-if="item.type == 'free_text'" density="compact" variant="outlined"></v-textarea>

                        <!-- Number -->
                        <v-text-field :rules="getValidationRules(item)" v-model="responses[item.id].value"
                          v-else-if="item.type == 'number'" type="number" density="compact"
                          variant="outlined"></v-text-field>

                        <!-- Pass / Fail -->
                        <v-radio-group :rules="getValidationRules(item)" v-model="responses[item.id].value"
                          v-else-if="item.type == 'pass_fail'" inline color="primary">
                          <v-radio value="pass" :label="item.pass_label"></v-radio>
                          <v-radio value="fail" :label="item.fail_label"></v-radio>
                        </v-radio-group>

                        <!-- Signature -->
                        <v-text-field :rules="getValidationRules(item)" v-model="responses[item.id].value"
                          v-else-if="item.type == 'signature'" placeholder="Type your name to sign"></v-text-field>

                        <!-- Dropdown -->
                        <v-select :rules="getValidationRules(item)" v-model="responses[item.id].value"
                          v-else-if="item.type == 'dropdown'" :items="item.choices" item-title="text" item-value="text"
                          density="compact" variant="outlined"></v-select>

                        <!-- Date Time -->
                        <v-text-field :rules="getValidationRules(item)" v-model="responses[item.id].value"
                          v-else-if="item.type == 'date_time'" density="compact" variant="outlined"
                          :type="item.date_only ? 'date' : 'datetime-local'"></v-text-field>

                        <!-- Meter Entry -->
                        <v-text-field :rules="getValidationRules(item)" v-model="responses[item.id].value"
                          v-else-if="item.type == 'meter_entry'" density="compact" variant="outlined"
                          type="number"></v-text-field>

                        <!-- ADDING COMMENT AND PHOTO -->

                        <!-- comment input -->
                        <div v-if="responses[item.id].comment">
                          <v-textarea v-model="responses[item.id].comment!.comment" label="Comments" variant="outlined"
                            density="compact">
                          </v-textarea>
                        </div>


                        <!-- file input -->
                        <v-btn color="primary" class="ma-1" v-if="showAddPhoto[item.id]"
                          @click="triggerFileInput(item.id)">Upload
                          Photo</v-btn>
                        <input type="file" :ref="setFileInputRef(item.id)" style="display: none"
                          @change="(event) => handleFileChange(item.id, event, 'photos')" accept="image/*" />

                        <v-list>
                          <v-list-item v-for="(photo, i) in (responses[item.id].photos || [])"
                            :title="((photo.name || photo) as string)" :key="i">
                            <template v-slot:prepend>
                              <v-btn icon size="x-small" @click="responses[item.id].photos?.splice(i, 1)" flat
                                color="error" variant="tonal" class="mr-2"><v-icon>mdi-window-close</v-icon></v-btn>
                            </template>
                          </v-list-item>
                        </v-list>

                        <div class="d-flex justify-end">
                          <v-menu open-on-hover>
                            <template v-slot:activator="{ props }">
                              <v-btn color="primary" v-bind="props" class="text-none" density="comfortable"
                                variant="text">
                                <v-icon class="mr-2">mdi-plus</v-icon> Add Remark
                                <v-icon class="ml-1">mdi-chevron-down</v-icon>
                              </v-btn>
                            </template>

                            <v-list>
                              <v-list-item :disabled="Boolean(responses[item.id].comment)" @click="addComment(item.id)">
                                <v-list-item-title>Add Comment</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="addPhoto(item.id)">
                                <v-list-item-title>Add Photo</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                  <v-divider class="mb-2 mt-4" v-if="item.type != 'section' && index + 1 < section.length"></v-divider>
                </div>
              </v-card>
            </v-col>
          </v-expand-transition>
        </v-form>

      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="saveInspection"
          :disabled="!vehicleId || !formSelected">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { Inspection } from '@/types/maintenance/inspection';
import { useValidation } from '~/composables/formValidation';
import type { InspectionForm } from '~/types/maintenance/inspectionForm';
import type { InspectionItem } from '@/types/maintenance/inspection';
import type { Comment } from '~/types/maintenance/commentTypes';

const mediaStore = useMediaStore();
const validation = useValidation();

const inspectionFormStore = useInspectionFormStore();

const { forms } = storeToRefs(inspectionFormStore);

const assetStore = useAssetStore()
const { assetList } = storeToRefs(assetStore)


// type DeepPartial<T> = {
//   [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
// };

// type DeepPartial<T> = {
//   [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> | undefined : T[P];
// };

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  inspection: {
    type: Object as PropType<Partial<Inspection>>,
    default: () => ({} as Partial<Inspection>)
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const invalidForm = (form: any) => {
  return form.elements?.length < 0 || form.status == 'draft'
}

const responses = ref<Record<string, Partial<InspectionItem>>>({});

const showAddPhoto = ref<Record<string, boolean>>({});

const vehicleId = ref<number | null>(null)
const inspectionFormId = ref<number | null>(null)
const startTime = ref<string | null>(null)

const selectedForm = ref<InspectionForm | null>(null)

const formSelected = computed(() => !!selectedForm.value)

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const inspectionForm = ref<HTMLFormElement | null>(null);

//instantiate responses when form is selected
const selectForm = (form: InspectionForm) => {
  if (form.current_version) {
    let items: Record<string, any> = {}
    form.current_version?.elements?.forEach(item => {
      items[item.id] = {
        workflow_id: item.id,
        item: item.label,
        value: '',
        comment: undefined,
        photos: []
      }
    })
    responses.value = JSON.parse(JSON.stringify(items))
  }
  selectedForm.value = form
}

const getUTCTimeStamp = () => {
  return new Date().toISOString(); //.slice(0, 19).replace('T', ' ');
}

// populate form when updating
watch(() => dialog.value, (newVal) => {
  if (newVal) {
    if (props.inspection.id && props.inspection.items?.length) {
      let payload: Record<string, any> = {}
      props.inspection.items?.forEach(item => {
        payload[item.workflow_id] = item
      })
      responses.value = JSON.parse(JSON.stringify(payload))
    }
    startTime.value = getUTCTimeStamp()
  }
  else {
    resetForm();
  }
})



const title = computed(() => {
  return props.inspection && props.inspection.id ? 'Edit Inspection' : 'Create Inspection'
})

//this computed property returns the form items for the selected form
const inspectionFormElements = computed(() => {
  let formItems = [] as any[]

  if (props.inspection.id) { //editing form
    formItems = props.inspection.form_version?.elements || []
  }
  else if (selectedForm.value?.current_version) { //adding new form
    formItems = selectedForm.value.current_version.elements
  }


  if (!formItems.length) {
    return [];
  }

  let result: any = [];
  let currentSubArray: any = [];

  formItems.forEach((item: any) => {
    if (item.type === 'section') {
      if (currentSubArray.length > 0) {
        result.push(currentSubArray);
      }
      currentSubArray = [];
    }
    currentSubArray.push(item);
  });

  if (currentSubArray.length > 0) {
    result.push(currentSubArray);
  }

  return result;
})

const addComment = (itemId: string) => {
  responses.value[itemId].comment = {} as Comment;
}

const addPhoto = (itemId: string) => {
  showAddPhoto.value[itemId] = true
}

const fileInputRefs = ref<Record<string, HTMLInputElement | null>>({});

const setFileInputRef = (index: number) => {
  return (el: any) => {
    fileInputRefs.value[index] = el;
  };
};

const triggerFileInput = (index: string) => {
  const fileInput = fileInputRefs.value[index];
  if (fileInput) {
    fileInput.click();
  } else {
    console.error(`fileInput ref for index ${index} is not bound to the input element`);
  }
};

const handleFileChange = async (index: string, event: any, location: string) => {
  const target = event.target as HTMLInputElement;

  if (target.files) {
    const files = Array.from(target.files);

    for (const file of files) {
      const { data, error } = await mediaStore.uploadFile(file);
      if (data) {
        if (!Array.isArray(responses.value[index].photos)) {
          responses.value[index].photos = [];
        }
        responses.value[index].photos.push(data);
      }
    }
  }

  // Clear input value
  target.value = '';
}

const getValidationRules = (item: any) => {
  let rules = []
  switch (item.required) {
    case true:
      rules.push(validation.required)
      break;
    default:
      break;
  }

  return rules
}

const saveInspection = async () => {
  let formStatus = await inspectionForm.value?.validate();
  if (!formStatus.valid) {
    return;
  }

  let formItems = Object.values(responses.value).map(item => {
    return {
      ...item,
      comment: item.comment?.comment
    }
  })
  let payload = {
    //inspection_form_id: props.inspection.id ?? inspectionFormId,
    //form_version_id: props.inspection.id ? undefined : selectedForm.value?.current_version?.id,
    //vehicle_id: props.inspection.id ? undefined : vehicleId.value,
    inspection_form_id: props.inspection.id ?? inspectionFormId,
    form_version_id: selectedForm.value?.current_version?.id,   
    vehicle_id: vehicleId.value,
    items: formItems,
    started_on: getUTCTimeStamp(),
    submitted_by: (useAuthStore().user?.id as number).toString(),
  };


  // Emit the payload along with the inspection ID
  emit('save', payload);
  closeDialog()
};

const closeDialog = () => {
  dialog.value = false
  emit('close');
};

const resetForm = () => {
  selectedForm.value = null;
  vehicleId.value = null
  inspectionFormId.value = null
  selectedForm.value = null
  responses.value = {};
  startTime.value = null
};

// const customFilter = (value: string, query: string, item: any): boolean => {
//   const searchText = query.toLowerCase();
//   return item.raw.name.toLowerCase().includes(searchText) || item.raw.id == searchText
// };
</script>

<style scoped></style>