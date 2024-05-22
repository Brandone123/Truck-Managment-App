<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { BenefitInfo } from '@/types/employeeInformationAndOperation/benefit'

// const emit = defineEmits(['editItem'])

const benefitStore = useBenefitStore()
const { benefitList } = storeToRefs(benefitStore)

const layoutStore = useLayoutStore()

onMounted(() => {
    benefitStore.fetchBenefitList();
});

const benefitHeaders = ref([
    { title: 'Name', value: 'name' },
    { title: 'Description', value: 'description' },
    { title: 'Eligibility Criteria', value: 'eligibility_criteria' },
    { title: 'Actions', value: 'actions' },
])

const editedBenefit = ref<BenefitInfo>({})
const updatingBenefit = ref(false)
const benefitDialog = ref(false)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const editBenefit = (benefit: BenefitInfo) => {
    editedBenefit.value = Object.assign({}, benefit)
    updatingBenefit.value = true
    benefitDialog.value = true
}

const deleteBenefit = async (benefit_id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
        benefitStore.deleteBenefit(benefit_id)
    }
}

const updateBenefitDialog = (value: boolean) => {
    benefitDialog.value = value
    editedBenefit.value = {}
    updatingBenefit.value = false
}
</script>
<template>
    <div>
        <EmployeeInformationAndOperationSettingsBenefitDialog :show="benefitDialog" @update:show="updateBenefitDialog"
            :updating="updatingBenefit" :item="editedBenefit" />
    </div>
    <div>
        <SharedUiCustomTable return-object :headers="benefitHeaders" :items="benefitList">

            <!-- <template v-slot:item.id="{ item }">
            <v-btn color="primary" variant="text" @click="editLoad(item)">{{ item.id }}</v-btn>
        </template> -->
            <!-- Slot to capture bulk actions -->
            <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                    <v-icon>mdi-printer</v-icon> Print
                </v-btn>
            </template>

            <template v-slot:item.actions="{ item }">
                <div>
                    <v-icon color="primary" dense @click="editBenefit(item)">mdi-pencil</v-icon>
                    <v-icon color="red" dense @click="deleteBenefit(item.id)">mdi-delete</v-icon>
                </div>
            </template>
        </SharedUiCustomTable>
    </div>
</template>

<style scoped></style>