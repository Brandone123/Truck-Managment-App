<template>
    <v-menu location="bottom" max-height="400px" width="350px" location-strategy="connected" open-on-hover
        class="rounded">
        <template v-slot:activator="{ props }">
            <span v-bind="props" class="text-secondary" style="cursor: pointer; border-bottom: 1px dotted;"># {{
                issue.id }} <span v-if="showSummary">. {{ issue.summary }}</span></span>
        </template>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card class="rounded-lg">
                    <v-card-text>
                        <div>
                            <v-row>
                                <v-col cols="12" md="6">Status</v-col>
                                <v-col cols="12" md="6">
                                    <v-chip density="compact" class="text-capitalize" variant="flat"
                                    v-if="issue.status" :color="getStatusColor(issue.status)">{{ issue.status
                                    }}</v-chip>
                                </v-col>
                            </v-row>
                            <v-divider class="my-2"></v-divider>
                            <v-row>
                                <v-col cols="12" md="6">Summary</v-col>
                                <v-col cols="12" md="6">{{ issue.summary }}</v-col>
                            </v-row>
                            <v-divider class="my-2"></v-divider>
                            <v-row>
                                <v-col cols="12" md="6">Description</v-col>
                                <v-col cols="12" md="6">{{ issue.description }}</v-col>
                            </v-row>
                            <v-divider class="my-2"></v-divider>
                            <v-row>
                                <v-col cols="12" md="6">Vehicle</v-col>
                                <v-col cols="12" md="6">
                                    <div v-if="issue.asset_name" class="d-inline-flex align-center">
                                        <span>
                                            <div class="rounded position-relative"
                                                style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
                                                <span style="font-size:xx-small;" v-if="vehicle?.type">{{
                                                    vehicle?.type.slice(0, 3).toUpperCase()
                                                    }}</span>
                                                <span v-else style="font-size:xx-small;">VHI</span>
                                                <div v-if="vehicle?.status"
                                                    :class="`${'bg-' + getVehicleStatusColor(vehicle?.status)}`"
                                                    style="width: 10px; height: 10px; position: absolute; bottom: -2px; right: -2px; border-radius: 50%;">
                                                </div>
                                            </div>
                                        </span>
                                        <span>
                                            <span class="text-secondary ml-2" v-bind="props"
                                                style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                                                {{ vehicle?.name }} {{}}
                                            </span>
                                        </span>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-divider class="my-2"></v-divider>
                            <v-row>
                                <v-col cols="12" md="6">Reported Date</v-col>
                                <v-col cols="12" md="6">{{ issue.reported_date }}</v-col>
                            </v-row>
                            <v-divider class="my-2"></v-divider>
                            <v-row>
                                <v-col cols="12" md="6">Reported By</v-col>
                                <v-col cols="12" md="6">
                                    <v-chip v-if="issue.reported_by" variant="text"
                                        :prepend-avatar="getAvatarIcon(getTechnicianName(issue.reported_by))">
                                        <span class="text-secondary" style="cursor: pointer; border-bottom: 1px dotted;">
                                            {{ getTechnicianName(issue.reported_by) }}</span>
                                    </v-chip>
                                    <span v-else>---</span>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-menu>
</template>

<script setup lang="ts">

// const techniciansStore = useTechniciansStore();
// const technicians = computed(() => techniciansStore.technicians);
const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList)

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);


const props = defineProps({
    issue: {
        type: Object,
        required: true,
    },
    showSummary: {
        type: Boolean,
        required: false,
        default: false
    }
})

const getStatusColor = (status: any) => {
    switch (status.toLocaleLowerCase()) {
        case 'open':
            return 'secondary';
        case 'overdue':
            return 'orange';
        case 'closed':
            return 'grey';
        case 'resolved':
            return 'primary';
    }
}

const vehicle = computed(() => {
    return assetList.value.find((vehicle) => vehicle.name === props.issue?.asset_name)
})


const getVehicleStatusColor = (status: any) => {
    switch (status) {
        case 'active':
            return 'green';
        case 'maintenance':
            return 'red';
        case 'inactive':
            return 'secondary';
        default:
            return 'grey';
    }
}

function getAvatarIcon(label: any) {
    const size = 50;
    const circleSize = 50;

    // Générer les initiales à partir du label
    const words = label.split(' ');
    const initials = words.map((word: any) => word.charAt(0).toUpperCase());

    // Créer un canvas et un contexte 2D
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return '';
    }

    // Générer une couleur unique et légère pour l'avatar
    const colorHash = label.split('').reduce((acc: number, char: string) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
    const hue = (colorHash % 360);
    const saturation = 80;
    const lightness = 70;
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    // Dessiner le fond avec la couleur légère
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

const getTechnicianName = (technicianId: any) => {
    const technicianName = technicians.value.find((technician) => technician.user_id === technicianId)
    return technicianName ? technicianName.full_name : '';
}

</script>