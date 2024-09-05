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
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-list class="rounded">
              <template v-for="(form, i) in forms">
                <v-list-item :disabled="invalidForm(form)" :title="form.name" @click="selectForm(form)">
                  <v-list-subtitle v-if="invalidForm(form)">
                    <v-chip density="compact" v-if="(form.elements?.length || 0) < 0">No Elements</v-chip>
                    <v-chip density="compact" v-if="form.status == 'draft'">Draft</v-chip>
                  </v-list-subtitle>
                </v-list-item>
                <v-divider v-if="i + 1 < forms.length"></v-divider>
              </template>
            </v-list>
          </v-window-item>
          <v-window-item :value="2">
            <v-form ref="inspectionForm">
              <v-col cols="12" class="pb-0">
                <v-autocomplete variant="solo" v-model="localInspection.vehicle_id" label="Vehicle" item-title="name"
                  item-value="id" :items="assetList" :rules="[validation.required]" :custom-filter="customFilter">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="(item.raw.id as number)"
                      :title="item.raw.name"></v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-expand-transition>
                <v-col v-if="localInspection.vehicle_id" class="pt-0">
                  <v-card class="mt-3" v-for="(section, sectionIndex) in inspectionFormElements">
                    <div v-for="(item, index) in section" class="pa-2">
                      <!-- Section -->
                      <div v-if="item.type == 'section'" class="text-h6">{{ item.label }}</div>

                      <div v-else>
                        <v-row>
                          <v-col cols="12" md="6">
                            <p>{{ item.label }} <span v-if="item.required">*</span></p>
                            <p class="text-caption" v-if="item.description">{{ item.description }}</p>
                          </v-col>
                          <v-col cols="12" md="6">
                            <!-- Free Text -->
                            <v-textarea :rules="getValidationRules(item)" v-model="responses[item.id]"
                              v-if="item.type == 'free_text'" density="compact" variant="outlined"></v-textarea>

                            <!-- Number -->
                            <v-text-field :rules="getValidationRules(item)" v-model="responses[item.id]"
                              v-else-if="item.type == 'number'" type="number" density="compact"
                              variant="outlined"></v-text-field>

                            <!-- Pass / Fail -->
                            <v-radio-group :rules="getValidationRules(item)" v-model="responses[item.id]"
                              v-else-if="item.type == 'pass_fail'" inline color="primary">
                              <v-radio value="pass" :label="item.pass_label"></v-radio>
                              <v-radio value="fail" :label="item.fail_label"></v-radio>
                            </v-radio-group>

                            <!-- Signature -->
                            <v-text-field :rules="getValidationRules(item)" v-model="responses[item.id]"
                              v-else-if="item.type == 'signature'" placeholder="Type your name to sign"></v-text-field>

                            <!-- Dropdown -->
                            <v-select :rules="getValidationRules(item)" v-model="responses[item.id]"
                              v-else-if="item.type == 'dropdown'" :items="item.choices" item-title="text"
                              item-value="text" density="compact" variant="outlined"></v-select>

                            <!-- Date Time -->
                            <v-text-field :rules="getValidationRules(item)" v-model="responses[item.id]"
                              v-else-if="item.type == 'date_time'" density="compact" variant="outlined"
                              :type="item.date_only ? 'date' : 'datetime-local'"></v-text-field>

                            <!-- Meter Entry -->
                            <v-text-field :rules="getValidationRules(item)" v-model="responses[item.id]"
                              v-else-if="item.type == 'meter_entry'" density="compact" variant="outlined"
                              type="number"></v-text-field>



                            <!-- ADDING COMMENT AND PHOTO -->

                            <!-- comment input -->
                            <v-textarea v-if="showAddComment[item.id]" v-model="comments[item.id]" label="Comments"
                              variant="outlined" density="compact">
                            </v-textarea>

                            <!-- file input -->
                            <v-btn color="primary" class="ma-1" v-if="showAddPhoto[item.id]"
                              @click="triggerFileInput(item.id)">Upload
                              Photo</v-btn>
                            <input type="file" :ref="setFileInputRef(item.id)" style="display: none"
                              @input="handleFileChange(item.id, $event)" accept="image/*" />

                            <v-list v-if="showAddPhoto[item.id]">
                              <v-list-item v-for="(photo, i) in (photos[item.id] || [])" :title="photo.name">
                                <template v-slot:prepend>
                                  <v-btn icon size="x-small" @click="photos[item.id].splice(i, 1)" flat color="error"
                                    variant="tonal" class="mr-2"><v-icon>mdi-window-close</v-icon></v-btn>
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
                                  <v-list-item :disabled="showAddComment[item.id]" @click="addComment(item.id)">
                                    <v-list-item-title>Add Comment</v-list-item-title>
                                  </v-list-item>
                                  <v-list-item :disabled="showAddPhoto[item.id]" @click="addPhoto(item.id)">
                                    <v-list-item-title>Add Photo</v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                            </div>
                          </v-col>
                        </v-row>
                      </div>
                      <v-divider class="mb-2 mt-4"
                        v-if="item.type != 'section' && index + 1 < section.length"></v-divider>
                    </div>
                  </v-card>
                </v-col>
              </v-expand-transition>
            </v-form>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">cancel</v-btn>
        <v-spacer></v-spacer>
        <!-- <v-btn v-if="step < 2" color="primary" @click="step += 1">Next<v-icon>mdi-chevron-right</v-icon></v-btn> -->
        <!-- <v-btn v-if="step > 1" color="primary" @click="step -= 1"><v-icon>mdi-chevron-left</v-icon>Back</v-btn> -->
        <v-btn v-if="step == 2" color="primary" variant="text" @click="saveInspection">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { Inspection } from '@/types/maintenance/inspection';
