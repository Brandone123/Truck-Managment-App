<script setup lang="ts">
import { ref } from 'vue'
import type { RoleInfo } from '@/types/store/role'
import {useRoleStore} from '@/stores/role'

const roleStore = useRoleStore()

const roleDialog = ref(false)
const updatingRole = ref(false)

const defaultRole = ref<RoleInfo>({
    id: null,
    name: null,
    permissions: null,
    description: null,
});

const editedRole = ref(defaultRole.value)


const editRole = (driver: RoleInfo) => {
    editedRole.value = Object.assign({}, driver)
    updatingRole.value = true
    roleDialog.value = true
}

const deleteRole = (role_id: number) => {
    roleStore.deleteRole(role_id)
}

const updateroleDialog = (value: boolean) => {
    roleDialog.value = value
    editedRole.value = defaultRole.value as RoleInfo
    updatingRole.value = false
}
</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Roles</span>
            <div>
                <SettingsRoleDialog :show="roleDialog" @update:show="updateroleDialog"
                    :updating="updatingRole" :item="editedRole" />
            </div>

        </div>
        <SettingsRoleTable @editRole="editRole" @deleteRole="deleteRole" />
    </div>
</template>

