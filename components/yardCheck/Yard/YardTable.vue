<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useYardStore } from '@/stores/yard'
import type { YardInfo } from '@/types/yard/yard';
import { useRouter } from 'vue-router';

const router = useRouter();


const yardStore = useYardStore()
const { yardList, loading } = storeToRefs(yardStore)

const yardOccupancyStore = useYardOccupancyStore()

const openYardDetail = (yardId: number) => {
    router.push(`/yard_check/yardDetail/${yardId}`);
}

onMounted(() => {
    yardStore.fetchYardList();
    yardOccupancyStore.fetchYardOccupancyList();
});

const emit = defineEmits(['editYard', 'deleteYard', 'yardInfos'])
const yardHeaders = ref([
    { title: 'YARD ID', key: 'id' ,class:"no-wrap" },
    { title: 'NAME ', key: 'name' ,class:"no-wrap" },
    { title: 'LOCATION', key: 'location',class:"no-wrap"  },
    { title: 'CAPACITY', key: 'capacity',class:"no-wrap"  },
    // { title: 'SHAPE TYPE', key: 'geofence_polygon?.type',class:"no-wrap"  },
    // { title: 'COORDINATE', key: 'geofence_polygon?.coordinates',class:"no-wrap"  },
    { title: 'ACTIONS', key: 'actions',class:"no-wrap" },

])

const editTemplate = (item: YardInfo) => {
    emit('editYard', item)
}

const deleteTemplate = (id: number) => {
    emit('deleteYard', id)
}

</script>
<template>
    <SharedUiCustomTable return-object show-select :headers="yardHeaders"
        :items="yardList" :loading="loading">
        <template v-slot:item.actions="{ item }">
            <div>
                <v-icon color="primary" dense @click="editTemplate(item)">mdi-pencil</v-icon>
                <v-icon color="red" dense @click="deleteTemplate(item.id)">mdi-delete</v-icon>
            </div>
        </template>
        <template v-slot:item.id="{ item }">
            <!-- <YardCheckYardDetail :yard="item" /> -->
            <span class="text-primary" style="cursor: pointer;" @click="openYardDetail(item.id)">{{ item.id }}</span>
        </template>
    </SharedUiCustomTable>
   
</template>


<style scoped >
</style>