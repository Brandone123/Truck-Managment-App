<template>
    <v-dialog v-model="dialog" scrollable width="800">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn color="secondary" v-bind="activatorProps" prepend-icon="mdi-table-cog" class="text-none">
                Headers
            </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card class="grey-background">
                <v-toolbar color="primary" dark density="compact">
                    <v-toolbar-title>Manage Template Headers</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = !dialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <draggable v-model="localSelectedColumns" handle=".handle">
                        <v-card class="list-group-item mb-1" v-for="(column, i) in localSelectedColumns" :key="i">
                            <v-card-text class="d-flex align-center">
                                <v-icon class="handle grabbable mr-3">mdi-dots-grid</v-icon>
                                <v-text-field :id="'headerInput-' + i" v-if="isEditing[i]" style="min-width:40px;"
                                    v-model="column.title" density="compact" variant="outlined"
                                    :placeholder="column.key" hide-details @keypress.enter="finishEditing(i)"
                                    @blur="finishEditing(i)">
                                </v-text-field>
                                <span v-else>
                                    <div>
                                        <span class="d-inline-flex">
                                           <span class="mr-2"> {{ column.title }}</span> <v-icon color="secondary" @click="startEditing(i)">mdi-pencil</v-icon>
                                        </span>
                                        <br> <span class="text-caption">{{ column.defaultTitle }}</span>
                                    </div>
                                </span>
                                <v-spacer></v-spacer>
                                <v-btn variant="text" :color="column.disabled ? '' : 'primary'"
                                    @click="column.disabled = !column.disabled" size="small"
                                    :icon="column.disabled ? 'mdi-eye-off' : 'mdi-eye'"></v-btn>
                            </v-card-text>
                        </v-card>
                    </draggable>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" class="text-none" @click="save">Save</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { VueDraggableNext as draggable } from 'vue-draggable-next';

// Define props and emits
const props = defineProps({
    selectedColumns: {
        type: Array as () => Array<{ title: string; key: string }>,
        default: () => [],
    },
});

const emit = defineEmits(['update:selectedColumns']);

const dialog = ref(false);
const localSelectedColumns = ref<any[]>([]);
const isEditing = ref<Record<number, boolean>>({});

watch(
    () => dialog.value,
    (newVal) => {
        if (newVal) {
            localSelectedColumns.value = JSON.parse(JSON.stringify(props.selectedColumns));
        }
    }
);

const startEditing = (index: number) => {
    isEditing.value[index] = true;
    nextTick(() => {
        // Focus the input after it's rendered
        const inputRef = document.querySelector(`input#headerInput-${index}`) as HTMLInputElement;
        inputRef?.focus();
    });
};

const finishEditing = (index: number) => {
    isEditing.value[index] = false;
};

const save = () => {
    emit('update:selectedColumns', localSelectedColumns.value);
    dialog.value = false;
};


// const setDragCursor = value => {
//     const html = document.getElementsByTagName('html').item(0)
//     html.classList.toggle('grabbing', value)
// }

// const onDragStart = () => {
//     setDragCursor(true)
// },
// const onDragEnd = () => {
//     setDragCursor(false)
// },
</script>

<style scoped>
.handle:hover::before {
    cursor: grab;
}

.grabbing {
    cursor: move !important;
    cursor: -webkit-grabbing !important;
    cursor: -moz-grabbing !important;
    cursor: grabbing !important;
}
</style>
