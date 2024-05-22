<script setup lang="ts">
import { ref } from 'vue'
import type { LoadInfo } from '~/types/dispatch/load'

const loadTemplateStore = useLoadTemplateStore()

const loadTemplateDialog = ref(false)
const updatingLoadTemplate = ref(false)

const defaultLoadTemplate = ref<LoadInfo>({
    id: null,
    customer_id: null,
    route_id: null,
    // route: {
    //     id: null,
    //     name: null,
    //     stops: []
    // },
    //    commodities: [],
    //    pickup_date: null,
    //    pickup_time: null,
    pickup_city: null,
    pickup_state: null,
    pickup_address: null,
    //    delivery_date: null,
    //    delivery_time: null,
    delivery_city: null,
    delivery_state: null,
    delivery_address: null,
    //    truck_id: null,
    //    driver_id: null,
    //    trailer_id: null,
    //    notes: null,
    //    status: null,
    //    eta: null,
});

const editedLoadTemplate = ref(defaultLoadTemplate.value)


const editLoadTemplate = (load: LoadInfo) => {
    editedLoadTemplate.value = Object.assign({}, load)
    updatingLoadTemplate.value = true
    loadTemplateDialog.value = true
}

const deleteLoadTemplate = (template_id: number) => {
    loadTemplateStore.deleteLoadTemplate(template_id)
}

const updateLoadTemplateDialog = (value: boolean) => {
    loadTemplateDialog.value = value
    editedLoadTemplate.value = defaultLoadTemplate.value as LoadInfo
    updatingLoadTemplate.value = false
}
</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Load Templates</span>
            <div>
                <!-- <v-btn color="primary" class="mr-2 text-none" flat>
                    <v-icon>mdi-upload</v-icon>
                    Bulk Upload
                </v-btn> -->
                <SettingsDispatchTemplatesNewTemplate :show="loadTemplateDialog" @update:show="updateLoadTemplateDialog"
                    :updating="updatingLoadTemplate" :item="editedLoadTemplate" />
            </div>

        </div>
        <SettingsDispatchTemplates @editLoadTemplate="editLoadTemplate" @deleteLoadTemplate="deleteLoadTemplate" />
    </div>
</template>

