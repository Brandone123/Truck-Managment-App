<template>
    <v-card @mouseover="isHovering = true" @mouseout="isHovering = false" class="rounded-0" flat>
        <v-hover>
            <template v-slot:default="{ isHovering, props }">
                <div v-bind="props" class="px-3 py-3" :class="isHovering ? 'grey-background' : ''">
                    <v-row align="center" @click="isExpanded = !isExpanded">
                        <v-col cols="12" class="pb-0">

                            <div class="d-flex align-center justify-space-between">
                                <div>
                                    <v-btn class="trigger-btn mr-2" :class="{ rotated: isExpanded }"
                                        density="comfortable" variant="text" icon="mdi-menu-right"
                                        size="medium"></v-btn>
                                    <span>{{ formatAxlePosition(tire.current_installation?.position) }} ({{
                                        tire.current_installation?.position }})</span>
                                    <span class="text-grey ml-1">. {{ getAxle(tire.current_installation?.axle) }}</span>
                                </div>
                                <div v-if="isHovering">
                                    <v-tooltip text="Rotate" location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <v-btn variant="fab" v-bind="props" size=""
                                                @click.stop="$emit('rotate')"><v-icon>mdi-format-rotate-90</v-icon></v-btn>
                                        </template>
                                    </v-tooltip>
                                    <v-tooltip text="Remove" location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <v-btn variant="fab" v-bind="props" size=""
                                                @click.stop="$emit('remove')"><v-icon>mdi-delete</v-icon></v-btn>
                                        </template>
                                    </v-tooltip>
                                </div>
                            </div>


                        </v-col>
                        <v-col cols="12" class="pl-8 pt-0">
                            <div class="d-inline-flex" v-if="tire.part">
                                <v-card class="rounded position-relative mr-1 grey-background"
                                    style=" display: flex; justify-content: center; align-items: center;height: 48px;width:48px;">
                                    <v-icon size="x-large">mdi-package-variant-closed</v-icon>
                                </v-card>
                                <span class="d-flex flex-column">
                                    <span>
                                        <span @click="" class="text-primary mr-5" style="cursor: pointer; border-bottom: 1px dotted;
                justify-content: center; align-items: center; text-align: center; white-space: nowrap;
                text-overflow: ellipsis;">
                                            {{ tire?.part?.part_number }}
                                        </span>
                                    </span>
                                    <span>
                                        <v-tooltip text="Manufacturer Part Number">
                                            <template v-slot:activator="{ props }">
                                                <!-- underlined value with dialog hover efect -->
                                                <span v-bind="props"
                                                    style="font-size: 12px;border-bottom: 1px dotted;">{{
                                                        tire?.part?.manufacturer_part_number
                                                    }}</span>
                                            </template>
                                        </v-tooltip>
                                        <!-- description  on right ofoption bottom -->
                                        <span class="mx-1">.</span>
                                        <span style="font-size: 12px;">{{
                                            tire?.part?.description }}</span>
                                    </span>
                                </span>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </template>
        </v-hover>
        <v-expand-transition>
            <v-card-text v-if="isExpanded" class="pl-9">
                <v-row>
                    <v-col cols="6">
                        Current Tread Depth
                    </v-col>
                    <v-col cols="6">
                        {{ tire?.current_installation?.tread_depth }}
                    </v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                    <v-col cols="6">
                        Current Pressure (PSI)
                    </v-col>
                    <v-col cols="6">
                        {{ tire?.current_installation?.pressure }}
                    </v-col>
                </v-row>
            </v-card-text>
        </v-expand-transition>
    </v-card>


</template>

<script setup lang="ts">
import type { Tire } from '~/types/maintenance/tireTypes';
// import { storeToRefs } from 'pinia';
// import { useValidation } from '~/composables/formValidation';

// const validation = useValidation();


const props = defineProps({
    tire: {
        type: Object as PropType<Tire>,
        default: true
    },
});

const emits = defineEmits(['rotate', 'remove'])

const isHovering = ref<boolean>(false)
const isExpanded = ref(false)

const getAxle = (axle: number) => {
    return `Axle ${axle}`
}

function formatAxlePosition(position: string): string {
    if (!position || typeof position !== "string") {
        return "Invalid position input";
    }

    // Regex to detect if the position starts with a number
    const axleRegex = /^(\d+)([A-Z]+)$/i;

    if (axleRegex.test(position)) {
        const [, axle, side] = position.match(axleRegex) as RegExpMatchArray;

        // Define the side map
        const sideMap: Record<string, string> = {
            R: "Right",
            L: "Left",
            RO: "Right Outer",
            RI: "Right Inner",
            LO: "Left Outer",
            LI: "Left Inner",
        };

        // Return the formatted string based on the matched axle and side
        // return `${ordinalSuffix(parseInt(axle, 10))} Axle ${sideMap[side] || side}`;
        return sideMap[side] || side
    } else {
        // Handle non-axle positions like FL, FR, etc.
        const truckPositionMap: Record<string, string> = {
            RF: "Front Left",
            LF: "Front Right",
        };

        return truckPositionMap[position] || `Unknown position (${position})`;
    }
}

// Helper function to add ordinal suffix (e.g., 1 -> First, 2 -> Second)
function ordinalSuffix(number: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = number % 100;
    return number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
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
