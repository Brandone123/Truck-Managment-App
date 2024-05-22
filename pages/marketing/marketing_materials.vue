<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useMaterialMarketingStore } from '@/stores/marketing/material'
import type { MaterialMarketingInfo } from '@/types/marketing/material';


const materialMarketingStore = useMaterialMarketingStore()

const materialList = computed(() =>{
    const store = useMaterialMarketingStore();
    return store.getMaterialList;
  })


const emit = defineEmits(['editMaterial', 'deleteMaterial'])

const materialMarketingHeaders = ref([
    { title: 'MATERIAL ID', key: 'id' ,class:"no-wrap" },
    { title: 'MATERIAL NAME', key: 'material_name' ,class:"no-wrap" },
    { title: 'TYPE', key: 'type',class:"no-wrap"  },
    { title: 'DESCRIPTION', key: 'description',class:"no-wrap"  },
    { title: 'VIEW MATERIAL', key: 'link',class:"no-wrap"  },
    { title: 'ACTIONS', key: 'actions',class:"no-wrap" },

])

const materialMarketingDialog = ref(false)
const updatingMaterial = ref(false)


const defaultMaterialMarketing: Ref<MaterialMarketingInfo> = ref({
    id: null,
    material_name: null,
    type: null,
    description: null,
    file_path: null,
});

const editedMaterial = ref(defaultMaterialMarketing.value)

const editMaterial = (materialMarketing: MaterialMarketingInfo) => {
    editedMaterial.value = Object.assign({}, materialMarketing)
    updatingMaterial.value = true
    materialMarketingDialog.value = true
}

const updateMaterialDialog = (value: boolean) => {
    materialMarketingDialog.value = value
    editedMaterial.value = defaultMaterialMarketing.value as MaterialMarketingInfo
    updatingMaterial.value = false
}

const deleteMaterial = (id: number) => {
    materialMarketingStore.deleteMaterial(id)
}

const displayedImageId = ref();

const showImage = (materialId: number) => {
  displayedImageId.value = materialId;
};

</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
                <span class="text-primary text-h5">Materials </span>
                <div>
                    <MarketingMaterialDialog :updating="updatingMaterial" @update:show="updateMaterialDialog" 
                    :show="materialMarketingDialog" :item="editedMaterial" />
                </div>
        </div>
        
            <SharedUiCustomTable return-object show-select :headers="materialMarketingHeaders" :items="materialList">
                <template v-slot:item.actions="{ item }">
                    <div>
                    <v-icon color="primary" dense @click="editMaterial(item)">mdi-pencil</v-icon>
                    <v-icon color="red" dense @click="deleteMaterial(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
                <template v-slot:item.link="{ item }">
                  <div>
                    <v-icon color="primary" dense @click="showImage(item.id)">mdi-eye</v-icon>
                  </div>
                </template>
                <template v-slot:item.file_path="{ item }">
                  <div v-if="item.id === displayedImageId">
                    <v-img :src="item.file_path" alt="Material Image" width="100" height="100"></v-img>
                  </div>
                </template>
            </SharedUiCustomTable>
    </div> 
</template>