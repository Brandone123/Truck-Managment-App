import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { DepartmentInfo } from '~/types/store/department';

interface State {
    departmentList: DepartmentInfo[];
    loading: boolean
}

export const useDepartmentStore = defineStore('department', {
    state: (): State => ({
        departmentList: [],
        loading: false
    }),

    getters: {
        getDepartmentList: (state) => { return state.departmentList }
    },

    actions: {
        async fetchDepartmentList(){
            this.loading = true
            const {data, error} = await useApiFetch('/api/shared/departments');
            if(error.value){
               useLayoutStore().setStatusMessage('Failed to fetch department list', 'error')
            }else {
              this.departmentList = data.value as DepartmentInfo[];
            }
            this.loading = false
          },
      
          async createDepartment(payload: DepartmentInfo) {
            useLayoutStore().setOverlay(true)
            const { error, data } = await useApiFetch('/api/shared/departments', {
              method: 'POST',
              body: payload,
            });
            useLayoutStore().setOverlay(false)

            if (error.value) {
              useLayoutStore().setStatusMessage('Failed to create Department', 'error');
            } else {
              let department = data.value as DepartmentInfo;
              this.departmentList.push(department)
              useLayoutStore().setStatusMessage('Department created', 'primary');
            }
          },
      
          async updateDepartment(payload: DepartmentInfo) {
            useLayoutStore().setOverlay(true)
            const {data, error} = await useApiFetch(`/api/shared/departments/${payload.id}`, {
              method: 'PUT',
              body: payload,
            });
            useLayoutStore().setOverlay(false)

            if (error.value) {
              useLayoutStore().setStatusMessage('Failed to update department', 'error');
            } else {
              let response = data.value as DepartmentInfo
              let index = this.departmentList.findIndex(item => item.id === response.id)
              if (index > -1) {
                Object.assign(this.departmentList[index], response)
              }
              useLayoutStore().setStatusMessage('Department updated', 'primary');
            }
          },

          async deleteDepartment(department_id: number): Promise<void> {
            useLayoutStore().setOverlay(true)
            const { error } = await useApiFetch(`/api/shared/departments/${department_id}`, {
              method: 'DELETE',
            });
            useLayoutStore().setOverlay(false)
      
            if (error.value) {
              useLayoutStore().setStatusMessage('Failed to delete department', 'error');
            }
            else {
              const index = this.departmentList.findIndex((department) => department.id === department_id);
              if (index > -1) {
                this.departmentList.splice(index, 1);
              }
              useLayoutStore().setStatusMessage('Department deleted', 'primary');
            }
          },
    },
})
