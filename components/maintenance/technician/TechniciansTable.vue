<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { defineProps, defineEmits } from 'vue'
import type { EmployeeInfo } from '@/types/store/employee';


const technicianStore = useTechniciansStore()
const { technicianList, loading: loadingTechnicianList, pagination: technicianListPagination, total_items } = storeToRefs(technicianStore)

const departmentStore = useDepartmentStore()
const { departmentList, loading: loadingDepartmentList } = storeToRefs(departmentStore)

const roleStore = useRoleStore()
const { roleList, loading: loadingRoletList } = storeToRefs(roleStore)


const hoveredRow = ref<number | null>(null)

// onMounted(() => {
//     roleStore.fetchRoleList();
//     departmentStore.fetchDepartmentList();

//     technicianStore.fetchTechnicianList();
// });

const emit = defineEmits(['editTechnician', 'deleteTechnician', 'viewDetails'])
const technicianHeaders = ref([
    { title: 'Name ', key: 'first_name', class: "no-wrap" },
    { title: 'Email', key: 'email', class: "no-wrap" },
    { title: 'Job Title', key: 'job_title', class: "no-wrap" },
    { title: 'Classification', key: 'classification', class: "no-wrap" },
    { title: 'Employment Type', key: 'employment_type', class: "no-wrap" },
    { title: 'Hire Date', key: 'hire_date', class: "no-wrap" },
    { title: 'Phone', key: 'cell_phone', class: "no-wrap" },
    { title: '', key: 'actions', sortable: false, width: '200px', align:'end' }
])

const selectedFilters = ref<Record<string, string>>({})
const selectedItems = ref<Array<number>>()
const activeFilter = ref<string>("all");

const pagination = computed({
    get() {
        return technicianListPagination.value
    },
    set(value) {
        technicianStore.setPagination(value);
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
    payload['filters'].isTechnician = true

    return payload
})

onMounted(() => {
    technicianStore.fetchTechnicianList(searchQuery.value)
})

watch(() => selectedFilters.value, () => {
    selectedItems.value = [];
    technicianStore.fetchTechnicianList(searchQuery.value);
}, { deep: true })


watch(() => pagination.value, (newVal, oldVal) => {
    if (!_isEqual(newVal, oldVal)) {
        selectedItems.value = [];
        technicianStore.fetchTechnicianList(searchQuery.value);
    }
}, { deep: true })

watch(() => activeFilter.value, () => {
    selectedItems.value = [];
    technicianStore.fetchTechnicianList(searchQuery.value);
})



const editTemplate = (item: EmployeeInfo) => {
    emit('editTechnician', item)
}

const deleteTemplate = (employee_id: number) => {
    emit('deleteTechnician', employee_id)
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
    <SharedUiServerTable class="custom-table" @update:selectedFilters="selectedFilters = $event"
        :show-footer-in-head="false" :items="technicianList" :headers="technicianHeaders" :selectable="true"
        v-model="selectedItems" :sticky-top="true" return-object :sticky-top-offset="55"
        :items-per-page="pagination.itemsPerPage" :loading="loadingTechnicianList" show-select
        :sort-by="pagination.sortBy" :items-length="total_items" @update:options="pagination = $event"
        @hoveredRow="hoveredRow = $event;">
        <!-- <template v-slot:item.department_id="{ item }">
            {{ getDepartment(item.department_id)?.name }}
        </template>

<template v-slot:item.role_id="{ item }">
            {{ getRole(item.role_id)?.name || 'No role specified' }}
        </template> -->

        <template v-slot:item.first_name="{ item }">
            <div v-if="item.full_name" @click="emit('viewDetails', item.user_id)">
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

        <template v-slot:item.actions="{ item, index }">
            <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
                <v-list-item @click="$emit('viewDetails',item.id)" append-icon="mdi-eye">View Details</v-list-item>
                <v-list-item @click="editTemplate(item)" append-icon="mdi-pencil">Edit</v-list-item>
                <v-list-item @click="deleteTemplate(item.id)" append-icon="mdi-delete">Delete</v-list-item>
            </SharedTableActionMenu>
        </template>
    </SharedUiServerTable>
</template>


<style scoped>
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: sticky;
  right: 0;
  width: 20px;
}
</style>