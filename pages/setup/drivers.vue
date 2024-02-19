<script setup lang="ts">
import { ref } from 'vue'
import type { DriverInfo } from '@/types/store/driver'

const driverTemplateStore = useDriverStore()

const driverTemplateDialog = ref(false)
const updatingDriverTemplate = ref(false)

const defaultDriverTemplate = ref<DriverInfo>({
    id: null,
    employee_id: null,
    category: "",
    cdl_expiration: null,
    mvr_due: null,
    hazmat_expiration: null,
    physical_due: null,
});

const editedDriverTemplate = ref(defaultDriverTemplate.value)


const editDriverTemplate = (driver: DriverInfo) => {
    editedDriverTemplate.value = Object.assign({}, driver)
    updatingDriverTemplate.value = true
    driverTemplateDialog.value = true
}

const deleteDriverTemplate = (template_id: number) => {
    driverTemplateStore.deleteDriverTemplate(template_id)
}

const updatedriverTemplateDialog = (value: boolean) => {
    driverTemplateDialog.value = value
    editedDriverTemplate.value = defaultDriverTemplate.value as DriverInfo
    updatingDriverTemplate.value = false
}
</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Drivers</span>
            <div>
                <!-- <v-btn color="primary" class="mr-2 text-none" flat>
                    <v-icon>mdi-upload</v-icon>
                    Bulk Upload
                </v-btn> -->
                <SettingsDriverDialog :show="driverTemplateDialog" @update:show="updatedriverTemplateDialog"
                    :updating="updatingDriverTemplate" :item="editedDriverTemplate" />
            </div>

        </div>
        <SettingsDriverTable @editDriverTemplate="editDriverTemplate" @deleteDriverTemplate="deleteDriverTemplate" />
    </div>
</template>

