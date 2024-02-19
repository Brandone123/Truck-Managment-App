<script setup lang="ts">
import { ref } from 'vue'
import { ColorPickerIcon } from 'vue-tabler-icons';

const emit = defineEmits(['selectColor'])

let menu = ref(false)

const props = defineProps({
    value: {
        type: String,
        required: true,
    }
})

const color = ref('')

function saveColor() {
    emit('selectColor', color.value)
    menu.value = false
}

watch(menu, (val) => {
    if (val) {
        console.log(props.value)
        color.value = props.value
    }
})
</script>
<template>
    <v-menu location="bottom" :close-on-back="true" v-model="menu" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-col cols="12" md="6" class="pb-0">
                <v-btn v-bind="props" :color="value">{{ value ? 'Update Color' : 'Select Color'
                }}</v-btn>
            </v-col>
        </template>
        <v-card>
            <v-color-picker class="ma-2" v-model="color"></v-color-picker>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="primary" variant="text" @click="menu = false">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="saveColor">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>