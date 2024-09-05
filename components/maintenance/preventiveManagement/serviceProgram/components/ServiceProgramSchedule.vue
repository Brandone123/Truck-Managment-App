<template>
    <v-card @mouseover="isHovering = true" @mouseout="isHovering = false" hover>

        <div class="pa-3">
            <v-row align="center">
                <v-col cols="6">
                    <v-row no-gutters align="center">
                        <v-btn @click="isExpanded = !isExpanded" :class="{ rotated: isExpanded }"
                            class="trigger-btn mr-2" variant="text" icon="mdi-menu-right" size="large"></v-btn>

                        <span v-if="!isExpanded" class="text-h6">
                            <span v-if="editedTask.time_interval">Interval: Every {{ editedTask.time_interval }} {{
                                editedTask.time_interval_duration }}</span>
                            <span v-else class="text-red">Interval not defined</span>
                        </span>
                    </v-row>
                </v-col>
                <v-col>
                    <div class="d-flex  align-center">
                        <div class="flex-grow-1">
                            <div v-if="!isExpanded">
                                <v-chip v-if="editedTask.service_tasks?.length" color="primary">{{
                                    editedTask.service_tasks.length }} Service task{{ editedTask.service_tasks.length >
                                        1 ? 's' : '' }}</v-chip>
                                <v-chip v-else color="error">No Service tasks assigned</v-chip>
                            </div>
                        </div>
                        <!-- <v-btn class="mr-2" density="comfortable" variant="text" icon="mdi-content-copy" size="small"
                            @click="copyComponent"></v-btn> -->

                        <v-btn density="comfortable" variant="text" icon="mdi-window-close" size="small"
                            @click="deleteComponent"></v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>
        <v-expand-transition>
            <v-card-text v-if="isExpanded" class="pl-9">
                <v-row>
                    <v-col cols="12" class="py-0">
                        <v-autocomplete variant="outlined" :rules="[validation.required]" flat
                            v-model="editedTask.service_tasks" multiple label="Service Tasks*" item-value="id"
                            item-label="name" chips closable-chips :items="serviceTaskList">
                            <template v-slot:item="{ props, item }">
                                <v-list-item v-bind="props" :subtitle="(item.raw.id as number)"
                                    :title="item.raw.name"></v-list-item>
                            </template>
                            <template v-slot:chip="{ props, item }">
                                <v-chip v-bind="props" :text="item.raw.name" color="primary"></v-chip>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6">
                        <p class="mb-3">Time Interval*</p>
                        <v-row>
                            <v-col cols="8" class="pr-0">
                                <v-text-field :rules="[validation.required]" type="number" variant="outlined"
                                    density="compact" v-model="editedTask.time_interval">
                                    <template v-slot:prepend-inner>
                                        <span class="text-caption">Every</span>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col cols="4" class="pl-1">
                                <v-select :rules="[validation.required]" variant="outlined" density="compact"
                                    v-model="editedTask.time_interval_duration" :items="timeDuration" item-title="label"
                                    item-value="value"></v-select>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" md="6">
                        <p class="mb-3">Time Due Soon Threshold*</p>
                        <v-row>
                            <v-col cols="8" class="pr-0">
                                <v-text-field :rules="[validation.required]" type="number" variant="outlined"
                                    density="compact" v-model="editedTask.time_due_soon_threshhold">
                                </v-text-field>
                            </v-col>
                            <v-col cols="4" class="pl-1">
                                <v-select :rules="[validation.required]" variant="outlined" density="compact"
                                    v-model="editedTask.time_due_soon_threshhold_duration" :items="timeDuration"
                                    item-value="name" item-title="label"></v-select>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field :rules="[validation.required]" type="number" v-model="editedTask.primary_meter_interval" variant="outlined" density="compact"
                            label="Primary meter interval*"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field :rules="[validation.required]" type="number" v-model="editedTask.primary_meter_due_soon_threshhold" variant="outlined" density="compact"
                            label="Primary meter due soom threshbold*">
                            <template v-slot:append-inner>
                                <span>{{ meterUnits }}</span>
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-expand-transition>
    </v-card>
</template>

<script setup lang="ts">
import { ref, watch, inject, type PropType, onMounted, onUnmounted, nextTick } from 'vue'

import type { ServiceTask } from '~/types/maintenance/ServiceProgram';
import { storeToRefs } from 'pinia';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const serviceTaskStore = useServiceTaskStore()
const { serviceTaskList } = storeToRefs(serviceTaskStore)

const emit = defineEmits(['update:modelValue', 'delete', 'copy'])

const props = defineProps({
    modelValue: {
        type: Object as PropType<Partial<ServiceTask>>,
        required: true,
        default: () => ({} as Partial<ServiceTask>)
    },
    primaryMeterUtilization: {
        type: String,
        required: true
    }
})

const timeDuration = ref([
    { label: 'day(s)', value: 'days' },
    { label: 'week(s)', value: 'weeks' },
    { label: 'month(s)', value: 'months' },
    { label: 'year(s)', value: 'years' },
])

const getTaskName = (taskId: number) => {
    return serviceTaskList.value?.find(task => task.id == taskId)?.name
}

const meterUnits = computed(() => {
    switch (props.primaryMeterUtilization) {
        case 'miles':
            return 'mi'
        case 'kilometers':
            return 'km'
        case 'hours':
            return 'hrs'
    }
})

const isExpanded = ref<boolean>(true)
const isHovering = ref<boolean>(false)
const editedTask = ref<Partial<ServiceTask>>(JSON.parse(JSON.stringify(props.modelValue)))

const eventBus = inject<EventTarget>('eventBus');

const expand = (event: Event) => {
    isExpanded.value = true
}

const collapse = (event: Event) => {
    isExpanded.value = false
}

onMounted(() => {
    if (eventBus) {
        eventBus.addEventListener('expandAll', expand);
        eventBus.addEventListener('collapseAll', collapse);
    }
});

onUnmounted(() => {
    if (eventBus) {
        eventBus.removeEventListener('expandAll', expand);
        eventBus.removeEventListener('expandAll', collapse);
    }
});

watch(props.modelValue, (newValue, oldValue) => {
    if (newValue) {
        editedTask.value = JSON.parse(JSON.stringify(newValue))
    }
})

watch(editedTask, (newVal, oldVal) => {
    emit('update:modelValue', newVal)
}, { deep: true });

const deleteComponent = () => {
    emit('delete')
}

const copyComponent = () => {
    emit('copy')
}
</script>

<style scoped>
.trigger-btn {
    transition: transform 0.3s ease;
}

.trigger-btn.rotated {
    transform: rotate(90deg);
}
</style>