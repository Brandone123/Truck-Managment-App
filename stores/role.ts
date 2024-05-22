import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { RoleInfo } from '~/types/store/role';

interface State {
  roleList: RoleInfo[];
  loading: boolean
}

export const useRoleStore = defineStore('role', {
  state: (): State => ({
    roleList: [],
    loading: false
  }),

  getters: {
    getRoleList: (state) => { return state.roleList }
  },

  actions: {
    async fetchRoleList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/shared/roles');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch role list', 'error')
      } else {
        this.roleList = data.value as RoleInfo[];
      }
      this.loading = false
    },

    async createRole(payload: RoleInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch('/api/shared/roles', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create Role', 'error');
      } else {
        let role = data.value as RoleInfo;
        this.roleList.push(role)
        useLayoutStore().setStatusMessage('Role created', 'primary');
      }
      // this.roleList.push({...payload, id: this.roleList.length})
    },

    async updateRole(payload: RoleInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/shared/roles/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update role', 'error');
      } else {
        let response = data.value as RoleInfo
        let index = this.roleList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.roleList[index], response)
        }
        useLayoutStore().setStatusMessage('Role updated', 'primary');
      }
      // let index = this.roleList.findIndex(item => item.id === payload.id)
      // if (index > -1) {
      //   Object.assign(this.roleList[index], payload)
      // }
    },

    async deleteRole(role_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/shared/roles/${role_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete role', 'error');
      }
      else {
        const index = this.roleList.findIndex((role) => role.id === role_id);
        if (index > -1) {
          this.roleList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Role deleted', 'primary');
      }
      // const index = this.roleList.findIndex((role) => role.id === role_id);
      // if (index > -1) {
      //   this.roleList.splice(index, 1);
      // }
    },
  },
})
