<template>
    <v-dialog v-model="dialog" scrollable width="800px">
      <template v-slot:activator="{ props }">
        <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          Add Department
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
          <v-form ref="departmentForm">
            <v-row class="my-4">
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field v-model="departmentInfo.name" variant="solo" flat label="Name" density="compact"  :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-0">
                  <v-textarea v-model="departmentInfo.description" variant="solo" flat label="Description"
                      density="compact"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="save">{{saveButtonText}}</v-btn>
          <v-btn color="primary" variant="text" @click="dialog = false">cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
<script setup lang="ts">
import { ref, computed,toRefs, watch } from 'vue'
import type { DepartmentInfo } from '@/types/store/department'

const emit = defineEmits(['update:show', 'addDepartment', 'editDepartment'])

const props = defineProps({
    item: {
        type: Object,
        required: false,
    },
    updating: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: false
    }
});

const dialog = computed({
    get() {
        return props.show
    },
    set(newValue) {
        emit('update:show', newValue);
    }
})


const departmentForm = ref(null)

const departmentListStore = useDepartmentStore()

const defaultDepartment = ref<DepartmentInfo>({
    id: null,
    name: null,
    description: null,
})

const departmentInfo = ref(defaultDepartment.value)

const title = computed(() => {
    return props.updating ? 'Department Info' : 'Create Department'
})

const saveButtonText = computed(() => {
    return props.updating ? 'update' : 'Save'
})

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = () => {
  if (props.updating) {
    departmentListStore.updateDepartment(departmentInfo.value);
  } else {
    departmentListStore.createDepartment(departmentInfo.value)
  }
      dialog.value = false;
};


const resetForm = () => {
    if (departmentForm.value) {
        (departmentForm.value as HTMLFormElement).reset(); // Reset the form
    }
}

watch(dialog, (val) => {
    if (val && props.updating) {
        departmentInfo.value = props.item as DepartmentInfo
    } else {
        // stopInfo.value = defaultDepartment.value
        resetForm()
    }
})
</script>

<style scoped>
  .v-progress-circular {
    margin: 1rem;
  }
  
.overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.error-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  background-color: red;
  color: white;
  font-weight: bold;
  border-radius: 5px;
}
</style>