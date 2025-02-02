<template>
    <v-card @mouseover="isHovering = true" @mouseout="isHovering = false">
        <div class="pa-3">
            <v-row align="center">
                <v-col cols="6">
                    <div class="d-flex align-center">
                        <v-btn @click="isExpanded = !isExpanded" :class="{ rotated: isExpanded }"
                            class="trigger-btn mr-2" density="comfortable" variant="text" icon="mdi-menu-right"
                            size="medium"></v-btn>
                        <slot name="title"></slot>
                    </div>
                </v-col>
                <v-col>
                    <div class="d-flex justify-end align-center">
                        <v-btn v-if="canCopy" class="mr-2" density="comfortable" variant="text" icon="mdi-content-copy"
                            size="small" @click="copyComponent"></v-btn>
                        <v-btn v-if="canDelete" density="comfortable" variant="text" icon="mdi-window-close"
                            size="small" @click="deleteComponent"></v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>
        <v-expand-transition>
            <v-card-text v-if="isExpanded" class="pl-9">
                <slot name="body"></slot>
            </v-card-text>
        </v-expand-transition>
    </v-card>
</template>

<script setup lang="ts">
import { ref, watch, inject, type PropType, onMounted, onUnmounted, nextTick } from 'vue'
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

interface DateTime {
    id: string
    type: 'date_time'
    label: string
    required: boolean
    description: string
    instructions: string
    date_only: boolean
}

const emit = defineEmits(['delete', 'copy', 'update:expanded'])

const props = defineProps({
    expanded: {
        type: Boolean,
        default: true,
    },
    canDelete: {
        type: Boolean,
        default: false
    },
    canCopy: {
        type: Boolean,
        default: false
    },
    canEdit: {
        type: Boolean,
        default: false
    }
})

const isHovering = ref<boolean>(false)
const isExpanded = computed({
    get() {
        return props.expanded
    },
    set(value) {
        emit('update:expanded', value)
    }
})

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