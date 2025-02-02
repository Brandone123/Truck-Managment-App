<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { defineProps, defineEmits } from 'vue'
import type { EmployeeInfo } from '@/types/store/employee';


const employeeStore = useEmployeeStore()
const { employeeList, loading: loadingEmployeeList, pagination: employeeListPagination, total_items } = storeToRefs(employeeStore)

const departmentStore = useDepartmentStore()
const { departmentList, loading: loadingDepartmentList } = storeToRefs(departmentStore)

const roleStore = useRoleStore()
const { roleList, loading: loadingRoletList } = storeToRefs(roleStore)


// onMounted(() => {
//     roleStore.fetchRoleList();
//     departmentStore.fetchDepartmentList();

//     employeeStore.fetchEmployeeList();
// });

const emit = defineEmits(['editEmployee', 'deleteEmployee', 'viewDetails'])
const employeeHeaders = ref([
    { title: 'ID ', key: 'id', class: "no-wrap" },
    { title: 'NAME ', key: 'first_name', class: "no-wrap" },
    // { title: 'LAST NAME', key: 'last_name', class: "no-wrap" },
    { title: 'ROLE', key: 'role_id', class: "no-wrap" },
    { title: 'EMAIL', key: 'user.email', class: "no-wrap" },
    { title: 'DEPARTMENT', key: 'department_id', class: "no-wrap" },
    { title: 'Employment Type', key: 'employment_type', class: "no-wrap" },
    { title: 'ADDRESS', key: 'address', class: "no-wrap" },
    // { title: 'ADDRESS 2', key: 'address2', class: "no-wrap" },
    { title: 'CITY', key: 'city', class: "no-wrap" },
    { title: 'STATE ', key: 'state', class: "no-wrap" },
    { title: 'HIRE DATE', key: 'hire_date', class: "no-wrap" },
    { title: 'TERMINATION DATE', key: 'termination_date', class: "no-wrap" },
    // { title: 'ZIP ', key: 'zip', class: "no-wrap" },
    { title: 'CELL PHONE', key: 'cell_phone', class: "no-wrap" },
    // { title: 'OTHER PHONE', key: 'other_phone', class: "no-wrap" },
    { title: 'ACTIONS', key: 'actions', class: "no-wrap" },

])

const selectedFilters = ref<Record<string, string>>({})
const selectedItems = ref<Array<number>>()
const activeFilter = ref<string>("all");

const pagination = computed({
    get() {
        return employeeListPagination.value
    },
    set(value) {
        employeeStore.setPagination(value);
    }
})

const searchQuery = computed(() => {
    let payload: Record<string, any> = {
        page: pagination.value.page,
        items_per_page: pagination.value.itemsPerPage,
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

    // if (activeFilter.value != 'all') {
    //     payload['filters'].commission_type = activeFilter.value
    // }

    // collect only technicians
    // payload['filters'].isTechnician = true

    return payload
})

onMounted(() => {
    employeeStore.fetchEmployeeList(searchQuery.value)
})

watch(() => selectedFilters.value, () => {
    selectedItems.value = [];
    employeeStore.fetchEmployeeList(searchQuery.value);
}, { deep: true })


watch(() => pagination.value, (newVal, oldVal) => {
    if (!_isEqual(newVal, oldVal)) {
        selectedItems.value = [];
        employeeStore.fetchEmployeeList(searchQuery.value);
    }
}, { deep: true })

watch(() => activeFilter.value, () => {
    selectedItems.value = [];
    employeeStore.fetchEmployeeList(searchQuery.value);
})



const editTemplate = (item: EmployeeInfo) => {
    emit('editEmployee', item)
}

const deleteTemplate = (employee_id: number) => {
    emit('deleteEmployee', employee_id)
}

const getDepartment = (department_id: number) => {
    return departmentList.value.find((item: any) => item.id == department_id)
}

const getRole = (role_id: number) => {
    return roleList.value.find((item: any) => item.id == role_id)
}

const initials = (name: string) => {
    return name?.split(' ').map((word: any) => word.charAt(0).toUpperCase()).join('') || 'N/A'
}

const avatarColor = (initials: string) => {
    if (initials == 'N/A') {
        return 'grey'
    }

    const hue = initials?.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0) % 360;
    return `hsl(${hue}, 80%, 70%)`;
}

</script>

<template>
    <SharedUiServerTable @update:selectedFilters="selectedFilters = $event" :show-footer-in-head="false"
        :items="employeeList" :headers="employeeHeaders" :selectable="true" v-model="selectedItems" :sticky-top="true"
        return-object :sticky-top-offset="55" :items-per-page="pagination.itemsPerPage" :loading="loadingEmployeeList"
        show-select :sort-by="pagination.sortBy" :items-length="total_items" @update:options="pagination = $event">
        <!-- <template v-slot:item.department_id="{ item }">
            {{ getDepartment(item.department_id)?.name }}
        </template>

<template v-slot:item.role_id="{ item }">
            {{ getRole(item.role_id)?.name || 'No role specified' }}
        </template> -->

        <template v-slot:item.first_name="{ item }">
            <div v-if="item.full_name" @click="emit('viewDetails', item)">
                <v-avatar size="x-small" :color="avatarColor(initials(item.full_name))">
                    {{ initials(item.full_name) }}
                </v-avatar>
                <span class="text-secondary ml-1" style="cursor: pointer">
                    {{ item.full_name }}
                </span>
            </div>
        </template>
        <template v-slot:item.classification="{ item }">
            <v-chip v-if="item.classification" color="grey" density="compact">{{ item.classification }}</v-chip>
        </template>
        <template v-slot:item.job_title="{ item }">
            <span>{{ item.job_title ? item.job_title : 'Not Provided' }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
            <div>
                <v-icon color="primary" dense @click="editTemplate(item)">mdi-pencil</v-icon>
                <v-icon color="red" dense @click="deleteTemplate(item.id)">mdi-delete</v-icon>
            </div>
        </template>
    </SharedUiServerTable>
</template>


<style scoped></style>