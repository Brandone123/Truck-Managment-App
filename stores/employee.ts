import { defineStore } from 'pinia';

import type { EmployeeInfo } from '~/types/store/employee';

interface State {
  employeeList: EmployeeInfo[];
  reportData: Object;
  loading: boolean
}

export const useEmployeeStore = defineStore('employee', {
  state: (): State => ({
    employeeList: [],
    reportData: {},
    loading: false,
  }),

  getters: {
    getEmployeeList: (state) => { return state.employeeList }
  },

  actions: {
    async fetchEmployeeList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/shared/employees');
      console.log(data)
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch employees list', 'error')
      } else {
        this.employeeList = data.value as EmployeeInfo[];
      }
      this.loading = false
    },

    async createEmployee(payload: EmployeeInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch('/api/shared/employees', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create Employee', 'error');
      } else {
        let employee = data.value as EmployeeInfo;
        this.employeeList.push(employee)
        useLayoutStore().setStatusMessage('Employee created', 'primary');
      }
    },

    async updateEmployee(payload: EmployeeInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch(`/api/shared/employees/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update employee', 'error');
      } else {
        let response = data.value as EmployeeInfo
        let index = this.employeeList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.employeeList[index], response)
        }
        useLayoutStore().setStatusMessage('Employee updated', 'primary');
      }
    },

    async deleteEmployee(employee_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/shared/employees/${employee_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete employee', 'error');
      }
      else {
        const index = this.employeeList.findIndex((employee) => employee.id === employee_id);
        if (index > -1) {
          this.employeeList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Employee deleted', 'primary');
      }
    },

    async getAttendanceReport(payload: any) {
      return new Promise(async (resolve, reject) => {
        try {
          useLayoutStore().setOverlay(true);
          const { data, error } = await useApiFetch(`/api/attendance/timeoff/reports`, {
            method: 'POST',
            body: payload,
          });
          useLayoutStore().setOverlay(false);

          if (error.value) {
            useLayoutStore().setStatusMessage('Failed to get Report Data', 'error');
            reject(error);
          } else {
            useLayoutStore().setStatusMessage('Employee created', 'primary');
            resolve(data);
          }
        } catch (error) {
          reject(error);
        }
      });
    }
  },
})
