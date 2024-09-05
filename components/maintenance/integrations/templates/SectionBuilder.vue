<template>
    <v-card outlined class="mb-4">
      <v-card-title>
        <span>Sections and Items</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="addSection">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row v-for="(section, sectionIndex) in localSections" :key="section.id">
            <v-col cols="12">
              <v-text-field
                v-model="section.name"
                label="Section Name"
                @blur="updateSection(sectionIndex)"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn text @click="addItem(sectionIndex)">
                <v-icon>mdi-plus</v-icon>
                Add Item
              </v-btn>
            </v-col>
            <v-col cols="12" v-for="(item, itemIndex) in section.items" :key="item.id">
              <v-text-field
                v-model="item.name"
                label="Item Name"
                @blur="updateItem(sectionIndex, itemIndex)"
              ></v-text-field>
              <v-select
                v-model="item.type"
                :items="fieldTypes"
                label="Field Type"
                @change="updateItem(sectionIndex, itemIndex)"
              ></v-select>
              <v-btn icon @click="removeItem(sectionIndex, itemIndex)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </v-col>
            <v-divider class="mt-4"></v-divider>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import type { Section, Item } from '@/types/maintenance/templatesTypes';
  import { v4 as uuidv4 } from 'uuid';
  
  const props = defineProps({
    sections: {
      type: Array as () => Section[],
      required: true,
      default: () => []
    },
  });
  
  const emit = defineEmits(['update:sections']);
  
  const localSections = ref<Section[]>([...props.sections]);
  
  const fieldTypes = ['Text', 'Number', 'Boolean', 'File'];
  
  const addSection = () => {
    localSections.value.push({
      id: uuidv4(),
      name: '',
      items: [],
    });
    emit('update:sections', localSections.value);
  };
  
  const updateSection = (index: number) => {
    emit('update:sections', localSections.value);
  };
  
  const addItem = (sectionIndex: number) => {
    localSections.value[sectionIndex].items.push({
      id: uuidv4(),
      name: '',
      type: 'Text',
    });
    emit('update:sections', localSections.value);
  };
  
  const updateItem = (sectionIndex: number, itemIndex: number) => {
    emit('update:sections', localSections.value);
  };
  
  const removeItem = (sectionIndex: number, itemIndex: number) => {
    localSections.value[sectionIndex].items.splice(itemIndex, 1);
    emit('update:sections', localSections.value);
  };
  </script>
  
  <style scoped>
  .mb-4 {
    margin-bottom: 1rem;
  }
  .mt-4 {
    margin-top: 1rem;
  }
  </style>
  