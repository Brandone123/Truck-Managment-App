<template>
    <v-card @mouseover="isHovering = true" @mouseout="isHovering = false">
        <div class="pa-3">
            <v-row align="center">
                <v-col cols="6">
                    <div class="d-flex align-center">
                        <v-btn @click="isExpanded = !isExpanded" :class="{ rotated: isExpanded }"
                            class="trigger-btn mr-2" density="comfortable" variant="text" icon="mdi-menu-right"
                            size="medium"></v-btn>
                        <v-text-field :readonly="editedItem.default ? true : false"
                        :hint="editedItem.default ? 'Read only value' : ''" :persistent-hint="editedItem.default ? true : false" ref="labelInputRef" v-model="editedItem.label" variant="outlined"
                            density="compact" label="Linear Scale Label*" placeholder="Enter Scale Label"
                            :rules="[validation.required]" hide-details></v-text-field>
                    </div>
                </v-col>
                <v-col>
                    <div class="d-flex justify-end align-center">
                        <v-chip class="mr-2">
                            <v-icon color="grey">mdi-ray-start-end</v-icon>Linear Scale
                        </v-chip>
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
                        <v-textarea v-model="editedItem.description" hide-details variant="outlined" density="compact"
                            rows="two" label="Short Description"></v-textarea>
                    </v-col>
                </v-row>
                <v-row class="mt-6">
                    <v-col cols="4" class="py-0">
                        <v-text-field v-model="editedItem.min" type="number" label="Minimum Value" variant="outlined"
                            density="compact" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="4" class="py-0">
                        <v-text-field v-model="editedItem.max" type="number" label="Maximum Value" variant="outlined"
                            density="compact" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="4" class="py-0">
                        <v-text-field v-model="editedItem.step" type="number" label="Step Value" variant="outlined"
                            density="compact" hide-details></v-text-field>
                    </v-col>
                </v-row>
                <v-row class="mt-6 mb-3">
                    <v-col cols="6" class="py-0">
                        <v-text-field v-model="editedItem.minLabel" variant="outlined" density="compact"
                            label="Minimum Label" placeholder="Label for minimum value" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="6" class="py-0">
                        <v-text-field v-model="editedItem.maxLabel" variant="outlined" density="compact"
                            label="Maximum Label" placeholder="Label for maximum value" hide-details></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-expand-transition>
    </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, type PropType } from 'vue';
import { useValidation } from '~/composables/formValidation';
const validation = useValidation();

interface LinearScale {
    id: string;
    type: 'linear_scale';
    label: string;
    description: string;
    min: number;
    max: number;
    step: number;
    minLabel: string;
    maxLabel: string;
    default: boolean;
}

const emit = defineEmits(['update:modelValue', 'delete', 'copy', 'update:expanded']);

const props = defineProps({
    modelValue: {
        type: Object as PropType<LinearScale>,
        required: true,
        default: {} as LinearScale,
    },
    expanded: {
        type: Boolean,
        default: true,
    },
});

const isHovering = ref<boolean>(false);
const labelInputRef = ref<HTMLElement | null>(null);
const editedItem = ref<LinearScale>(props.modelValue);

const isExpanded = computed({
    get() {
        return props.expanded;
    },
    set(value) {
        emit('update:expanded', value);
    },
});

watch(props.modelValue, (newValue) => {
    if (newValue) {
        editedItem.value = JSON.parse(JSON.stringify(newValue));
    }
});

watch(
    editedItem,
    (newVal) => {
        const payload = JSON.parse(JSON.stringify(newVal));
        emit('update:modelValue', payload);
    },
    { deep: true }
);

const deleteComponent = () => {
    emit('delete');
};

const copyComponent = () => {
    emit('copy');
};
</script>

<style scoped>
.trigger-btn {
    transition: transform 0.3s ease;
}

.trigger-btn.rotated {
    transform: rotate(90deg);
}
</style>