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
        <v-row class="mt-1">
          <v-col cols="12" md="6">
            <v-form ref="technicianForm1">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="font-weight-bold text-primary">Basic Information</v-card-title>
                    <v-card-text>
                      <v-row class="mt-3">
                        <v-col cols="12" md="6">
                          <v-text-field label="First Name*" :rules="[validation.required]"
                            v-model="localTechnician.first_name" density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Middle Name" v-model="localTechnician.middle_name" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Last Name*" :rules="[validation.required]"
                            v-model="localTechnician.last_name" density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Date of Birth*" :rules="[validation.required]" type="date"
                            v-model="localTechnician.dob" density="compact" variant="outlined"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <v-card class="mt-2">
                    <v-card-title class="font-weight-bold text-primary">Contact Information</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field label="Email*" :rules="[validation.required, validation.email]"
                            v-model="localTechnician.email" density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Mobile Phone*" v-model="localTechnician.mobile_phone" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Home Phone" v-model="localTechnician.home_phone" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Work Phone" v-model="localTechnician.work_phone" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <v-card class="mt-2">
                    <v-card-title class="font-weight-bold text-primary">Address Information</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field label="Address 1*" v-model="localTechnician.address"
                            :rules="[validation.required]" density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Address 2" v-model="localTechnician.address_line2" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="City*" v-model="localTechnician.city" :rules="[validation.required]"
                            density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="State*" v-model="localTechnician.state" :rules="[validation.required]"
                            density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Country*" v-model="localTechnician.country"
                            :rules="[validation.required]" density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Zip*" v-model="localTechnician.zip" :rules="[validation.required]"
                            density="compact" variant="outlined"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <v-card class="mt-2">
                    <v-card-title class="font-weight-bold text-primary">License Information</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field label="License Number" v-model="localTechnician.license_number"
                            density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="License Class" v-model="localTechnician.license_class" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="License State" v-model="localTechnician.license_number" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-form>
          </v-col>

          <v-col cols="12" md="6">
            <v-form ref="technicianForm2">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="font-weight-bold text-primary">Employment Information</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field label="Job Title*" v-model="localTechnician.job_title"
                            :rules="[validation.required]" density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select label="Classification*" :items="['operator', 'employee', 'technician']"
                            :rules="[validation.required]" v-model="localTechnician.classification"
                            density="compact" variant="outlined"></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Group" v-model="localTechnician.group" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select label="Experience Level*" :rules="[validation.required]"
                            :items="expertiseLevels" item-value="value" item-title="text"
                            v-model="localTechnician.experience_level" density="compact" variant="outlined"></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Hourly Labour Rate*" v-model="localTechnician.hourly_labour_rate"
                            :rules="[validation.required]" type="number" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Employee Number" v-model="localTechnician.employee_number"
                            density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Start Date*" v-model="localTechnician.start_date"
                            :rules="[validation.required]" density="compact" variant="outlined"
                            type="date"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="End Date" v-model="localTechnician.leave_date" density="compact"
                            variant="outlined" type="date"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <v-card class="mt-2">
                    <v-card-title class="font-weight-bold text-primary">Certifications</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <v-row v-for="(certification, i) in localTechnician.certifications">
                            <v-col cols="12" md="6">
                              <v-text-field label="Certification Title*" :rules="[validation.required]"
                                v-model="certification.name" density="compact" variant="outlined">
                                <template v-slot:prepend>
                                  <v-btn icon density="compact" variant="tonal"
                                    @click="removeCertification(i)"><v-icon color="red">mdi-delete</v-icon></v-btn>
                                </template>
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-text-field label="Description" v-model="certification.description"
                                density="compact" variant="outlined"></v-text-field>
                            </v-col>
                          </v-row>
                          <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12">
                          <v-btn class="text-none" color="primary"
                            @click="addCertification"><v-icon>mdi-plus</v-icon>Add
                            Certification</v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <v-card class="mt-2">
                    <v-card-title class="font-weight-bold text-primary">Skills</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <template v-for="(skill, i) in localTechnician.skills">
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-text-field label="Skill Name*" :rules="[validation.required]"
                                  v-model="skill.name" density="compact" variant="outlined">
                                  <template v-slot:prepend>
                                    <v-btn icon density="compact" variant="tonal" @click="removeSkill(i)"><v-icon
                                        color="red">mdi-delete</v-icon></v-btn>
                                  </template>
                                </v-text-field>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-text-field label="Description" v-model="skill.description" density="compact"
                                  variant="outlined"></v-text-field>
                              </v-col>
                            </v-row>
                            <v-divider></v-divider>
                          </template>
                        </v-col>
                        <v-col cols="12">
                          <v-btn class="text-none" color="primary" @click="addSkill"><v-icon>mdi-plus</v-icon>Add
                            Skill</v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">cancel</v-btn>
        <v-spacer></v-spacer>
        <!-- <v-btn v-if="step > 1" color="primary" @click="step -= 1"><v-icon>mdi-chevron-left</v-icon>Back</v-btn>
        <v-btn v-if="step < 2" color="primary" @click="nextWindow">Next<v-icon>mdi-chevron-right</v-icon></v-btn> -->
        <v-btn color="primary" variant="text" @click="saveTechnician">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type PropType } from 'vue';
import { useValidation } from '~/composables/formValidation';
import type { Technician } from '@/types/maintenance/technicianTypes';

const validation = useValidation();

const props = defineProps({
  modelValue: Boolean,
  technician: {
    type: Object as PropType<Partial<Technician>>,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const localTechnician = ref<Technician>(JSON.parse(JSON.stringify(props.technician)));

const title = computed(() => (props.technician && props.technician.id ? 'Edit Technician' : 'Add Technician'));

const step = ref(1)

const technicianForm1 = ref<HTMLFormElement | null>(null)
const technicianForm2 = ref<HTMLFormElement | null>(null)


const expertiseLevels = ref([
  { value: 'beginner', text: 'Beginner' },
  { value: 'intermediate', text: 'Intermediate' },
  { value: 'advanced', text: 'Advanced' },
  { value: 'expert', text: 'Expert' }
])

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      step.value = 1
    }
  }
)

const validateForm1 = async () => {
  let formStatus = await technicianForm1.value?.validate()
  return formStatus.valid ? true : false
}

const validateForm2 = async () => {
  let formStatus = await technicianForm2.value?.validate()
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

watch(
  () => props.technician,
  (newTechnician) => {
    localTechnician.value = JSON.parse(JSON.stringify(newTechnician));
  }
);

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const addSkill = () => {
  if (!localTechnician.value.skills) {
    localTechnician.value.skills = []
  }
  localTechnician.value.skills.push({ name: '', description: '' })
}

const removeSkill = (index: number) => {
  localTechnician.value.skills?.splice(index, 1)
}

const addCertification = () => {
  if (!localTechnician.value.certifications) {
    localTechnician.value.certifications = []
  }
  localTechnician.value.certifications?.push({ name: '', description: '' })
}

const removeCertification = (index: number) => {
  localTechnician.value.certifications?.splice(index, 1)
}

const saveTechnician = async () => {
  // validate first window
  let validForm1 = await validateForm1()
  if (!validForm1) {
    step.value = 1
    return;
  }

  // validate second window
  let validForm2 = await validateForm2()
  if (!validForm2) {
    return
  }

  emit('save', localTechnician.value);
  emit('update:modelValue', false);
  emit('close');
};
</script>