<template>
    <div>
        <v-chip class="mr-2" v-if="component.type === 'date_time'">
            <v-icon color="grey">mdi-calendar-minus</v-icon>Date / Time
        </v-chip>

        <v-chip class="mr-2" v-if="component.type === 'dropdown'">
            <v-icon color="grey">mdi-format-list-bulleted</v-icon>Dropdown
        </v-chip>

        <v-chip class="mr-2" v-if="component.type === 'free_text'">
            <v-icon color="grey">mdi-message-text-outline</v-icon>Free Text
        </v-chip>

        <v-chip class="mr-2" v-if="component.type === 'meter_entry'">
            <v-icon color="grey">mdi-gauge</v-icon>Meter Entry
        </v-chip>

        <v-chip class="mr-2" v-if="component.type === 'number'">
            <v-icon color="grey">mdi-pound</v-icon>Number
        </v-chip>

        <v-chip class="mr-2" v-if="component.type === 'pass_fail'">
            <v-icon color="grey">mdi-check-circle-outline</v-icon>Pass / Fail
        </v-chip>

        <v-chip class="mr-2" v-if="component.type === 'photo'">
            <v-icon color="grey">mdi-image-outline</v-icon>Photo
        </v-chip>

        <v-chip class="mr-2" v-if="component.type === 'signature'">
            <v-icon color="grey">mdi-feather</v-icon>Signature
        </v-chip>

        <v-chip class="mr-2" v-if="component.type === 'section'">
            <v-icon color="grey">mdi-folder-outline</v-icon>Section
        </v-chip>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps({
    component: {
        type: Object,
        required: true,
    },
})

</script>

<style scoped>
.mr-2 {
    margin-right: 8px;
    /* Adjust margin as needed */
}
</style>