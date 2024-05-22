<template>
  <v-container>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h5">Employee Profile</span>
    </div>
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
                <p class="font-weight-bold text-h6 mr-4">John Doe</p>
                <!-- Current Position -->
                <p class="text-caption">Head of HR Department</p>

                <div class="h-divider mt-5">
                  <div class="shadow"></div>
                </div>
              </v-col>
              <v-col cols="12">

                <div>
                  <span class="text-caption text-grey">Email: </span><br>
                  <span class="font-weight-bold text-body">johndoe@gmail.com</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <div>
                  <span class="text-caption text-grey">Phone: </span><br>
                  <span class="font-weight-bold text-body">+7 (291) 255 58 43</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <div>
                  <span class="text-caption text-grey">Address: </span><br>
                  <span class="font-weight-bold text-body">525 E 68th Street New York, NY 10065-78-156-187-40</span>
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
              <v-card-title>Contact Information</v-card-title>
              <v-card-text>
                <v-col>
                  <v-row>
                    <v-col cols="4">Phone</v-col>
                    <v-col cols="6" class="text-primary">+1 123 456 7890</v-col>
                  </v-row>
                  <v-row>

                  </v-row>
                  <v-row>
                    <v-col cols="4">Email</v-col>
                    <v-col cols="6" class="text-primary">johndoe@gmail.com</v-col>
                  </v-row>
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-title>Basic Information</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <div>
                      <span class="text-primary font-weight-bold">Hire Date</span>
                      <v-chip color="primary" class="ml-3" density="compact" label>August, 18, 2013</v-chip>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div>
                      <span class="text-primary font-weight-bold">Worked for</span>
                      <v-chip color="primary" class="ml-3" density="compact" label>7 years, 1 month</v-chip>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <span class="text-primary font-weight-bold">Employee ID</span>
                    <v-chip color="primary" class="ml-3" density="compact" label>3156</v-chip>
                  </v-col>
                  <v-col cols="12">
                    <span class="text-primary font-weight-bold">SSN</span>
                    <v-chip color="primary" class="ml-3" density="compact" label>XXX-XX-3561</v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <!-- Employment History Card -->
            <v-card>
              <v-card-title>Employment History</v-card-title>
              <v-list density="compact">
                <v-list-item v-for="(job, index) in employee.jobs" :key="index">
                  <v-list-item-title class="font-weight-bold text-primary">{{ job.position }}</v-list-item-title>
                  <v-list-item-subtitle>{{ job.startDate }} - {{ job.endDate || 'Present' }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ job.department }}</v-list-item-subtitle>
                  <v-divider v-if="index < employee.jobs.length - 1" class="mt-2"></v-divider>
                </v-list-item>
                <!-- Add more jobs here -->
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>


  </v-container>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const employee = ref({
  fullName: 'John Doe',
  dob: '1980-01-01',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  jobs: [
    { id: 1, position: 'Software Developer', startDate: '2010-04-01', endDate: '2014-08-31', department: 'IT' },
    { id: 2, position: 'Senior Developer', startDate: '2014-09-01', department: 'IT' }
    // Add more jobs as needed
  ]
});
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