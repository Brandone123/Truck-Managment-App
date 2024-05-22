<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useMaterialMarketingStore } from '@/stores/marketing/material';
import { ref, computed, watch } from 'vue';
import type { MaterialMarketingInfo } from '@/types/marketing/material';

const emit = defineEmits(['update:show', 'addMaterial', 'editMaterial']);

const props = defineProps({
    item: {
        type: Object as () => MaterialMarketingInfo,
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

const materialForm = ref(null);

const MaterialListStore = useMaterialMarketingStore();

const defaultMaterial = ref<MaterialMarketingInfo>({
  id: null,
  material_name: null,
  type: null,
  file_path: null,
  description: null,
})

const materialInfo = ref(defaultMaterial.value);

const title = computed(() => {
  return props.updating ? 'Material Info' : 'Create Material';
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Add Material';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

function handleFileChange(event:any) {
    const file = event.target.files[0];
    materialInfo.value.file_path = file ? file.name : null;
}

const save = () => {
  if (props.updating) {
    MaterialListStore.updateMaterial(materialInfo.value);
  } else {
    MaterialListStore.createMaterial(materialInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (materialForm.value) {
    (materialForm.value as HTMLFormElement).reset(); // Reset the form
  }
};

watch(dialog, (val) => {
  if (val && props.updating) {
    materialInfo.value = Object.assign({}, props.item as MaterialMarketingInfo)
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
          Add Material
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
          <v-form ref="materialForm">
            <v-row class="my-4">
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="materialInfo.material_name" label="Material Name" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-select v-model="materialInfo.type" :items="['Flyer', 'Banner', 'Video', 'Text', 'Email']" label="Type" variant="solo" flat density="compact" :rules="[rules.required]"></v-select>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-file-input @change="handleFileChange" variant="solo" flat density="compact" label="File input" filled></v-file-input>                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-textarea v-model="materialInfo.description" variant="solo" flat density="compact" label="Description" rows="4" required></v-textarea>
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
