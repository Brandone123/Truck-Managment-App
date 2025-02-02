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
        <v-form ref="technicianForm">
          <v-row class="mt-1">
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="font-weight-bold text-primary">Basic Information</v-card-title>
                    <v-card-text>
                      <v-row class="mt-3">
                        <v-col cols="12" md="6">
                          <v-text-field label="First Name*" :rules="[validation.required]"
                            v-model="localEmployee.first_name" density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <!-- <v-col cols="12" md="6">
                          <v-text-field label="Middle Name" v-model="localEmployee.middle_name" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col> -->
                        <v-col cols="12" md="6">
                          <v-text-field label="Last Name*" :rules="[validation.required]"
                            v-model="localEmployee.last_name" density="compact" variant="outlined"></v-text-field>
                        </v-col>

                        <!-- <v-col cols="12" md="6">
                          <v-text-field v-model="localEmployee.email" variant="outlined" flat label="Email"
                            density="compact" :rules="[validation.required]"></v-text-field>
                        </v-col> -->
                        <v-col cols="12" md="6">
                          <v-select v-model="localEmployee.department_id" variant="outlined" flat label="Department"
                            :items='formattedDepartmentList' item-title="full_name" item-value="id"
                            density="compact"></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select v-model="localEmployee.role_id" variant="outlined" flat label="Role"
                            :items='roleList' item-title="name" item-value="id" density="compact"></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select :items="['Salary', 'Hourly']" v-model="localEmployee.employment_type"
                            variant="outlined" flat label="Employment Type" density="compact"
                            :rules="[validation.required]"></v-select>
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-text-field label="Date of Birth*" :rules="[validation.required]" type="date"
                            v-model="localEmployee.dob" density="compact" variant="outlined"></v-text-field>
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
                            v-model="localEmployee.email" density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Mobile Phone*" v-model="localEmployee.mobile_phone" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Home Phone" v-model="localEmployee.home_phone" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Work Phone" v-model="localEmployee.work_phone" density="compact"
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
                          <v-text-field label="Address 1*" v-model="localEmployee.address"
                            :rules="[validation.required]" density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Address 2" v-model="localEmployee.address_line2" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="City*" v-model="localEmployee.city" :rules="[validation.required]"
                            density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="State*" v-model="localEmployee.state" :rules="[validation.required]"
                            density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Country*" v-model="localEmployee.country" :rules="[validation.required]"
                            density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Zip*" v-model="localEmployee.zip" :rules="[validation.required]"
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
                          <v-text-field label="License Number" v-model="localEmployee.license_number" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="License Class" v-model="localEmployee.license_class" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="License State" v-model="localEmployee.license_number" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="font-weight-bold text-primary">Employment Information</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field label="Job Title*" v-model="localEmployee.job_title"
                            :rules="[validation.required]" density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <!-- <v-col cols="12" md="6">
                          <v-select label="Classification*" :items="['operator', 'employee', 'employee']"
                            :rules="[validation.required]" v-model="localEmployee.classification"
                            density="compact" variant="outlined"></v-select>
                        </v-col> -->
                        <v-col cols="12" md="6">
                          <v-text-field label="Group" v-model="localEmployee.group" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select label="Experience Level*" :rules="[validation.required]" :items="expertiseLevels"
                            item-value="value" item-title="text" v-model="localEmployee.experience_level"
                            density="compact" variant="outlined"></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Hourly Labour Rate*" v-model="localEmployee.hourly_labour_rate"
                            :rules="[validation.required]" type="number" density="compact"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Employee Number" v-model="localEmployee.employee_number"
                            density="compact" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Hire Date*" v-model="localEmployee.hire_date"
                            :rules="[validation.required]" density="compact" variant="outlined"
                            type="date"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Termination Date" v-model="localEmployee.termination_date"
                            density="compact" variant="outlined" type="date"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>


                  <v-card class="mt-2">
                    <v-card-title class="font-weight-bold text-primary">Roles And Permissions</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" class="d-flex justify-center">
                          <v-row>
                            <v-col cols="3">
                              <v-switch v-model="localEmployee.isAdmin" color="primary" label="Is Admin"
                                hide-details></v-switch>
                            </v-col>
                            <v-col cols="9">
                              <v-autocomplete :disabled="!localEmployee.isAdmin" variant="outlined" density="compact"
                                label="Admin Role">
                              </v-autocomplete>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12">
                          <v-row>
                            <v-col cols="3">
                              <v-switch v-model="localEmployee.isOperator" color="primary" label="Is Operator"
                                hide-details></v-switch>
                            </v-col>
                            <v-col cols="9">
                              <v-autocomplete :disabled="!localEmployee.isOperator" variant="outlined" density="compact"
                                label="Operator Role">
                              </v-autocomplete>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12">
                          <v-row>
                            <v-col cols="3">
                              <v-switch v-model="localEmployee.isTechnician" color="primary" label="Is Technician"
                                hide-details></v-switch>
                            </v-col>
                            <v-col cols="9">
                              <v-autocomplete :disabled="!localEmployee.isTechnician" variant="outlined" density="compact"
                                label="Technician Role">
                              </v-autocomplete>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12">
                          <v-row>
                            <v-col cols="3">
                              <v-switch v-model="localEmployee.isDriver" color="primary" label="Is Driver"
                                hide-details></v-switch>
                            </v-col>
                            <v-col cols="9">
                              <v-autocomplete :disabled="!localEmployee.isDriver" variant="outlined" density="compact"
                                label="Driver Role">
                              </v-autocomplete>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>


                  <v-card class="mt-2">
                    <v-card-title class="font-weight-bold text-primary">Certifications</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <v-row v-for="(certification, i) in localEmployee.certifications">
                            <v-col cols="12" md="6">
                              <v-text-field label="Certification Title*" :rules="[validation.required]"
                                v-model="certification.name" density="compact" variant="outlined">
                                <template v-slot:prepend>
                                  <v-btn icon density="compact" variant="tonal" @click="removeCertification(i)"><v-icon
                                      color="red">mdi-delete</v-icon></v-btn>
                                </template>
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-text-field label="Description" v-model="certification.description" density="compact"
                                variant="outlined"></v-text-field>
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
                          <template v-for="(skill, i) in localEmployee.skills">
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-text-field label="Skill Name*" :rules="[validation.required]" v-model="skill.name"
                                  density="compact" variant="outlined">
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
            </v-col>

            <v-col cols="12" md="6">
              <v-card class="mt-3">
                <div class="d-flex">
                  <v-card-title class="font-weight-bold">Location</v-card-title>
                  <div class="ml-auto mt-2 mr-2">
                    <v-btn @click="addLocation" color="primary" outlined>Add Location</v-btn>
                  </div>
                </div>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" v-for="(location, index) in localEmployee.locations" :key="index" class="pa-3">
                      <v-card-text>
                        <v-row class="rounded border">
                          <v-col cols="12" md="6" class="pb-0">
                            <v-select :items="LocationList" item-title="location_type" item-value="id"
                              v-model="location.location_id" variant="outlined" flat label="Select Location"
                              density="compact"></v-select>
                          </v-col>
                          <v-col cols="12" md="4" class="pb-0">
                            <v-checkbox :true-value="1" :false-value="0" v-model="location.auto_clock_in"
                              label="Auto Clock In"></v-checkbox>
                          </v-col>
                          <v-col cols="12" md="4" class="pb-0">
                            <v-checkbox :true-value="1" :false-value="0" v-model="location.auto_clock_out"
                              label="Auto Clock Out"></v-checkbox>
                          </v-col>
                          <v-col cols="12" md="4" class="pb-0">
                            <v-checkbox :true-value="1" :false-value="0" v-model="location.clock_in_enforced"
                              label="Clock In Enforced"></v-checkbox>
                          </v-col>
                          <v-col cols="12" md="4" class="pb-0">
                            <v-checkbox :true-value="1" :false-value="0" v-model="location.clock_out_enforced"
                              label="Clock Out Enforced"></v-checkbox>
                          </v-col>
                          <v-col cols="12" md="12" class="d-flex justify-end">
                            <v-btn @click="removeLocation(index)" color="red" outlined>Remove Location</v-btn>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">cancel</v-btn>
        <v-spacer></v-spacer>
        <!-- <v-btn v-if="step > 1" color="primary" @click="step -= 1"><v-icon>mdi-chevron-left</v-icon>Back</v-btn>
        <v-btn v-if="step < 2" color="primary" @click="nextWindow">Next<v-icon>mdi-chevron-right</v-icon></v-btn> -->
        <v-btn color="primary" variant="text" @click="saveEmployee">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type PropType } from 'vue';
