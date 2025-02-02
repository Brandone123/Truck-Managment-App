<template>
    <v-card @mouseover="isHovering = true" @mouseout="isHovering = false">
      <div class="pa-3">
        <v-row align="center">
          <v-col cols="6">
            <div class="d-flex align-center">
              <v-btn @click="isExpanded = !isExpanded" :class="{ rotated: isExpanded }" class="trigger-btn mr-2"
                density="comfortable" variant="text" icon="mdi-menu-right" size="medium"></v-btn>
                <v-text-field :readonly="editedItem.default ? true : false"
                :hint="editedItem.default ? 'Read only value' : ''" :persistent-hint="editedItem.default ? true : false"
                ref="labelInputRef" v-model="editedItem.label" variant="outlined" density="compact"
                    label="Label*" placeholder="Enter Label" :rules="[validation.required]"
                    hide-details></v-text-field>
            </div>
          </v-col>
          <v-col>
            <div class="d-flex justify-end align-center">
                <v-checkbox class="mr-2" v-model="editedItem.required" hide-details label="Required" color="primary"></v-checkbox>
                <v-btn class="mr-2" density="comfortable" variant="text" icon="mdi-content-copy" size="small"
                    @click="copyComponent"></v-btn>
                <v-btn :disabled="editedItem.default" density="comfortable" variant="text" icon="mdi-window-close" size="small"
                    @click="deleteComponent"></v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
      <v-expand-transition>
        <v-card-text v-if="isExpanded" class="pl-9">
          <v-row>
            <v-col cols="12" class="py-0">
              <v-textarea v-model="editedItem.description" hide-details variant="outlined" density="compact" rows="two"
                label="Description"></v-textarea>
            </v-col>
            <v-col cols="12" class="py-0 mt-5">
              <v-text-field v-model="editedItem.date" label="Select Date"
                type="date" variant="outlined" density="compact" hide-details></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-expand-transition>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, type PropType } from 'vue';
  import { useValidation } from '~/composables/formValidation';
  const validation = useValidation();
  
  interface DateField {
    id: string;
    type: 'date';
    label: string;
    required: boolean;
    description: string;
    date: string;
    default: boolean;
  }
  
  const emit = defineEmits(['update:modelValue', 'delete', 'copy', 'update:expanded']);
  
  const props = defineProps({
    modelValue: {
      type: Object as PropType<DateField>,
      required: true,
      default: {} as DateField,
    },
    expanded: {
      type: Boolean,
      default: true,
    },
  });
  
  const isHovering = ref<boolean>(false);
  const editedItem = ref<DateField>(props.modelValue);
  
  const isExpanded = computed({
    get() {
      return props.expanded;
    },
    set(value) {
      emit('update:expanded', value);
    },
  });
  
  watch(props.modelValue, (newValue) => {
    if (newValue) {
      editedItem.value = JSON.parse(JSON.stringify(newValue));
    }
  });
  
  watch(
    editedItem,
    (newVal) => {
      const payload = JSON.parse(JSON.stringify(newVal));
      emit('update:modelValue', payload);
    },
    { deep: true }
  );
  
  const deleteComponent = () => {
    emit('delete');
  };
  
  const copyComponent = () => {
    emit('copy');
  };
  </script>
  
  <style scoped>
  .trigger-btn {
    transition: transform 0.3s ease;
  }
  
  .trigger-btn.rotated {
    transform: rotate(90deg);
  }
  </style>