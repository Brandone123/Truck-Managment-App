<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Profile Details</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-text>
                <v-row align="center" class="d-flex">
                  <v-col cols="12" align="center">
                    <v-avatar size="150px">
                      <v-img alt="Avatar" src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col cols="12" align="center">
                    <!-- name -->
                    <p class="font-weight-bold text-h6 mr-4">{{ technician.full_name }}</p>

                    <div class="h-divider mt-5">
                      <div class="shadow"></div>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div>
                      <span class="text-caption text-grey">Email: </span><br>
                      <span :class="{'font-weight-bold text-body': technician.email}">{{ technician.email || 'Not provided'}}</span>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <div>
                      <span class="text-caption text-grey">Mobile Phone: </span><br>
                      <span class="font-weight-bold text-body">{{ technician.mobile_phone ? technician.mobile_phone : 'Not provided'}}</span>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <div>
                      <span class="text-caption text-grey">Home Phone: </span><br>
                      <span :class="technician.home_phone? 'font-weight-bold text-body' : 'text-grey'">{{ technician.home_phone ? technician.home_phone : 'Not provided'}}</span>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <div>
                      <span class="text-caption text-grey">Work Phone: </span><br>
                      <span :class="technician.work_phone? 'font-weight-bold text-body' : 'text-grey'">{{ technician.work_phone ? technician.work_phone : 'Not provided'}}</span>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <div>
                      <span class="text-caption text-grey">Address Line 1: </span><br>
                      <span class="font-weight-bold text-body">{{ technician.address ? technician.address : 'Not provided'}}</span>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <div>
                      <span class="text-caption text-grey">Address Line 2: </span><br>
                      <span :class="technician.address_line2? 'font-weight-bold text-body' : 'text-grey'">{{ technician.address_line2 ? technician.address_line2 : 'Not provided' }}</span>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <div>
                      <span class="text-caption text-grey">City: </span><br>
                      <span class="font-weight-bold text-body">{{ technician.city ? technician.city : 'Not provided'}}</span>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <div>
                      <span class="text-caption text-grey">State: </span><br>
                      <span class="font-weight-bold text-body">{{ technician.state ? technician.state : 'Not provided' }}</span>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <div>
                      <span class="text-caption text-grey">Country: </span><br>
                      <span class="font-weight-bold text-body">{{ technician.country ? technician.country : 'Not provided'}}</span>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <div>
                      <span class="text-caption text-grey">Zip: </span><br>
                      <span class="font-weight-bold text-body">{{ technician.zip ? technician.zip : 'Not provided'}}</span>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-title>Employment Information</v-card-title>
                  <v-card-text>
                    <v-col>
                      <v-row>
                        <v-col cols="4">Job Title</v-col>
                        <v-col cols="6" :class="technician.job_title? 'text-primary' : 'text-grey'">{{ technician.job_title ? technician.job_title : 'Not provided' }}</v-col>
                        <v-col cols="4">Experience Level</v-col>
                        <v-col cols="6" :class="technician.experience_level? 'text-primary' : 'text-grey'">{{ technician.experience_level ? technician.experience_level : 'Not provided'}}</v-col>
                        <v-col cols="4">Employee Number</v-col>
                        <v-col cols="6" :class="technician.employee_number? 'text-primary' : 'text-grey'">{{ technician.employee_number ? technician.employee_number : 'Not provided'}}</v-col>
                        <v-col cols="4">Hourly Labour Rate</v-col>
                        <v-col cols="6" :class="technician.hourly_labour_rate? 'text-primary' : 'text-grey'">{{ technician.hourly_labour_rate ? technician.hourly_labour_rate : 'Not provided' }}</v-col>
                        <v-col cols="4">Start Date</v-col>
                        <v-col cols="6" :class="technician.start_date? 'text-primary' : 'text-grey'">{{ technician.start_date ? technician.start_date : 'Not provided' }}</v-col>
                        <v-col cols="4">Leave Date</v-col>
                        <v-col cols="6" :class="technician.leave_date? 'text-primary' : 'text-grey'">{{ technician.leave_date ? technician.leave_date : 'Not provided'}}</v-col>
                      </v-row>
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card>
                  <v-card-title>License Information</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="4">License Number</v-col>
                      <v-col cols="6" :class="technician.license_number? 'text-primary' : 'text-grey'">{{ technician.licese_number ? technician.licese_number : 'Not provided' }}</v-col>
                      <v-col cols="4">License Class</v-col>
                      <v-col cols="6" :class="technician.license_class? 'text-primary' : 'text-grey'">{{ technician.license_class ? technician.license_class : 'Not provided' }}</v-col>
                      <v-col cols="4">License State</v-col>
                      <v-col cols="6" :class="technician.license_state? 'text-primary' : 'text-grey'">{{ technician.license_state ? technician.license_state : 'Not provided'}}</v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card>
                  <v-card-title>Certifications</v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <template v-for="(certification, index) in technician.certifications" :key="index">
                        <v-list-item>
                          <v-list-item-title class="font-weight-bold">{{ certification.name
                            }}</v-list-item-title>
                          <v-list-item-subtitle>{{ certification.description }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-divider v-if="index + 1 < (technician.certifications || []).length"></v-divider>
                      </template>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card>
                  <v-card-title>Skills</v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <template v-for="(skill, index) in technician.skills" :key="index">
                        <v-list-item>
                          <v-list-item-title class="font-weight-bold">{{ skill.name
                            }}</v-list-item-title>
                          <v-list-item-subtitle>{{ skill.description }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-divider v-if="index + 1 < (technician.skills || []).length"></v-divider>
                      </template>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type { Technician } from '@/types/maintenance/technicianTypes';

const props = defineProps({
  modelValue: Boolean,
  technician: {
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

<style scoped>
.h-divider {
  margin: auto;
  width: 80%;
  position: relative;
}

.h-divider .shadow {
  overflow: hidden;
  height: 20px;
}

.h-divider .shadow:after {
  content: '';
  display: block;
  margin: -25px auto 0;
  width: 100%;
  height: 25px;
  border-radius: 125px/12px;
  box-shadow: 0 0 8px black;
}
</style>