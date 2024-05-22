<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { AllEmployeeBenefitInfo, EmployeeBenefitInfo, BenefitInfo } from '@/types/employeeInformationAndOperation/benefit'

const benefitStore = useBenefitStore()
const { benefitList } = storeToRefs(benefitStore)

const employeeStore = useEmployeeStore()

const employeeBenefitStore = useEmployeeBenefitStore()
const { employeeBenefitList } = storeToRefs(employeeBenefitStore)

const layoutStore = useLayoutStore()

onMounted(() => {
    employeeStore.fetchEmployeeList();
    benefitStore.fetchBenefitList();
    employeeBenefitStore.fetchEmployeeBenefitList();

});

const employeeBenefitHeaders = ref([
    { title: 'ID ', key: 'id', class: "no-wrap" },
    { title: 'Employee Name ', key: 'full_name', class: "no-wrap" },
    { title: 'EMAIL', key: 'email', class: "no-wrap" },
    { title: 'DEPARTMENT', key: 'department.name', class: "no-wrap" },
    { title: 'BENEFITS ASSIGNED', key: 'benefits', class: "no-wrap", sortable: false, align: 'center' },
])

const benefitHeaders = ref([
    { title: 'Benefit', value: 'benefit.name' },
    { title: 'Start Date', value: 'start_date' },
    { title: 'End Date', value: 'end_date' },
    { title: 'Actions', value: 'actions' },
])


const editedEmployeeBenefit = ref<EmployeeBenefitInfo>({})
const updatingEmployeeBenefit = ref(false)
const employeeBenefitDialog = ref(false)

const selectedEmployeeId = ref<number | null>(null)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const editEmployeeBenefit = (employeeBenefit: EmployeeBenefitInfo) => {
    editedEmployeeBenefit.value = Object.assign({}, employeeBenefit)
    updatingEmployeeBenefit.value = true
    employeeBenefitDialog.value = true
}

const assignEmployeeBenefit = (employee_id: number) => {
    selectedEmployeeId.value = employee_id
    employeeBenefitDialog.value = true
}

const updateEmployeeBenefitDialog = (value: boolean) => {
    employeeBenefitDialog.value = value
    editedEmployeeBenefit.value = {}
    updatingEmployeeBenefit.value = false
}



const getBenefits = (benefits: EmployeeBenefitInfo[]) => {
    return benefits.map(employeeBenefit => {
        return {
            ...employeeBenefit,
            benefit: benefitList.value.find((benefit: BenefitInfo) => benefit.id == employeeBenefit.benefit_id)
        }
    })
}

const deleteEmployeeBenefit = async (employee_id: number, employee_benefit_id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
        employeeBenefitStore.deleteEmployeeBenefit(employee_id, employee_benefit_id)
    }
}


watch(employeeBenefitDialog, (val) => {
    if (!val) {
        selectedEmployeeId.value = null
    }
})

</script>
<template>
    <div>
        <EmployeeInformationAndOperationSettingsEmployeeBenefitDialog :show="employeeBenefitDialog"
            @update:show="updateEmployeeBenefitDialog" :updating="updatingEmployeeBenefit" :item="editedEmployeeBenefit"
            :selectedEmployeeId="selectedEmployeeId" />
    </div>
    <div>
        <SharedUiCustomTable return-object show-expand :headers="employeeBenefitHeaders" :items="employeeBenefitList">

            <!-- Slot to capture bulk actions -->
            <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                    <v-icon>mdi-printer</v-icon> Print
                </v-btn>
            </template>

            <template #item.benefits="{ item }">
                {{ item.benefits.length }}
            </template>
            <!-- expand template slot -->
            <template v-slot:expanded-row="{ columns, item }">
                <tr>
                    <td :colspan="columns.length">
                        <v-row no-gutters class="my-2">
                            <v-spacer></v-spacer>
                            <v-btn color="primary" density="compact" class="text-none"
                                @click="assignEmployeeBenefit(item.id)">Assign Benefit</v-btn>
                        </v-row>
                        <v-data-table no-data-text="No Benefits Assigned to Employee" :headers="benefitHeaders"
                            :items="getBenefits(item.benefits)">
                            <template v-slot:item.actions="{ item: employeeBenefit }">
                                <v-icon color="primary" dense
                                    @click="editEmployeeBenefit(employeeBenefit)">mdi-pencil</v-icon>
                                <v-icon color="red" dense
                                    @click="deleteEmployeeBenefit(employeeBenefit.employee_id as number, employeeBenefit.id as number)">mdi-delete</v-icon>
                            </template>

                            <!-- hide footer -->
                            <template #bottom></template>
                        </v-data-table>
                    </td>
                </tr>
            </template>
        </SharedUiCustomTable>
    </div>
</template>

<style scoped></style>