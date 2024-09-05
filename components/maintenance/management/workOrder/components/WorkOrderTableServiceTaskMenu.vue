<template>
    <v-menu location="bottom" max-height="400px" width="350px" location-strategy="connected" open-on-hover
        class="rounded">
        <template v-slot:activator="{ props }">
            <span v-bind="props" style="cursor: pointer; border-bottom: 1px dotted;"># {{
                serviceTask?.name }}</span>
        </template>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card class="rounded-lg">
                    <v-card-text>
                        <v-list>
                            <span class="font-weight-bold">{{ serviceTask?.name }}</span>
                            <v-list-item class="px-0">
                                Description: {{ serviceTask?.description || '---' }}
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-menu>
</template>

<script setup lang="ts">

const serviceTaskStore = useServiceTaskStore();
const serviceTasks = computed(() => serviceTaskStore.serviceTaskList);

const props = defineProps({
    serviceTaskId: {
        type: Number,
        required: true
    }
})

const serviceTask = computed(() => {
    return serviceTasks.value.find((serviceTask) => serviceTask.id === props.serviceTaskId)
})


</script>