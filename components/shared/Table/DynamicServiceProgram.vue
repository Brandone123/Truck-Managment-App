<template>
    <v-menu location="bottom" max-height="310px" width="20" location-strategy="connected" :close-on-content-click="true"
        class="rounded" open-on-hover>
        <template v-slot:activator="{ props }">
            <div v-bind="props">
                <span class="font-weight-bold" style="cursor: pointer; border-bottom: 1px dotted;">{{ program.id }}</span>
            </div>
        </template>
        <v-list>
            <v-list-item :title="program.program_name">
            </v-list-item>
        </v-list>
    </v-menu>
</template>


<script setup lang="ts">
const props = defineProps({
    program: {
        type: Object as PropType<any>,
        default: []
    }
})

</script>