<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useDepartmentStore } from '@/stores/department'
import type { DepartmentInfo } from '@/types/store/department';


const departmentStore = useDepartmentStore()
const { departmentList, loading } = storeToRefs(departmentStore)

onMounted(() => {
    departmentStore.fetchDepartmentList();
});

const emit = defineEmits(['editDepartment', 'deleteDepartment'])
const departmentHeaders = ref([
    { title: 'DEPARTMENT ID', key: 'id', class: "no-wrap" },
    { title: 'NAME ', key: 'name', class: "no-wrap" },
    { title: 'DESCRIPTION', key: 'description', class: "no-wrap" },
    { title: 'ACTIONS', key: 'actions', class: "no-wrap" },

])

// const print = (items: Array<any>) => {
//     // add print  logic
//     console.log(items[0])
// }

// const sendNotifications = (items: Array<any>) => {
//     // add send notification logic
// }

const editTemplate = (item: DepartmentInfo) => {
    emit('editDepartment', item)
}

const deleteTemplate = (department_id: number) => {
    emit('deleteDepartment', department_id)
}

// const findLastIndex = (array: Array<any>, callback: Function) => {
//     for (let i = array.length - 1; i >= 0; i--) {
//         if (callback(array[i], i, array)) {
//             return i;
//         }
//     }
//     return -1;
// }


</script>
<template>
    <SharedUiCustomTable return-object show-select :headers="departmentHeaders" :items="departmentList" :loading="loading">
        <template v-slot:item.actions="{ item }">
            <div>
                <v-icon color="primary" dense @click="editTemplate(item)">mdi-pencil</v-icon>
                <v-icon color="red" dense @click="deleteTemplate(item.id)">mdi-delete</v-icon>
            </div>
        </template>
    </SharedUiCustomTable>
</template>


<style scoped ></style>