import { useValidation } from '~/composables/formValidation';
import type { InspectionForm } from '~/types/maintenance/inspectionForm';

const validation = useValidation();

const inspectionFormStore = useInspectionFormStore();

const { forms } = storeToRefs(inspectionFormStore);

const assetStore = useAssetStore()
const { assetList } = storeToRefs(assetStore)

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

const invalidForm = (form : any) => {
  return form.elements?.length < 0 || form.status == 'draft'
}

const responses = ref<Record<string, string>>({});
const comments = ref<Record<string, string>>({});
const photos = ref<Record<string, any[]>>({});

const showAddComment = ref<Record<string, boolean>>({});
const showAddPhoto = ref<Record<string, boolean>>({});

const localInspection = ref<Partial<Inspection>>(JSON.parse(JSON.stringify(props.inspection)));

const step = ref(1)

const selectedForm = ref<InspectionForm | null>(null)

const selectForm = (form: InspectionForm) => {
  selectedForm.value = form
  step.value = 2
}

const getDateTime = () => {
  const now = new Date();

  // Get individual components
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Pad single digits with a leading zero
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Format the date and time as a string
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}


watch(
  () => props.inspection,
  (newInspection) => {
    localInspection.value = JSON.parse(JSON.stringify(newInspection));
  }
);

watch(
  () => props.modelValue,
  (newValue) => {
    // if (newValue == false) {
      resetForm();
    // }
  })

// const title = computed(() => (props.inspection && props.inspection.id ? 'Edit Inspection' : 'Create Inspection'));

const title = computed(() => {
  switch (step.value) {
    case 1:
      return 'Select Inspection Form'
    case 2:
      return 'New Vehicle Inspection'
  }
})

const inspectionForm = ref<HTMLFormElement | null>(null);

const inspectionFormElements = computed(() => {
  if (!selectedForm.value) {
    return []
  }

  let result: any = [];
  let currentSubArray: any = [];

  selectedForm.value.elements?.forEach((item: any) => {
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
  showAddComment.value[itemId] = true
}

const addPhoto = (itemId: string) => {
  showAddPhoto.value[itemId] = true
}


// const fileInputs = ref<number[]>([]);
const fileInputRefs = ref<Record<string, HTMLInputElement | null>>({});


// Function to set the file input ref
const setFileInputRef = (index: number) => {
  return (el: any) => {
    fileInputRefs.value[index] = el //as HTMLInputElement | null;
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

const handleFileChange = (index: string, event: Event) => {
  const target = event.target as HTMLInputElement;

  if (target.files) {
    if (!photos.value[index]) {
      photos.value[index] = []
    }

    photos.value[index] = [...photos.value[index], ...target.files]
  }
  // Clear the file input
  target.value = '';
};

const getValidationRules = (item: any) => {
  let rules = []
  switch (item.required) {
    case true:
      rules.push(validation.required)
      break;
    default:
      //do nothing
      break;
  }

  return rules
}

const saveInspection = async () => {
  let formStatus = await inspectionForm.value?.validate()
  if (!formStatus.valid) {
    return
  }

  let items: any[] = selectedForm.value?.elements.filter(item => item.type != 'section').map(item => { return { id: item.id, name: item.label } }) as any

  items = items.map((itemValue: any) => {
    return {
      id: itemValue.id,
      item: itemValue.name,
      value: responses.value[itemValue.id],
      photos: [],
      comments: comments.value[itemValue.id] || "",
    } as any
  })

  let payload = new FormData()

  let submitted_on = getDateTime()

  payload.append('vehicle_id', (localInspection.value?.vehicle_id as number).toString())
  // payload.append('started_on', (localInspection.value?.vehicle_id as number).toString())
  payload.append('inspection_form_id', (selectedForm.value?.id as number).toString())
  payload.append('submitted_on', submitted_on)
  payload.append('items', JSON.stringify(items))
  payload.append('submitted_by', (useAuthStore().user?.id as number).toString())

  let photoKeys = Object.keys(photos.value)

  payload.append('fileKeys', JSON.stringify(photoKeys))

  photoKeys.forEach((key) => {
    photos.value[key].forEach((file) => {
      payload.append(`file-${key}[]`, file)
    })
  })

  emit('save', payload);
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

const resetForm = () => {
  step.value = 1
  localInspection.value = {}
}

const customFilter = (value: string, query: string, item: any): boolean => {
  const searchText = query.toLowerCase();
  return item.raw.name.toLowerCase().includes(searchText) || item.raw.id == searchText
};
</script>

<style scoped></style>