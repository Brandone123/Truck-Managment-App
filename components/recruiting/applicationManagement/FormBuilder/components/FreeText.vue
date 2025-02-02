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
                        <v-icon class="mr-2" color="grey">mdi-message-text-outline</v-icon>Free Text
                    </div>
                </v-col>
                <v-col>
                    <div class="d-flex justify-end align-center">
                        <v-btn class="mr-2" density="comfortable" variant="text" icon="mdi-content-copy" size="small"
                            @click="copyComponent"></v-btn>
                        <v-btn :disabled="editedItem.default" density="comfortable" variant="text" icon="mdi-window-close" size="small"
                            @click="deleteComponent"></v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>
        <v-expand-transition>
            <v-card-text v-if="isExpanded" class="pl-9">
                <v-row>
                    <v-col cols="12" class="py-0">
                        <QuillEditor v-model="editedItem.description" :options="editorOptions" />
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

interface FreeText {
    id: string
    type: 'free_text'
    description: string
    default: boolean
}

const emit = defineEmits(['update:modelValue', 'delete', 'copy', 'update:expanded'])

const props = defineProps({
    modelValue: {
        type: Object as PropType<FreeText>,
        required: true,
        default: {} as FreeText
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
const editedItem = ref<FreeText>(props.modelValue)

// Quill editor options
const editorOptions = {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],

            // [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],

            // [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],
            // [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean'],
            ['link', 'image', 'video']
        ],
    },

    //   formats: [ //specify formats to preserve on pasting
    //     'bold', 'italic', 'underline', 'strike', 'list',
    //   ]
};

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