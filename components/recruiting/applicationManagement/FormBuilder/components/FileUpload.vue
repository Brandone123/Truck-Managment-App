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
                        <v-text-field :readonly="editedItem.default ? true : false"
                            :hint="editedItem.default ? 'Read only value' : ''"
                            :persistent-hint="editedItem.default ? true : false" ref="labelInputRef"
                            v-model="editedItem.label" variant="outlined" density="compact" label="Item Label*"
                            placeholder="Enter Inspection Item Label" :rules="[validation.required]"
                            hide-details></v-text-field>
                    </div>
                    <!-- </v-row> -->
                </v-col>
                <v-col>
                    <div class="d-flex justify-end align-center">
                        <v-checkbox class="mr-2" v-model="editedItem.required" hide-details label="Required"
                            color="primary"></v-checkbox>
                        <v-btn class="mr-2" density="comfortable" variant="text" icon="mdi-content-copy" size="small"
                            @click="copyComponent"></v-btn>
                        <v-btn :disabled="editedItem.default" density="comfortable" variant="text"
                            icon="mdi-window-close" size="small" @click="deleteComponent"></v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>
        <v-expand-transition>
            <v-card-text v-if="isExpanded" class="pl-9">
                <v-row>
                    <v-col cols="12" class="py-0">
                        <v-text-field v-model="editedItem.description" hide-details variant="outlined" density="compact"
                            label="Short Description"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete multiple density="compact" variant="outlined" hide-details chips closable-chips
                            label="Accepted types" v-model="editedItem.accept" item-title="title" item-value="value"
                            :items="fileTypes"></v-autocomplete>
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

interface FileUpload {
    id: string
    type: 'file_upload'
    label: string
    required: boolean
    description: string
    accept: string[]
    default: boolean
}


interface DynamicObject {
    [key: number]: boolean
}
const emit = defineEmits(['update:modelValue', 'delete', 'copy', 'update:expanded'])

const props = defineProps({
    modelValue: {
        type: Object as PropType<FileUpload>,
        required: true,
        default: {} as FileUpload
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
const editedItem = ref<FileUpload>(props.modelValue)

const fileTypes = ref<any[]>([
    { title: 'PDF', value: 'application/pdf' },
    { title: 'JPG', value: 'image/jpeg' }
])

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