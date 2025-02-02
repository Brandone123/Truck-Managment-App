<template>
    <v-card @mouseover="isHovering = true" @mouseout="isHovering = false">
      <div class="pa-3">
        <v-row align="center">
          <v-col cols="6">
            <div class="d-flex align-center">
              <v-btn @click="isExpanded = !isExpanded" :class="{ rotated: isExpanded }"
                class="trigger-btn mr-2" density="comfortable" variant="text" icon="mdi-menu-right"
                size="medium"></v-btn>
              <v-text-field :readonly="editedItem.default ? true : false"
              :hint="editedItem.default ? 'Read only value' : ''" :persistent-hint="editedItem.default ? true : false" ref="labelInputRef" v-model="editedItem.label" variant="outlined"
                density="compact" label="Grid Label*" placeholder="Enter Grid Label"
                :rules="[validation.required]" hide-details></v-text-field>
            </div>
          </v-col>
          <v-col>
            <div class="d-flex justify-end align-center">
              <v-chip class="mr-2">
                <v-icon color="grey">mdi-grid</v-icon> Multiple Choice Grid
              </v-chip>
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
              <v-checkbox v-model="editedItem.required" hide-details label="Required"
                color="primary"></v-checkbox>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-text-field v-model="editedItem.description" hide-details variant="outlined" density="compact"
                label="Short Description"></v-text-field>
            </v-col>
          </v-row>
          <p class="mt-8 mb-4 text-body-1">Rows</p>
          <v-row>
            <v-col cols="12">
              <draggable v-model="editedItem.rows" handle=".handle">
                <div class="list-group-item mb-3" v-for="(row, i) in editedItem.rows" :key="i" :data-index="i">
                  <v-text-field v-model="row.label" :rules="[validation.required]" hide-details
                    variant="outlined" density="compact" label="Row Label*">
                    <template v-slot:append>
                      <v-btn class="ml-2" icon="mdi-window-close" size="small" variant="text"
                        @click="removeRow(i)"></v-btn>
                    </template>
                    <template v-slot:prepend>
                      <v-btn class="ml-2 grabbable handle" icon="mdi-dots-grid" size="small"
                        variant="text"></v-btn>
                    </template>
                  </v-text-field>
                </div>
              </draggable>
            </v-col>
            <v-col>
              <v-btn variant="text" @click="addRow" class="text-none" color="primary">
                <v-icon>mdi-plus</v-icon> Add Row
              </v-btn>
            </v-col>
          </v-row>
          <p class="mt-8 mb-4 text-body-1">Columns</p>
          <v-row>
            <v-col cols="12">
              <draggable v-model="editedItem.columns" handle=".handle">
                <div class="list-group-item mb-3" v-for="(column, i) in editedItem.columns" :key="i">
                  <v-text-field v-model="column.label" :rules="[validation.required]" hide-details
                    variant="outlined" density="compact" label="Column Label*">
                    <template v-slot:append>
                      <v-btn class="ml-2" icon="mdi-window-close" size="small" variant="text"
                        @click="removeColumn(i)"></v-btn>
                    </template>
                    <template v-slot:prepend>
                      <v-btn class="ml-2 grabbable handle" icon="mdi-dots-grid" size="small"
                        variant="text"></v-btn>
                    </template>
                  </v-text-field>
                </div>
              </draggable>
            </v-col>
            <v-col>
              <v-btn variant="text" @click="addColumn" class="text-none" color="primary">
                <v-icon>mdi-plus</v-icon> Add Column
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-expand-transition>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, type PropType } from 'vue'
  import { VueDraggableNext as draggable } from 'vue-draggable-next'
  import { useValidation } from '~/composables/formValidation'
  
  const validation = useValidation()
  
  interface MultipleChoiceGrid {
    id: string
    type: 'multiple_choice_grid'
    label: string
    required: boolean
    description: string
    rows: { label: string }[]
    columns: { label: string }[]
    default: boolean;
  }
  
  const emit = defineEmits(['update:modelValue', 'delete', 'copy', 'update:expanded'])
  
  const props = defineProps({
    modelValue: {
      type: Object as PropType<MultipleChoiceGrid>,
      required: true,
      default: {} as MultipleChoiceGrid
    },
    expanded: {
      type: Boolean,
      default: true
    }
  })
  
  const isHovering = ref<boolean>(false)
  const isExpanded = computed({
    get() {
      return props.expanded
    },
    set(value) {
      emit('update:expanded', value)
    }
  })
  const editedItem = ref<MultipleChoiceGrid>(props.modelValue)
  
  watch(props.modelValue, (newValue) => {
    editedItem.value = JSON.parse(JSON.stringify(newValue))
  })
  
  watch(editedItem, (newVal) => {
    emit('update:modelValue', JSON.parse(JSON.stringify(newVal)))
  }, { deep: true })
  
  const addRow = () => {
    editedItem.value.rows.push({ label: '' })
  }
  
  const removeRow = (index: number) => {
    editedItem.value.rows.splice(index, 1)
  }
  
  const addColumn = () => {
    editedItem.value.columns.push({ label: '' })
  }
  
  const removeColumn = (index: number) => {
    editedItem.value.columns.splice(index, 1)
  }
  
  const deleteComponent = () => {
    emit('delete')
  }
  
  const copyComponent = () => {
    emit('copy')
  }
  </script>
  
  <style scoped>
  .trigger-btn {
    transition: transform 0.3s ease;
  }
  
  .trigger-btn.rotated {
    transform: rotate(90deg);
  }
  
  .grabbable {
    cursor: grab;
  }
  
  .grabbable:active {
    cursor: grabbing !important;
  }
  </style>