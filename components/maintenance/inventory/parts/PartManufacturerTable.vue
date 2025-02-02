<template>
  <div>
    <SharedUiCustomTable :show-footer-in-head="false" :headers="headers" :items="partManufacturers" :loading="loading"
      @update:selectedFilters="selectedFilters = $event" :sticky-top="true" :sticky-top-offset="55"
      v-model="selectedItems" return-object :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy"
      :items-length="total_items" @update:options="pagination = $event">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" @click="emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" @click="emit('delete', item.id)">mdi-delete</v-icon>

      </template>
    </SharedUiCustomTable>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePartManufacturerStore } from '~/stores/maintenance/partManufacturer';
const router = useRouter();
const selectedFilters = ref<Record<string, string>>({})
const activeFilter = ref<string>("all");
const selectedItems = ref<Array<any>>([])

const emit = defineEmits(['view', 'edit', 'delete']);


const partManufacturerStore = usePartManufacturerStore()
const { partManufacturers, loading, pagination: partMeasurerPagination, total_items, } = storeToRefs(partManufacturerStore)
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Website', key: 'website' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const pagination = computed({
  get() {
    return partMeasurerPagination.value
  },
  set(value) {
    partManufacturerStore.setPagination(value);
  }
})

const searchQuery = computed(() => {
  let payload: Record<string, any> = {
    page: pagination.value.page,
    items_per_page: 10,
  }

  if (pagination.value.sortBy.length > 0) {
    payload['sort_by'] = pagination.value.sortBy[0]
  }

  if (Boolean(pagination.value.search)) {
    payload['search'] = pagination.value.search
  }

  payload['filters'] = {}

  if (Object.keys(selectedFilters.value).length > 0) {
    payload['filters'] = selectedFilters.value
  }

  if (activeFilter.value != 'all' && payload['filters'].status != null) {
    payload['filters'].status.status = activeFilter.value
  }

  return payload
})

watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  partManufacturerStore.fetchPartManufacturer();
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    partManufacturerStore.fetchPartManufacturer();
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  partManufacturerStore.fetchPartManufacturer();
})

onMounted(() => {
  partManufacturerStore.fetchPartManufacturer()
});
</script>