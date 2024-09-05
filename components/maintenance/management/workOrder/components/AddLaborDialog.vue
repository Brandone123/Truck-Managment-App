<template>
    <v-dialog :model-value="show" max-width="800px" scrollable persistent>
        <v-card class="grey-background">
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <v-form ref="laborForm">
                    <p v-if="editing">Current Service Task</p>
                    <p v-if="editing">{{ currentServiceTask?.name }}</p>
                    <v-row :class="{ 'mt-3': editing }">
                        <v-col cols="12">
                            <v-select variant="solo" flat density="compact" :items="technicians" item-title="full_name"
                                item-value="user_id" v-model="localWorkOrderLabor.user_id" label="Technician"
                                :rules="[validation.required]"></v-select>
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact" v-model.number="localWorkOrderLabor.hrs"
                                label="Labor Hours" @input="calculateSubtotalLabor(localWorkOrderLabor)">
                                <template v-slot:append-inner>hr</template>
                            </v-text-field>
                            <div>
                                <v-chip class="mr-1" @click="localWorkOrderLabor.hrs = time.value" density="compact"
                                    v-for="(time, index) in laborTime" :key="index">{{ time.text }}</v-chip>
                            </div>
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6">
                            <v-text-field variant="solo" flat density="compact"
                                v-model.number="localWorkOrderLabor.rate" label="Hourly Rate"
                                @input="calculateSubtotalLabor(localWorkOrderLabor)">
                                <template v-slot:prepend-inner>$</template>
                            </v-text-field>
                        </v-col>
                        <v-col class="pt-0" cols="12" v-if="!editing">
                            <v-autocomplete variant="solo" flat density="compact" :items="serviceTaskList"
                                item-title="name" item-value="id" v-model="localWorkOrderLabor.service_task_id"
                                label="Select Service Task*" :rules="[validation.required]">
                                <template v-slot:item="{ props, item }">
                                    <v-list-item v-bind="props" :title="item.raw.name">
                                        <v-list-item-subtitle>
                                            <span style="font-size: 12px;text-overflow:ellipsis;">{{
                                                item.raw.description }}</span>
                                        </v-list-item-subtitle>
                                    </v-list-item>
                                </template>
                            </v-autocomplete>
                        </v-col>
                        <v-col class="pt-0" cols="12">
                            <v-textarea variant="solo" flat density="compact" v-model="localWorkOrderLabor.notes"
                                label="Notes" :rows="3"></v-textarea>
                        </v-col>
                        <v-col class="pt-0" cols="12">
                            <div class="d-flex justify-space-between">
                                <span>
                                    <span class="text-h6">Subtotal</span><br>
                                    <span class="text-caption">{{ localWorkOrderLabor.hrs }}hrs x
                                        ${{ localWorkOrderLabor.rate }} / hr</span>
                                </span>
                                <span class="text-h6">${{ localWorkOrderLabor.subtotal }}</span>
                            </div>
                        </v-col>
                    </v-row>
                </v-form>

            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn v-if="editing" color="error" variant="text" @click="deleteItem">Delete</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
                <v-btn color="primary" @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Labors } from '~/types/maintenance/workOrder';
import { useValidation } from '~/composables/formValidation';
const validation = useValidation();

// const techniciansStore = useTechniciansStore();
// const { technicians } = storeToRefs(techniciansStore)
const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList)

const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList } = storeToRefs(serviceTaskStore);

const props = defineProps({
    modelValue: {
        type: Object as PropType<Partial<Labors>>,
        required: true,
        default: {} as Partial<Labors>
    },
    show: {
        type: Boolean,
        required: true,
        default: false
    },
    calculateSubtotalLabor: {
        type: Function,
        required: true,
    },
    editing: {
        type: Boolean,
        required: true,
    }
})

const currentServiceTask = computed(() => {
    return serviceTaskList.value.find(serviceTask => serviceTask.id == props.modelValue.service_task_id)
})

const emit = defineEmits(['close', 'save', 'update', 'delete'])

const title = computed(() => {
    return props.editing ? 'Edit Labor' : 'Add Labor'
})

const laborForm = ref<HTMLFormElement | null>(null)

const laborTime = ref([
    { value: 0.25, text: '15m' },
    { value: 0.5, text: '30m' },
    { value: 0.75, text: '45m' },
    { value: 1, text: '1h' },
    { value: 2, text: '2h' },
    { value: 3, text: '3h' },
    { value: 4, text: '4h' },
])

const localWorkOrderLabor = ref<Partial<Labors>>(JSON.parse(JSON.stringify(props.modelValue)))


const selectedTechnician = computed(() => {
    return technicians.value.find(technician => technician.user_id == localWorkOrderLabor.value.user_id)
})

watch(() => props.show, (newVal) => {
    if (newVal) {
        nextTick(() => {
            localWorkOrderLabor.value = JSON.parse(JSON.stringify(props.modelValue))
        })
    }
})

watch(props.modelValue, (newModelValue) => {
    localWorkOrderLabor.value = JSON.parse(JSON.stringify(newModelValue))
})

watch(
    () => localWorkOrderLabor.value.user_id,
    (newVal) => {
        nextTick(() => {
            localWorkOrderLabor.value.rate = selectedTechnician.value?.hourly_labour_rate
        })
    }
)

const closeDialog = () => {
    emit('close')
}

const save = async () => {
    const formStatus = await laborForm.value?.validate()
    if (!formStatus.valid) {
        return
    }

    if (props.editing) {
        emit('update', JSON.parse(JSON.stringify(localWorkOrderLabor.value)))
    } else {
        emit('save', JSON.parse(JSON.stringify(localWorkOrderLabor.value)))
    }
}

const deleteItem = () => {
    emit('delete', JSON.parse(JSON.stringify(props.modelValue)))
}

</script>