<template>
    <div>
        <v-row>
            <v-col cols="12" md="6">
                <v-btn v-if="hasImage" @click="isExpanded = !isExpanded" :class="{ rotated: isExpanded }"
                    class="trigger-btn mr-2" density="comfortable" variant="text" icon="mdi-menu-right"
                    size="medium"></v-btn>
                
                <div class="d-inline-flex flex-column" :class="{ 'ml-7': !hasImage }">
                    <span>{{ item.item }}</span>
                    <span class="text-caption" v-if="item.failed">Item Failure: <SharedTableItemFailureItem  :value="item.item_failure_id" type="id" /></span>
                </div>
                <v-icon v-if="hasImage" color="grey" class="ml-3">mdi-image</v-icon></v-col>
            <v-col cols="12" md="6">
                {{ item.value }} <span v-if="item.failed" class="text-error">(Failed)</span>
            </v-col>
        </v-row>
        <v-expand-transition>
            <div v-if="hasImage && isExpanded" class="ml-10 pa-5">
                {{ item.photo }}
                <v-row>
                    <v-col cols="12" md="6" v-for="(img, i) in item.photos" :key="i">
                        <v-img :src="img"></v-img>
                    </v-col>
                </v-row>
            </div>
        </v-expand-transition>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue"

const props = defineProps({
    item: {
        type: Object as any,
        required: true,
    }
})

const isExpanded = ref<boolean>(false)

const hasImage = computed(() => {
    return Array.isArray(props.item.photos) && props.item.photos.length
})
</script>


<style scoped>
.trigger-btn {
    transition: transform 0.3s ease;
}

.trigger-btn.rotated {
    transform: rotate(90deg);
}
</style>