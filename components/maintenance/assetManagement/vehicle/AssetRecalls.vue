<template>
    <v-card height="200">
        <div class="d-flex">
            <div><v-card-title class="text-h7 font-weight-bold text-primary">Recalls</v-card-title></div>
        </div>

        <v-row class="pa-4">
            <v-col cols="6">
                <v-card class="pa-2">
                    <div>
                        <span>Need Action</span>
                        <div class="font-weigth-bold text-h5">{{ recallsNeedingAction }}</div>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-card class="pa-2">
                    <div>
                        <span>Open</span>
                        <div><span class="font-weigth-bold text-h5">{{ openRecalls }}</span></div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
const assetStore = useAssetStore();
const { selectedAsset, loading } = storeToRefs(assetStore);

const openRecalls = computed(() => {
    return selectedAsset.value?.open_recalls?.filter(recall => recall.status == 'open')?.length ?? 0
})

const recallsNeedingAction = computed(() => {
    return selectedAsset.value?.open_recalls?.filter(recall => recall.status == 'needs action')?.length ?? 0
})
</script>