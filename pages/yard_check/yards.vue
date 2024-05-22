<script setup lang="ts">
import { ref } from 'vue'
import type { YardInfo } from '@/types/yard/yard'
import {useYardStore} from '@/stores/yard'


const yardStore = useYardStore()

const yardDialog = ref(false)
const updatingYard = ref(false)


const defaultYard: Ref<YardInfo> = ref({
    id: null,
    name: null,
    location: null,
    capacity: null,
    geofence_polygon: null,
});

const editedYard = ref(defaultYard.value)

const editYard = (yard: YardInfo) => {
    editedYard.value = Object.assign({}, yard)
    updatingYard.value = true
    yardDialog.value = true
}

const deleteYard = (id: number) => {
    yardStore.deleteYard(id)
}

const updateyardDialog = (value: boolean) => {
    yardDialog.value = value
    editedYard.value = defaultYard.value as YardInfo
    updatingYard.value = false
}

</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Yards</span>
            <div>
                <YardCheckYardReport />
                <YardCheckYardDialog :show="yardDialog" @update:show="updateyardDialog"
                    :updating="updatingYard" :item="editedYard" />
            </div>

        </div>
        <YardCheckYardTable @editYard="editYard" @deleteYard="deleteYard" />
    </div>
</template>

