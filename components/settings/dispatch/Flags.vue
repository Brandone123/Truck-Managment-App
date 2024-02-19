<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import EditFlag from '@/components/dispatch/EditFlag.vue';
import { useFlagStore } from '@/stores/settings/dispatch/flag';
import {type FlagInfo} from '@/stores/settings/dispatch/flag';

const flagStore = useFlagStore()
const { flagList } = storeToRefs(flagStore)
const editDialog = ref(false);
const editableFlag = ref({});

const headers = ref([
    { title: 'Flag Name', key: 'name', width: '30%', sortable: true },
    { title: 'Flag Status', key: 'status', width: '15%' },
    { title: 'Warn Days Before', key: 'warn_days_before' },
    { title: 'Warn Miles Before', key: 'warn_miles_before' },
    { title: 'Stop Days Before', key: 'stop_days_before' },
    { title: 'Stop Miles Before', key: 'stop_miles_before' },
    { title: 'Actions', key: 'actions' },
])

const statuses = ref([
    { name: 'Ignore', value: 'ignore' },
    { name: 'Warn', value: 'warn' },
    { name: 'Stop', value: 'stop' }
])
// Method to delete a flag
const deleteItem = (flagId: number) => {
  flagStore.removeFlag(flagId);
};
// Method to open the edit dialog with a flag's data
const openEditDialog = (flag:FlagInfo) => {
  editableFlag.value = { ...flag };
  editDialog.value = true;
};

// Method to update a flag and close the dialog
const updateFlag = (flag:FlagInfo) => {
  flagStore.updateFlag(flag);
};

</script>

<template>
    
    <DispatchAddFlag/>
    <SharedUiCustomTable :headers='headers' :items='flagList'>
        <template v-slot:item.status="{ item }">
            <v-select v-model="item.status" density="compact" variant="underlined" hide-details :value="item.status" :items="statuses"
                item-value="value" item-title="name">
            </v-select>
        </template>
        <!-- This is the new slot for the actions column -->
  <template v-slot:item.actions="{ item }">
    <v-row>
        <v-col>
            <v-btn color="primary" class="text-none" size="small" flat @click="openEditDialog(item)">Edit</v-btn>
        </v-col>    
        <v-col>
            <v-btn color="red" class="text-none" size="small" flat @click="deleteItem(item.id)">Delete</v-btn>
        </v-col>
</v-row>
  </template>
        
    </SharedUiCustomTable>
    <EditFlag :modelValue="editDialog" :flag="editableFlag" @update:modelValue="editDialog = $event" @save="updateFlag" />
</template>

