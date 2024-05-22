<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { DepartmentInfo } from '@/types/store/department';
import type { DailyDutyInfo, PositionInfo } from '@/types/employeeInformationAndOperation/position';

const departmentStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentStore)

const positionStore = usePositionStore()
const { positionList } = storeToRefs(positionStore)

const dailyDutyStore = useDailyDutyStore()
const { dailyDutyList } = storeToRefs(dailyDutyStore)

const layoutStore = useLayoutStore()

onMounted(() => {
    positionStore.fetchPositionList();
    dailyDutyStore.fetchDailyDutyList();
    departmentStore.fetchDepartmentList();
});

const departmentHeaders = ref([
    { title: 'DEPARTMENT ID', key: 'id', class: "no-wrap" },
    { title: 'NAME ', key: 'name', class: "no-wrap" },
    { title: 'DESCRIPTION', key: 'description', class: "no-wrap" },
    { title: 'ACTIONS', key: 'actions', class: "no-wrap" },
])

const positionHeaders = ref([
    { title: 'POSITION ID', key: 'id', class: "no-wrap" },
    { title: 'TITLE ', key: 'title', class: "no-wrap" },
    { title: 'DESCRIPTION', key: 'description', class: "no-wrap" },
    // { title: 'DUTIES', key: 'duties', class: "no-wrap" },
    { title: 'ACTIONS', key: 'actions', class: "no-wrap" },
])

const dutyHeaders = ref([
    { title: 'DUTY ID', key: 'id', class: "no-wrap" },
    { title: 'DESCRIPTION', key: 'description', class: "no-wrap" },
    { title: 'FREQUENCY', key: 'frequency', class: "no-wrap" },
    { title: 'ACTIONS', key: 'actions', class: "no-wrap" },
])

const currentWindow = ref<string>('department')
const selectedDepartmentId = ref<number | null>(null)


const editedPosition = ref<PositionInfo>({})
const updatingPosition = ref(false)
const positionDialog = ref(false)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const editPosition = (position: PositionInfo) => {
    editedPosition.value = Object.assign({}, position)
    updatingPosition.value = true
    positionDialog.value = true
}

const deletePosition = async (position_id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
        positionStore.deletePosition(position_id)
    }
}

const updatePositionDialog = (value: boolean) => {
    positionDialog.value = value
    editedPosition.value = {}
    updatingPosition.value = false
}

const departmentalPositions = computed(() => {
    return positionList.value.filter((position: PositionInfo) => position.department_id == selectedDepartmentId.value)
})

const showPositions = (departmentId: number) => {
    selectedDepartmentId.value = departmentId
    currentWindow.value = 'positions'
}

const showDepartments = () => {
    currentWindow.value = 'departments'
    selectedDepartmentId.value = null
}

</script>

<template>
    <v-window v-model="currentWindow">
        <v-window-item value="departments">
            <div>
                <SharedUiCustomTable return-object :headers="departmentHeaders" :items="departmentList">
                    <!-- Slot to capture bulk actions -->
                    <!-- <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                        <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                            <v-icon>mdi-printer</v-icon> Print
                        </v-btn>
                    </template> -->

                    <template #item.actions="{ item }">
                        <v-btn color="primary" density="compact" class="text-none" @click="showPositions(item.id)">
                            Positions
                            <v-icon dark>mdi-chevron-right</v-icon>
                        </v-btn>

                    </template>
                </SharedUiCustomTable>
            </div>
        </v-window-item>


        <v-window-item value="positions">
            <v-row no-gutters class="my-2">
                <v-btn density="comfortable" class="text-none" color="primary" @click="showDepartments">
                    <v-icon dark>mdi-chevron-left</v-icon>
                    Departments
                </v-btn>

                <v-spacer></v-spacer>
                <EmployeeInformationAndOperationSettingsPositionDialog :show="positionDialog"
                    @update:show="updatePositionDialog" :updating="updatingPosition" :item="editedPosition"
                    :selectedDepartmentId="selectedDepartmentId" />
            </v-row>
            <div>
                <SharedUiCustomTable show-expand no-data-text="No available positions" return-object
                    :headers="positionHeaders" :items="departmentalPositions" :showFooterInHead="false">
                    <!-- Slot to capture bulk actions -->
                    <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                        <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                            <v-icon>mdi-printer</v-icon> Print
                        </v-btn>
                    </template>

                    <template #item.actions="{ item }">
                        <v-icon color="primary" dense @click="editPosition(item)">mdi-pencil</v-icon>
                        <v-icon color="red" dense @click="deletePosition(item.id)">mdi-delete</v-icon>
                    </template>


                    <!-- expand template slot showing position duties -->
                    <template v-slot:expanded-row="{ columns, item }">
                        <tr>
                            <td :colspan="columns.length">
                                <EmployeeInformationAndOperationSettingsPositionDailyDutyTable
                                    :selectedPositionId="item.id" />
                            </td>
                        </tr>
                    </template>
                </SharedUiCustomTable>
            </div>
        </v-window-item>
    </v-window>

</template>

<style scoped></style>