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
                            <v-icon color="grey">mdi-format-list-bulleted</v-icon>Dropdown
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
                    <v-col cols="12" class="py-0">
                        <v-text-field v-model="editedItem.description" hide-details variant="outlined" density="compact"
                            label="Short Description"></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                        <v-textarea v-model="editedItem.instructions" hide-details variant="outlined" density="compact"
                            rows="two" label="instructions" color="primary"></v-textarea>
                    </v-col>
                </v-row>
                <p class="mt-8 mb-4 text-body-1 ">Choices</p>
                <v-row>
                    <v-col cols="12">
                        <draggable v-model="editedItem.choices" handle=".handle">
                            <div class="list-group-item mb-3" v-for="(choice, i) in editedItem.choices" :key="i"
                                :data-index="i">
                                <v-text-field v-model="choice.text" :rules="[validation.required]" hide-details
                                    variant="outlined" density="compact" label="Short Description*">
                                    <template v-slot:append>
                                        <v-checkbox v-model="choice.invalid" hide-details label='Fail item if chosen'
                                            color="primary" density="compact"></v-checkbox>
                                        <v-btn class="ml-2" icon="mdi-window-close" size="small" variant="text"
                                            @click="removeChoice(i)"></v-btn>
                                    </template>
                                    <template v-slot:prepend>
                                        <v-btn class="ml-2 grabbable handle" icon="mdi-dots-grid" size="small"
                                            variant="text"></v-btn>
                                    </template>
                                </v-text-field>
                            </div>
                        </draggable>
                    </v-col>
                    <v-col>
                        <v-btn variant="text" @click="addChoice" class="text-none" color="primary">
                            <v-icon>mdi-plus</v-icon> Add Choice
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="py-0">
                        <v-checkbox v-model="editedItem.pass_require_photo_or_comment" hide-details
                            label='Require photo or comment for "Fail"' color="primary"></v-checkbox>
                    </v-col>
                    <v-col cols="12" class="py-0">
                        <v-checkbox v-model="editedItem.fail_require_photo_or_comment" hide-details
                            label='Require photo or comment for "Pass"' color="primary"></v-checkbox>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-expand-transition>


    </v-card>


</template>

<script setup lang="ts">
import { ref, watch, inject, type PropType, onMounted, onUnmounted, nextTick } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { useValidation } from '~/composables/formValidation';
const validation = useValidation();

interface DropDown {
    id: string
    type: 'dropdown'
    label: string
    required: boolean
    description: string
    instructions: string
    choices: { text: string, invalid: boolean }[]
    pass_require_photo_or_comment: boolean
    fail_require_photo_or_comment: boolean
}


interface DynamicObject {
    [key: number]: boolean
}
const emit = defineEmits(['update:modelValue', 'delete', 'copy', 'update:expanded'])

const props = defineProps({
    modelValue: {
        type: Object as PropType<DropDown>,
        required: true,
        default: {} as DropDown
    },
    expanded: {
        type: Boolean,
        default: true,
    }
})

// const isExpanded = ref<boolean>(true)
const isHovering = ref<boolean>(false)
const isEditingLabel = ref<boolean>(false)
const labelInputRef = ref<HTMLElement | null>(null)
const editedItem = ref<DropDown>(props.modelValue)
// const isDraggable = ref<DynamicObject>({})

// const setDraggable = (value: boolean, index: number) => {
//     isDraggable.value[index] = value
// }

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
        editedItem.value = JSON.parse(JSON.stringify(newValue))
    }
})

watch(editedItem, (newVal, oldVal) => {
    let payload = JSON.parse(JSON.stringify(newVal))
    emit('update:modelValue', payload)
}, { deep: true });


const addChoice = () => {
    editedItem.value.choices.push({
        text: '',
        invalid: false,
    })
}

const removeChoice = (index: number) => {
    editedItem.value.choices.splice(index, 1)
}

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

.grabbable {
    cursor: grab
}

.grabbavle:active {
    cursor: grabbing !important
}
</style>