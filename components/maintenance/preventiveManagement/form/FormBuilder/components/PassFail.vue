<template>
    <v-card @mouseover="isHovering = true" @mouseout="isHovering = false">
        <div class="pa-3">
            <v-row align="center">
                <v-col cols="6">
                    <!-- <v-row no-gutters align="center"> -->
                    <div class="d-flex align-center">
                        <v-btn @click="isExpanded = !isExpanded" :class="{ rotated: isExpanded }"
                            class="trigger-btn mr-2" density="comfortable" variant="text" icon="mdi-menu-right"
                            size="medium"></v-btn>
                        <!-- <v-text-field ref="labelInputRef" v-model="editedItem.label" v-if="isEditingLabel"
                            @keydown.enter="isEditingLabel = false" @blur="isEditingLabel = false" hide-details
                            variant="outlined" density="compact" label="Enter Inspection Item Label"></v-text-field>
                        <span v-else style="height:40px" class="d-flex align-center">
                            <span v-if="editedItem.label" class="font-weight-bold">{{ editedItem.label }}</span>
                            <span v-else class="font-weight-bold text-error">Enter Inspection Item Label</span>
                            <span class="ml-2 text-error font-weight-bold">*</span>
                            <v-btn class="ml-3" density="comfortable" variant="text" icon="mdi-pencil-outline"
                                size="small" @click="showLabelInput"></v-btn>
                        </span> -->
                        <v-text-field ref="labelInputRef" v-model="editedItem.label" variant="outlined"
                            density="compact" label="Item Label*" placeholder="Enter Inspection Item Label"
                            :rules="[validation.required]" hide-details></v-text-field>
                    </div>
                    <!-- </v-row> -->
                </v-col>
                <v-col>
                    <div class="d-flex justify-end align-center">
                        <v-chip class="mr-2">
                            <v-icon color="grey">mdi-check-circle-outline</v-icon>Pass / Fail
                        </v-chip>
                        <v-btn class="mr-2" density="comfortable" variant="text" icon="mdi-content-copy" size="small"
                            @click="copyComponent"></v-btn>
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
                        <v-checkbox v-model="editedItem.required" hide-details label="Required"
                            color="primary"></v-checkbox>
                    </v-col>
                    <v-col cols="12" class="pt-0">
                        <v-text-field v-model="editedItem.description" hide-details variant="outlined" density="compact"
                            label="Short Description"></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-0">
                        <v-textarea v-model="editedItem.instructions" hide-details variant="outlined" density="compact"
                            rows="two" label="instructions" color="primary"></v-textarea>
                    </v-col>

                    <v-col cols="12" md="6" class="pt-0">
                        <v-text-field v-model="editedItem.pass_label" hide-details variant="outlined" density="compact"
                            label="Pass Label"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="pt-0">
                        <v-text-field v-model="editedItem.fail_label" hide-details variant="outlined" density="compact"
                            label="Fail Label"></v-text-field>
                    </v-col>

                    <v-col cols="12" class="pb-0">
                        <v-checkbox v-model="editedItem.required" hide-details label='Enable N/A option'
                            color="primary"></v-checkbox>
                    </v-col>
                    <v-col cols="12" class="py-0">
                        <v-checkbox v-model="editedItem.pass_require_photo_or_comment" hide-details
                            label='Require photo or comment for "Pass"' color="primary"></v-checkbox>
                    </v-col>
                    <v-col cols="12" class="py-0">
                        <v-checkbox v-model="editedItem.fail_require_photo_or_comment" hide-details
                            label='Require photo or comment for "Fail"' color="primary"></v-checkbox>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-expand-transition>
    </v-card>


</template>

<script setup lang="ts">
import { ref, watch, inject, type PropType, onMounted, onUnmounted, nextTick } from 'vue'
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

interface PassFail {
    id: string
    type: 'pass_fail'
    label: string
    required: boolean
    description: string
    instructions: string
    pass_label: string
    fail_label: string
    enable_na_options: boolean
    pass_require_photo_or_comment: boolean
    fail_require_photo_or_comment: boolean
}

const emit = defineEmits(['update:modelValue', 'delete', 'copy','update:expanded'])

const props = defineProps({
    modelValue: {
        type: Object as PropType<PassFail>,
        required: true,
        default: {} as PassFail
    },
    expanded: {
        type: Boolean,
        default: true,
    }
})

//const isExpanded = ref<boolean>(true)
const isHovering = ref<boolean>(false)
const isEditingLabel = ref<boolean>(false)
const labelInputRef = ref<HTMLElement | null>(null)
const editedItem = ref<PassFail>(props.modelValue)

// const eventBus = inject<EventTarget>('eventBus');

// const expand = (event: Event) => {
//     isExpanded.value = true
// }

// const collapse = (event: Event) => {
//     isExpanded.value = false
// }

// onMounted(() => {
//     if (eventBus) {
//         eventBus.addEventListener('expandAll', expand);
//         eventBus.addEventListener('collapseAll', collapse);
//     }
// });

// onUnmounted(() => {
//     if (eventBus) {
//         eventBus.removeEventListener('expandAll', expand);
//         eventBus.removeEventListener('expandAll', collapse);
//     }
// });

const isExpanded = computed({
    get() {
        return props.expanded
    },
    set(value) {
        emit('update:expanded', value)
    }
})

watch(props.modelValue, (newValue, oldValue) => {
    if (newValue) {
        editedItem.value = { ...newValue }
    }
})

watch(editedItem, (newVal, oldVal) => {
    emit('update:modelValue', newVal)
}, { deep: true });

const deleteComponent = () => {
    emit('delete')
}

const copyComponent = () => {
    emit('copy')
}

const showLabelInput = () => {
    isEditingLabel.value = true
    nextTick(() => {
        if (labelInputRef.value) {
            labelInputRef.value.focus()
        }
    })
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