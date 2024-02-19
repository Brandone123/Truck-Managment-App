<template>
    <v-dialog v-model="dialog" width="800px">
        <template v-slot:activator="{ props }">
            <v-btn color="primary" flat v-bind="props" class="text-none">
                Assign Driver/Truck/Trailer
            </v-btn>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" title="Assign Driver/Truck/Trailer" density="compact">
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-form ref="bulkActionForm">
                    <v-row>
                        <v-col cols="12" class="pb-0">
                            <v-checkbox v-model="assignDriver" density="compact" color="primary" hide-details>
                                <template v-slot:label class="font-weight-bold">Assign Driver</template>
                            </v-checkbox>
                        </v-col>
                        <v-col cols="12" class="pt-0">
                            <v-autocomplete :disabled="!assignDriver" v-model="bulkAssignData.driver_id" variant="solo" flat
                                label="Driver" :items='[{ id: 1, name: "Driver 1" }, { id: 2, name: "Driver 2" }]'
                                density="compact" item-title="name" item-value="id"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <v-checkbox v-model="assignTruck" density="compact" color="primary" hide-details>
                                <template v-slot:label class="font-weight-bold">Assign Truck</template>
                            </v-checkbox>
                        </v-col>
                        <v-col cols="12" class="pt-0">
                            <v-autocomplete :disabled="!assignTruck" v-model="bulkAssignData.truck_id" variant="solo" flat
                                label="Truck" :items='[{ id: 1, name: "Truck 1" }, { id: 2, name: "Truck 2" }]'
                                density="compact" item-title="name" item-value="id"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" clas="pb-0">
                            <v-checkbox v-model="assignTrailer" density="compact" color="primary" hide-details>
                                <template v-slot:label class="font-weight-bold">Assign Trailer</template>
                            </v-checkbox>
                        </v-col>
                        <v-col cols="12" class="pt-0">
                            <v-autocomplete :disabled="!assignTrailer" v-model="bulkAssignData.trailer_id" variant="solo"
                                flat label="Trailer" :items='[{ id: 1, name: "Trailer 1" }, { id: 2, name: "Trailer 2" }]'
                                density="compact" item-title="id" item-value="id"></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="save">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, defineProps, defineEmits, toRefs, watch } from 'vue'
import type { StopInfo } from '@/types/store/load'

// const emit = defineEmits([''])

const props = defineProps({
    items: {
        type: Array<number>,
        required: false,
    },
});

const bulkAssignData = ref({})
const bulkActionForm = ref(null)

const assignDriver = ref(false)
const assignTruck = ref(false)
const assignTrailer = ref(false)

const save = () => {
    dialog.value = false
}

const dialog = ref(false)

const resetForm = () => {
    if (bulkActionForm.value) {
        (bulkActionForm.value as HTMLFormElement).reset(); // Reset the form
    }

    assignDriver.value = false
    assignTruck.value = false
    assignTrailer.value = false
    bulkAssignData.value = {}
}

watch(dialog, (val) => {
    resetForm()
})
</script>