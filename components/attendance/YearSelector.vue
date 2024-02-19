<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
    currentYear: {
        type: Number,
        required: true,
    }
})

const emit = defineEmits(['update:currentYear'])

const yearMenu = ref(false)
const setYear = ref(props.currentYear)

function setYearSelection(): void {
    setYear.value = props.currentYear
}

function updateYearSelection(): void {
    emit('update:currentYear', setYear.value)
    yearMenu.value = false
}

watch(yearMenu, (value) => {
    if (value) {
        setYearSelection()
    }
});

</script>
<template>
    <v-menu location="bottom" :close-on-back="true" :close-on-content-click="false" v-model="yearMenu">
        <template v-slot:activator="{ props }">
            <v-btn color="primary" variant="text" density="compact" v-bind="props" class="ml-1">
                {{ currentYear }}
            </v-btn>
        </template>

        <v-card max-width="300px">
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-text-field prepend-icon="mdi-minus" @click:prepend="setYear -= 1" append-icon="mdi-plus"
                            @click:append="setYear += 1" type="number" density="compact" variant="outlined" hide-details
                            label="Year" v-model="setYear"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn density="compact" @click="yearMenu = false">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn density="compact" color="primary" @click="updateYearSelection">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>