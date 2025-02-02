<template>
    <v-autocomplete v-model="selectedItem" :items="technicians" :loading="loading" :hide-no-data="!loading" :flat="flat"
        :label="label" :rules="rules" :density="(density as any)" :variant="(variant as any)" item-title="full_name"
        item-value="user_id" clearable>
        <!-- Show loading spinner at the end of the list when loading more items -->
        <template v-slot:append-item>
            <v-list-item v-if="loading">
                <div class="text-center">
                    <v-progress-circular indeterminate size="20" color="primary"></v-progress-circular>
                </div>
            </v-list-item>
        </template>

        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :subtitle="item.raw.job_title" :title="item.raw.full_name">
                <template v-slot:prepend>
                    <v-avatar size="small" :color="avatarColor(initials(item.raw.full_name))">
                        {{ initials(item.raw.full_name) }}
                    </v-avatar>
                </template>
            </v-list-item>
        </template>

        <template v-slot:chip="{ props, item }">
            <v-chip v-bind="props" :text="item.raw.full_name"
                :prepend-avatar="getAvatarIcon(item.raw.full_name, 24, 18)">
            </v-chip>
        </template>


    </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

const props = defineProps({
    variant: {
        type: String,
        default: '',
    },
    flat: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        default: 'Technician Name',
    },
    density: {
        type: String,
        default: '',
    },
    rules: {
        type: Array as PropType<any>,
        default: [],
    },
    modelValue: {
        required: true,
    },

    fetchData: {
        type: Boolean,
        required: false,
        default: true
    }
});

const emit = defineEmits(['update:modelValue', 'selection']);

const commonListStore = useMaintenanceCommonListStore()

const { loadingEmployees: loading } = storeToRefs(commonListStore);


const technicians = computed(() => {
    return commonListStore.getTechnicians
})

onMounted(() => {
    if (props.fetchData) {
        commonListStore.fetchList('employees')
    }
})

const selectedItem = computed({
    get() {
        return props.modelValue;
    },
    set(value: any) {
        let selectedItem = technicians.value.find(item => item.user_id == value)
        emit('update:modelValue', value);
        emit('selection', selectedItem);
    },
});


const initials = (name: string) => {
    return name?.split(' ').map((word: any) => word.charAt(0).toUpperCase()).join('') || 'N/A'
}

const avatarColor = (initials: string) => {
    if (initials === 'N/A') {
        return 'grey'
    }

    const hue = initials.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0) % 360;
    return `hsl(${hue}, 80%, 70%)`;
}

function getAvatarIcon(label: any, size: any, circleSize: any) {
    // Générer les initiales à partir du label
    const words = Boolean(label) ? label.split(' ') : ['N', 'A'];
    const initials = words.map((word: string) => word.charAt(0).toUpperCase());

    // Créer un canvas et un contexte 2D
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return '';
    }

    // Générer une couleur unique pour l'avatar
    const colorHash = (Boolean(label) ? label.split('') : ['N', 'A']).reduce((acc: number, char: string) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
    const color = `#${(colorHash & 0xFFFFFF).toString(16).padStart(6, '0')}`;

    // Dessiner le fond avec la couleur unique
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, circleSize / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Dessiner les initiales en blanc
    ctx.font = `${(circleSize * 0.6)}px Arial`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials.slice(0, 2).join(''), size / 2, size / 2);

    return canvas.toDataURL();

}
</script>