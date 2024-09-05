<template>
    <v-card @mouseover="isHovering = true" @mouseout="isHovering = false">
        <div class="pa-3">
            <v-row align="center">
                <v-col cols="6">
                    <v-row no-gutters align="center">
                        <v-text-field ref="labelInputRef" v-model="editedItem.label" v-if="isEditingLabel"
                            @keydown.enter="isEditingLabel = false" @blur="isEditingLabel = false" hide-details
                            variant="outlined" density="compact" placeholder="Enter Section Label" label="Item Label*"
                            :rules="[validation.required]"></v-text-field>
                        <span v-else style="height:40px" class="d-flex align-center">
                            <span v-if="editedItem.label" class="font-weight-bold">{{ editedItem.label }}</span>
                            <span v-else class="font-weight-bold text-error">Enter Section Label</span>
                            <span class="ml-2 text-error font-weight-bold">*</span>
                            <v-btn class="ml-3" density="comfortable" variant="text" icon="mdi-pencil-outline"
                                size="small" @click="showLabelInput"></v-btn>
                        </span>
                    </v-row>
                </v-col>
                <v-col>
                    <div class="d-flex justify-end align-center">
                        <v-btn class="mr-2" density="comfortable" variant="text" icon="mdi-content-copy" size="small"
                            @click="copyComponent"></v-btn>
                        <v-btn density="comfortable" variant="text" icon="mdi-window-close" size="small"
                            @click="deleteComponent"></v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>
    </v-card>


</template>

<script setup lang="ts">
import { ref, watch, inject, type PropType, onMounted, onUnmounted, nextTick } from 'vue'
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

interface DateTime {
    id: string
    type: 'section'
    label: string
}

const emit = defineEmits(['update:modelValue', 'delete', 'copy'])

const props = defineProps({
    modelValue: {
        type: Object as PropType<DateTime>,
        required: true,
        default: {} as DateTime
    },
    expanded: {
        type: Boolean,
        default: true,
    }
})

const isExpanded = ref<boolean>(true)
const isHovering = ref<boolean>(false)
const isEditingLabel = ref<boolean>(false)
const labelInputRef = ref<HTMLElement | null>(null)
const editedItem = ref<DateTime>(props.modelValue)

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