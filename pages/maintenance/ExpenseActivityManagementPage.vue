<template>
    <div>
      <div class="d-flex justify-space-between mb-16">
        <span class="text-primary text-h6">Expense and Activity Management</span>
        <v-btn color="primary" @click="openAddDialog">Add Expense/Activity</v-btn>
      </div>
  
      <ExpenseActivityDetailsDialog :modelValue="detailsDialog" :expenseActivity="selectedItem" @update:modelValue="detailsDialog = $event" />
      <AddEditExpenseActivityDialog :modelValue="addEditDialog" :expenseActivity="selectedItem" @update:modelValue="addEditDialog = $event" @save="saveItem" />
      <DeleteConfirmationDialog :modelValue="deleteDialog" @confirm="deleteItem" @update:modelValue="deleteDialog = $event" />
  
      <SharedUiCustomTable :filters="filtersAssets" :showFooterInHead="false" :headers="tableHeaders" :items="itemList" :loading="loading">
        <template v-slot:item.actions="{ item }">
          <v-icon class="ml-2" color="primary" dense @click="viewDetails(item)">mdi-eye</v-icon>
          <v-icon class="ml-2" color="primary" dense @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon class="ml-2" color="red" dense @click="confirmDelete(item.id)">mdi-delete</v-icon>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusClass(item)"  size="small">
            {{ item.status }}
          </v-chip>
        </template>
      </SharedUiCustomTable>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useExpenseActivityStore } from '@/stores/maintenance/expenseActivityStore';
  import ExpenseActivityDetailsDialog from '@/components/maintenance/services/expense/ExpenseActivityDetailsDialog.vue';
  import AddEditExpenseActivityDialog from '@/components/maintenance/services/expense/AddEditExpenseActivityDialog.vue';
  import DeleteConfirmationDialog from '@/components/maintenance/services/expense/DeleteConfirmationDialog.vue';
  import type { filterItem } from '~/types/layout/table';

  const store = useExpenseActivityStore();
  const { itemList, loading } = storeToRefs(store);
  
  const search = ref('');
  const filterType = ref('');
  
  const typeOptions = ['Labor', 'Parts', 'Total'];
  
  const detailsDialog = ref(false);
  const addEditDialog = ref(false);
  const deleteDialog = ref(false);
  const filtersAssets = ref<filterItem[]>([]);
  
  const selectedItem = ref({
      id: null,
      asset_id: null,
      asset_name: '',
      type: '',
      expense_activity_type: '',
      date: '',
      technician_vendor: '',
      description: '',
      cost: null,
      status: '',
      notes: '',
    }
  );
  
  const openAddDialog = () => {
    selectedItem.value = {
      id: null,
      asset_id: null,
      asset_name: '',
      type: '',
      expense_activity_type: '',
      date: '',
      technician_vendor: '',
      description: '',
      cost: null,
      status: '',
      notes: '',
    }
    addEditDialog.value = true;
  };
  
  const viewDetails = (item: any) => {
    selectedItem.value = item;
    detailsDialog.value = true;
  };
  
  const editItem = (item: any) => {
    selectedItem.value = item;
    addEditDialog.value = true;
  };
  
  const confirmDelete = (id: any) => {
    selectedItem.value = { ...id };
    deleteDialog.value = true;
  };
  
  const deleteItem = async (id: number) => {
    await store.deleteExpenseActivity(id);
  };
  
  const saveItem = async (item: any) => {
    if (item.id) {
      await store.updateExpenseActivity(item);
    } else {
      await store.createExpenseActivity(item);
    }
    addEditDialog.value = false;
  };
  
  // const filteredItems = computed(() => {
  //   return itemList.value
  //     .filter(item => item.asset_name.toLowerCase().includes(search.value.toLowerCase()) || item.id.toString().includes(search.value.toLowerCase()))
  //     .filter(item => !filterType.value || item.type === filterType.value)
  //     .slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value);
  // });
  
  const tableHeaders = [
    { title: 'Expense/Activity ID', key: 'id' },
    { title: 'Asset ID', key: 'asset_id' },
    { title: 'Asset Name', key: 'asset_name' },
    { title: 'Type', key: 'type' },
    { title: 'Expense/Activity Type', key: 'expense_activity_type' },
    { title: 'Date', key: 'date' },
    { title: 'Technician/Vendor', key: 'technician_vendor' },
    { title: 'Cost', key: 'cost' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions' },
  ];

  const filteredExpenses = computed(() => {
    return itemList.value?.map(expense => {
      return [expense.type]
    }) || []
  })

  function initializeFilters() {
    filtersAssets.value = [
      {
        title: 'Filter by Task Type',
        key: 'type',
        items: filteredExpenses,
        width: '300px',
      },
    ];
  }

  const getStatusClass = (expense: any) => {
    const expenseData = itemList.value.find((data: any) => data.id === expense.id);
    if (expenseData?.status) {
      if (expenseData?.status === "Pending") {
          return 'green'; 
      } else if (expenseData?.status === "Completed") {
          return 'primary'; 
      } else if (expenseData?.status === "In Progress") {
          return 'error'
      }
    }
    return '';
  }
  
  onMounted(() => {
    store.fetchItems();
  });

  watchEffect(() => {
    if (itemList.value) {
      initializeFilters();
    }
  });
  </script>
  
  <style scoped>
  </style>
  