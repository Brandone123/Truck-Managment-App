<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useApplicantStore } from '@/stores/recruiting/applicant';
import { ref, computed, watch } from 'vue';
import type { ApplicantInfo } from '@/types/recruiting/applicant';

const emit = defineEmits(['update:show', 'addApplicant', 'editApplicant']);

const props = defineProps({
    item: {
        type: Object as () => ApplicantInfo,
        required: false,
    },
    updating: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: false
    },
});

const dialog = computed({
  get() {
    return props.show;
  },
  set(newValue) {
    emit('update:show', newValue);
  },
});

const applicantForm = ref(null);

const ApplicantListStore = useApplicantStore();

const advertisementChannelsType = ref([
'Online job boards', 'Social media', 'Compagny Website', 'Industry Publications'
])

const defaultApplicant = ref<ApplicantInfo>({
    id: null,
    first_name: null,
    last_name: null,
    email: null,
    phone_number: null,
    address: null,
    status: null,
})

const applicantInfo = ref(defaultApplicant.value);

const title = computed(() => {
  return props.updating ? 'Applicant Info' : 'Create Applicant';
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Add Applicant';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

const save = () => {
  if (props.updating) {
    ApplicantListStore.updateApplicant(applicantInfo.value);
  } else {
    ApplicantListStore.createApplicant(applicantInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (applicantForm.value) {
    (applicantForm.value as HTMLFormElement).reset(); // Reset the form
  }
};

watch(dialog, (val) => {
  if (val && props.updating) {
    applicantInfo.value = Object.assign({}, props.item as ApplicantInfo)
  } else {
      resetForm()
  }
})

</script>

<template>
   <v-dialog v-model="dialog" scrollable width="800px">
      <template v-slot:activator="{ props }">
        <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          Add Applicant
        </v-btn>
      </template>
    <v-card class="grey-background">
        <v-toolbar color="primary" :title="title" density="compact">
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="applicantForm">
            <v-row class="my-4">
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="applicantInfo.first_name" label="First Name" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="applicantInfo.last_name" label="Last Name" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="applicantInfo.email" variant="solo" flat density="compact" label="Email" required></v-text-field>
                </v-col>
                
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="number" v-model="applicantInfo.phone_number" label="Phone Number" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="applicantInfo.address" variant="solo" flat density="compact" label="Address" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-select v-model="applicantInfo.status" label="Status" :items="advertisementChannelsType"
                     :rules="[rules.required]" variant="solo" flat density="compact">
                    </v-select>
                </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" @click="save">
                {{ saveButtonText }}
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
