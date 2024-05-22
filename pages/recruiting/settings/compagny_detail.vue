<template>
    <div>
      <div class="d-flex justify-space-between">
        <span class="text-primary text-h5">Company Detail</span>
      </div>
  
      <SharedUiCustomTable :headers="jobPostingHeaders" :items="dummyCompany" show-expand v-model:expanded="expandedRows">
        <template v-slot:item.actions="{ item }">
          <v-icon color="red" dense @click="deleteJobPosting(item.id)">mdi-delete</v-icon>
        </template>
        <template v-slot:expanded-row="{ columns, item, index, isExpanded }">
              <tr>
                <td :colspan="columns.length" style="height:100px;">
                  <v-card flat background-color="gray">
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="3">
                          <div class="text-subtitle font-weight-bold test-caption">
                            <h3>Jobs Opening</h3>
                          </div>
                          <v-list v-for="job in item.jobOpenings">
                            <v-list-item>{{ job.title }},
                                Status:  <v-chip :color="getColor(job.status)" dark>
                                    {{ job.status }}
                                </v-chip>
                            </v-list-item>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </td>
              </tr>
            </template>
      </SharedUiCustomTable>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineComponent, defineEmits, ref, onMounted } from 'vue';
  import { useJobPostingStore } from '~/stores/recruiting/job_posting';
  import type { JobPostingInfo } from '~/types/recruiting/job_posting';
  
  interface JobOpening {
    id: string | null;
    title: string | null;
    status: string | null;
  }
  
  interface CompanyInfo {
    id: number | null;
    name: string | null;
    description: string | null;
    location: string | null;
    website: string | null;
    jobOpenings: JobOpening[] | null;
  }
  
  const dummyCompany: CompanyInfo[] = [
  {
    id: 1,
    name: "ABC Corporation",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "New York, USA",
    website: "https://www.abc-corp.com",
    jobOpenings: [
      {
        id: "1",
        title: "Software Engineer",
        status: "Open",
      },
      {
        id: "2",
        title: "Project Manager",
        status: "Close",
      },
      {
        id: "3",
        title: "Marketing Specialist",
        status: "Open",
      },
    ],
  },
];

const getColor = (jobstatus: any) => {
    switch (jobstatus) {
    case 'Open': return 'blue';
    case 'Close': return 'red';
    }
}
  
  const search = ref('');
  
  const { deleteJobPosting } = useJobPostingStore();
  
  const emit = defineEmits(['editJobPosting', 'deleteJobPosting']);
  
  const jobPostingHeaders = ref([
    { title: 'COMPANY ID', key: 'id', class: 'no-wrap' },
    { title: 'COMPANY NAME', key: 'name', class: 'no-wrap' },
    { title: 'DESCRIPTION', key: 'description', class: 'no-wrap' },
    { title: 'Location', key: 'location', class: 'no-wrap' },
    { title: 'ACTIONS', key: 'actions', class: 'no-wrap' },
  ]);
  

  const expandedRows = ref([]);

function findNewArrayIndex(arr1: any[], arr2: any[]) {
  for (let i = 0; i < arr1.length; i++) {
    if (!arr2.includes(arr1[i])) {
      return dummyCompany.indexOf(arr1[i]);
    }
  }
  return -1;
}

watch(expandedRows, (newVal, oldVal) => {
    if (newVal.length > oldVal.length) {
        let index = findNewArrayIndex(newVal, oldVal)
    }
})
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>