<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useRoleStore } from '@/stores/role'
import type { RoleInfo } from '@/types/store/role';


const roleStore = useRoleStore()
const { roleList, loading } = storeToRefs(roleStore)

onMounted(() => {
    roleStore.fetchRoleList();
});

const emit = defineEmits(['editRole', 'deleteRole'])
const roleHeaders = ref([
    { title: 'ROLE ID', key: 'id' ,class:"no-wrap" },
    { title: 'NAME ', key: 'name' ,class:"no-wrap" },
    { title: 'DESCRIPTION', key: 'description',class:"no-wrap"  },
    { title: 'ACTIONS', key: 'actions',class:"no-wrap" },

])

const editTemplate = (item: RoleInfo) => {
    emit('editRole', item)
}

const deleteTemplate = (role_id: number) => {
    emit('deleteRole', role_id)
}


</script>
<template>
    <SharedUiCustomTable return-object show-select :headers="roleHeaders"
        :items="roleList" :loading="loading">
        <template v-slot:item.actions="{ item }">
            <div>
                <v-icon color="primary" dense @click="editTemplate(item)">mdi-pencil</v-icon>
                <v-icon color="red" dense @click="deleteTemplate(item.id)">mdi-delete</v-icon>
            </div>
        </template>
    </SharedUiCustomTable>
</template>


<style scoped >
</style>