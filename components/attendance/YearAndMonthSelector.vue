<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDate } from 'vuetify'

const props = defineProps({
    currentDate: {
        type: Date,
        required: true,
    }
})

const emit = defineEmits(['update:currentDate'])

const date = useDate()

const yearMonthMenu = ref(false)
const setMonth = ref(props.currentDate.getFullYear())
const setYear = ref(props.currentDate.getMonth())
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const currentMonthAndYearLabel = computed(() => {
    return date.format(`${props.currentDate.getFullYear()}-${props.currentDate.getMonth() + 1}-01`, 'monthAndYear')
})

function setYearMonthSelection(): void {
    setMonth.value = props.currentDate.getMonth()
    setYear.value = props.currentDate.getFullYear()
}

function updateYearMonthSelection(): void {
    emit('update:currentDate', new Date(setYear.value, setMonth.value, 1))
    yearMonthMenu.value = false
}

watch(yearMonthMenu, (newValue, oldValue) => {
    if (newValue) {
        setYearMonthSelection()
    }
});
</script>
<template>
    <v-menu location="bottom" :close-on-back="true" :close-on-content-click="false" v-model="yearMonthMenu">
        <template v-slot:activator="{ props }">
            <v-btn color="primary" variant="text" density="compact" v-bind="props" class="ml-1">
                {{ currentMonthAndYearLabel }}
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
                    <v-col cols="12">
                        <v-row>
                            <v-col cols="4" v-for="(month, i) in months" :key="i">
                                <v-btn @click="setMonth = i" :color="setMonth == i ? 'primary' : ''" variant="text"
                                    density="compact">
                                    {{ month.substring(0, 3) }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn density="compact" @click="yearMonthMenu = false">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn density="compact" color="primary" @click="updateYearMonthSelection">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>