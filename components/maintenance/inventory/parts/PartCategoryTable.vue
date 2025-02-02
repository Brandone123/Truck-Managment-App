<template>
    <div>
      <SharedUiCustomTable :show-footer-in-head="false" :headers="headers" @hoveredRow="hoveredRow = $event;"
        :items="partCategories" :loading="loading" @update:selectedFilters="selectedFilters = $event" :sticky-top="true"
        :sticky-top-offset="55" v-model="selectedItems" return-object>
        <template v-slot:item.actions="{ item, index }">
        <div v-if="item.default !== 1">
          <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
            <v-list-item  @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
            <v-list-item  @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
          </SharedTableActionMenu>
        </div>
    </template>
  
      </SharedUiCustomTable>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
import { usePartCategoryStore } from '~/stores/maintenance/partCategoryStore';
  
  const router = useRouter();
  const selectedFilters = ref<Record<string, string>>({})
  const activeFilter = ref<string>("all");
  const selectedItems = ref<Array<any>>([])
  const hoveredRow = ref<number | null>(null)
  
  const emit = defineEmits(['view', 'edit', 'delete']);
  
  const partCategoryStore = usePartCategoryStore()
  const { partCategories, loading} = storeToRefs(partCategoryStore)
  const headers = [
    { title: 'Name', key: 'name' },
    { title: 'Description', key: 'description' },
    { title: '', key: 'actions', sortable: false, width: '200px', align: 'end' },
    ];
  onMounted(() => {
    partCategoryStore.fetchPartCategory()
  });
  </script>