import { useValidation } from '~/composables/formValidation';
import type { EmployeeInfo } from '@/types/store/employee'
import type { DepartmentInfo } from '@/types/store/department'
const validation = useValidation();

const props = defineProps({
  modelValue: Boolean,
  employee: {
    type: Object as PropType<Partial<EmployeeInfo>>,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const locationStore = useLocationStore()
const { LocationList } = storeToRefs(locationStore)

const departmentListStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentListStore)

const roleListStore = useRoleStore()
const { roleList } = storeToRefs(roleListStore)

onMounted(() => {
  locationStore.fetchLocationList()
})


const formattedDepartmentList = computed(() => {
  return departmentList.value.map((item: DepartmentInfo) => {
    return { ...item, full_name: `${item.name}` }
  })
});

const employeeListStore = useEmployeeStore()
const { employeeList } = storeToRefs(employeeListStore)


const employeeWithEmail = computed(() => {
  const employeeId = localEmployee.value.id;
  const employeeItem = employeeList.value.find(employee => employee.id === employeeId);
  return employeeItem && employeeItem.user ? employeeItem.user.email : null;
});


const addLocation = () => {
  localEmployee.value.locations?.push({
    id: null,
    employee_id: localEmployee.value.id as number,
    location_id: null,
    auto_clock_in: false,
    auto_clock_out: false,
    clock_in_enforced: false,
    clock_out_enforced: false,
  });
};

const removeLocation = (index: number) => {
  localEmployee.value.locations?.splice(index, 1);
};

const localEmployee = ref<EmployeeInfo>(JSON.parse(JSON.stringify(props.employee)));

const title = computed(() => (props.employee && props.employee.id ? 'Edit Employee Info' : 'Add EmployeeInfo'));

const step = ref(1)

const technicianForm = ref<HTMLFormElement | null>(null)


const expertiseLevels = ref([
  { value: 'beginner', text: 'Beginner' },
  { value: 'intermediate', text: 'Intermediate' },
  { value: 'advanced', text: 'Advanced' },
  { value: 'expert', text: 'Expert' }
])

const validateForm = async () => {
  let formStatus = await technicianForm.value?.validate()
  return formStatus.valid ? true : false
}


watch(
  () => props.employee,
  (newEmployee) => {
    localEmployee.value = JSON.parse(JSON.stringify(newEmployee)) as EmployeeInfo
    localEmployee.value.email = employeeWithEmail.value
  })

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const addSkill = () => {
  if (!localEmployee.value.skills) {
    localEmployee.value.skills = []
  }
  localEmployee.value.skills.push({ name: '', description: '' })
}

const removeSkill = (index: number) => {
  localEmployee.value.skills?.splice(index, 1)
}

const addCertification = () => {
  if (!localEmployee.value.certifications) {
    localEmployee.value.certifications = []
  }
  localEmployee.value.certifications?.push({ name: '', description: '' })
}

const removeCertification = (index: number) => {
  localEmployee.value.certifications?.splice(index, 1)
}

const saveEmployee = async () => {
  // validate first window
  let validForm = await validateForm()
  if (!validForm) {
    step.value = 1
    return;
  }

  emit('save', localEmployee.value);
  emit('update:modelValue', false);
  emit('close');
};
</script>