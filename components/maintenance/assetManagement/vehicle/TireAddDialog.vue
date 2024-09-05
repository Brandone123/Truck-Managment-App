<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px"
        scrollable>
        <v-card>
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>Install Tire</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-select label="Tire Model" :items="tireModels" v-model="selectedTireModel"></v-select>
                    </v-col>
                    <v-col cols="12" sm="3">
                        <v-checkbox label="New Tire" v-model="newTire" :disabled="usedTire"></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="3">
                        <v-checkbox label="Used Tire" v-model="usedTire" :disabled="newTire"></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field label="Tire Meter (miles)" type="number" v-model="tireMeter"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-select label="Axle" :items="axleOptions" v-model="selectedAxle"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-select v-if="selectedAxle === 'Front Axle'" label="Position" :items="positionOptions" v-model="selectedPosition"></v-select>
                        <v-select v-else-if="selectedAxle === 'Axle 2'" label="Position" :items="position2Options" v-model="selectedPosition"></v-select>
                        <v-select v-else label="Position" :items="position3Options" v-model="selectedPosition"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field label="Tread Depth/32 inch" type="number" v-model="treadDepth"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field label="Pressure" type="number" v-model="pressure"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="saveTireInstallation">
                    Save
                </v-btn>
                <v-btn color="error" @click="closeDialog">
                    Cancel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
    modelValue: Boolean,
    selectedTire: {
        type: Object as any,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue', 'close']);

const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
};

const closeDialog = () => {
    emit('update:modelValue', false);
    emit('close');
};

const tireModels = ['Tire Model A', 'Tire Model B', 'Tire Model C'];
const axleOptions = ['Front Axle', 'Axle 2', 'Axle 3'];
const positionOptions = ['Left Front (LF)', 'Right Front (RF)'];
const position2Options = ['Left Outer (2LO)', 'Right Outer (2RO)', 'Left Inner (2LI)', 'Right Inner (2RI)'];
const position3Options = ['Left Outer (3LO)', 'Right Outer (3RO)', 'Left Inner (3LI)', 'Right Inner (3RI)'];

const selectedTireModel = ref('');
const newTire = ref(true);
const usedTire = ref(false);
const tireMeter = ref(0);
const selectedAxle = ref('');
const treadDepth = ref(0);
const pressure = ref(0);

const saveTireInstallation = () => {
    console.log('Tire installation saved:', {
        tireModel: selectedTireModel.value,
        newTire: newTire.value,
        usedTire: usedTire.value,
        tireMeter: tireMeter.value,
        selectedAxle: selectedAxle.value,
        selectedPosition: selectedPosition.value,
        treadDepth: treadDepth.value,
        pressure: pressure.value
    });

    closeDialog();
};

const selectedPosition = ref('');

watch(() => props.selectedTire?.selectedPosition, (newValue) => {
  if (newValue === 'Left Front (LF)' || newValue === 'Right Front (RF)') {
    selectedAxle.value = 'Front Axle';
    selectedPosition.value = newValue;
  } else if (newValue === 'Left Outer (2LO)' || newValue === 'Right Outer (2RO)' || newValue === 'Left Inner (2LI)' || newValue === 'Right Inner (2RI)') {
    selectedAxle.value = 'Axle 2';
    selectedPosition.value = newValue;
  } else {
    selectedAxle.value = 'Axle 3';
    selectedPosition.value = newValue;
  }
});

const isFirstAxleChange = ref(true);

watch(() => selectedAxle.value, (newValue) => {
  if (isFirstAxleChange.value) {
    isFirstAxleChange.value = false;
  } else {
    selectedPosition.value = '';
  }
});

</script>

<style scoped>
.vertical-text {
    /* writing-mode: vertical-lr; */
    transform: rotate(-30deg);
    /* width: 50px; */
    /* margin-top: 20px; */
}

.v-table th,
.v-table td {
    text-align: left;
    padding: 12px 16px;
}
</style>