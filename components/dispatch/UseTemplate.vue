
<template>
    <v-dialog v-model="dialog" max-width="800px">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon flat color="transparent">
                <v-icon :color="dark ? 'white' : 'primary'">mdi-text-box-check</v-icon>
            </v-btn>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" density="compact">
                <v-toolbar-title>Template Data</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-form ref="templateForm">
                    <div v-for="(stop, i) in stopInfo" :key="i">
                    <div>Stop #{{ stop.stop_number }}</div>
                    <v-row>
                        <v-col cols="12" md="3" class="pb-0">
                            <v-text-field v-model="stop.available_from" variant="solo" flat type="date"
                                label="Available From" density="compact"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3" class="pb-0">
                            <v-text-field v-model="stop.available_through" variant="solo" flat type="date"
                                label="Available Thru" density="compact"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3" class="pb-0">
                            <v-text-field v-model="stop.time_from" variant="solo" flat type="time" label="Time From"
                                density="compact"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3" class="pb-0">
                            <v-text-field v-model="stop.time_to" variant="solo" flat type="time" label="Time To"
                                density="compact"></v-text-field>
                        </v-col>
                    </v-row>
                </div>
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
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { LoadInfo, StopInfo } from '~/types/dispatch/load'
import { v4 as uuidv4 } from 'uuid';

const emit = defineEmits(['createLoad'])

const props = defineProps({
    status: {
        type: String,
        required: false,
    },
    dark: {
        type: Boolean,
        required: false,
        default: false
    },
    load: {
        type: Array<LoadInfo>,
        required: true
    }
});

const loadTemplateStore = useLoadTemplateStore()
const { loadTemplateList } = storeToRefs(loadTemplateStore)

const dialog = ref(false)
const stopInfo = ref<stopInfo[]>([])
const templateForm = ref(null)

const resetDialog: void = () => {
    if(templateForm.value){
        templateForm.value.reset()
    }
    stopInfo.value = []
}

const save = () => {
    let payload = props.load
    payload.id = uuidv4().substring(0, 8);
    payload.stops = stopInfo
    emit('createLoad',payload)
}

watch(dialog, (val) => {
    if (val) {
        stopInfo.value = props.load?.stops || []
    }
    else {
        resetDialog()
    }
})
</script>