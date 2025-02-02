<template>
    <div>
        <v-chip class="mr-2" v-if="component.type === 'section'">
            <v-icon color="grey">mdi-folder-outline</v-icon>Section
        </v-chip>

        <!-- <v-chip class="mr-2" v-if="component.type === 'text_input'">
            <v-icon color="grey">mdi-lead-pencil</v-icon>Text Input
        </v-chip> -->

        <v-chip class="mr-2" v-if="component.type === 'free_text'">
            <v-icon color="grey">mdi-message-text-outline</v-icon>Free Text
        </v-chip>

        <v-chip class="mr-2" v-if="component.type === 'dropdown'">
            <v-icon color="grey">mdi-format-list-bulleted</v-icon>Dropdown
        </v-chip>

        <v-chip class="mr-2" v-if="component.type === 'checkbox'">
            <v-icon color="grey">mdi-checkbox-marked</v-icon>Checkbox
        </v-chip>

        <v-chip class="mr-2" v-if="component.type === 'number'">
            <v-icon color="grey">mdi-pound</v-icon>Number
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