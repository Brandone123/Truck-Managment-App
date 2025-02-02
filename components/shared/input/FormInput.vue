<template>
    <v-autocomplete v-model="selectedItem" :items="forms" :no-data-text="noDataText" :loading="loading"
        :hide-no-data="!loading" :variant="(variant as any)" :flat="flat" :density="(density as any)" :label="label"
        :rules="rules" item-title="name" item-value="id">
        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :disabled="invalidForm(item.raw)" :title="item.raw.name">
                <v-list-item-subtitle v-if="invalidForm(item.raw)">
                    <v-chip density="compact" v-if="(item.raw.current_version?.elements?.length || 0) == 0">No
                        Elements</v-chip>
                    <v-chip density="compact" v-if="item.raw.status === 'archived'">Archived</v-chip>
                </v-list-item-subtitle>
            </v-list-item>
            <v-divider v-if="item.raw + 1 < forms.length"></v-divider>
        </template>

        <template v-slot:append-item>
            <v-list-item v-if="loading">
                <div class="text-center">
                    <v-progress-circular indeterminate size="20" color="primary"></v-progress-circular>
                </div>
            </v-list-item>
        </template>
    </v-autocomplete>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    variant: { type: String, default: '' },
    flat: { type: Boolean, default: false },
    label: { type: String, default: 'Select Vehicle' },
    density: { type: String, default: '' },
    rules: { type: Array, default: () => [] },
    modelValue: { required: true },
});

const emit = defineEmits(['update:modelValue', 'selection']);

const selectedItem = computed({
    get() {
        return props.modelValue;
    },
    set(value: any) {
        let selectedForm = forms.value.find(item => item.id == value)
        emit('update:modelValue', value);
        emit('selection', selectedForm);
    },
});

const noDataText = computed(() => loading.value ? '' : 'No data available');

const commonListStore = useMaintenanceCommonListStore()

const { forms, loadingForms: loading } = storeToRefs(commonListStore);

onMounted(() => {
    let query: Record<string, any> = {}
    query.relations = [['currentVersion']]
    query.filters = { status: 'active' }

    commonListStore.fetchList('forms', query)
})

const invalidForm = (form: any) => {
    return !form.current_version?.elements || form.current_version?.elements.length === 0 //|| form.status != 'active'
};

</script>
