import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { AllEmployeeBenefitInfo, EmployeeBenefitInfo } from '~/types/employeeInformationAndOperation/benefit';

interface State {
  employeeBenefitList: AllEmployeeBenefitInfo[];
  loading: boolean;
}

export const useEmployeeBenefitStore = defineStore('employee_benefit', {
  state: (): State => ({
    employeeBenefitList: [],
    loading: false,
  }),

  getters: {
    getBenefitList: (state) => { return state.employeeBenefitList }
  },

  actions: {
    async fetchEmployeeBenefitList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/eio/employee-benefits');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch benefit list', 'error')
      } else {
        this.employeeBenefitList = data.value as AllEmployeeBenefitInfo[];
      }
      this.loading = false
    },


    async createEmployeeBenefit(payload: EmployeeBenefitInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch('/api/eio/employee-benefits', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to add employee benefit', 'error');
      } else {
        let response = data.value as EmployeeBenefitInfo;
        const employeeIndex = this.employeeBenefitList.findIndex((employee: AllEmployeeBenefitInfo) => employee.id === response.employee_id);
        if (employeeIndex > -1) {
          this.employeeBenefitList[employeeIndex]?.benefits.push(response)
          useLayoutStore().setStatusMessage('Employee benefit created', 'primary');
        }
      }
    },

    async updateEmployeeBenefit(payload: EmployeeBenefitInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/eio/employee-benefits/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update employee benefit', 'error');
      } else {
        let response = data.value as EmployeeBenefitInfo

        const employeeIndex = this.employeeBenefitList.findIndex((employee: AllEmployeeBenefitInfo) => employee.id === response.employee_id);
        if (employeeIndex > -1) {
          const employeeBenefitIndex = this.employeeBenefitList[employeeIndex]?.benefits.findIndex((employeeBenefit: EmployeeBenefitInfo) => employeeBenefit.id == response.id)
          if (employeeBenefitIndex > -1) {
            Object.assign(this.employeeBenefitList[employeeIndex].benefits[employeeBenefitIndex], response)
            useLayoutStore().setStatusMessage('Employee benefit updated', 'primary');
          }
        }
      }
    },

    async deleteEmployeeBenefit(employee_id: number, employee_benefit_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/eio/employee-benefits/${employee_benefit_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        console.error('Failed to delete benefit', error.value);
        useLayoutStore().setStatusMessage('Failed to delete employee benefit', 'error');
      }
      else {
        const employeeIndex = this.employeeBenefitList.findIndex((employee: AllEmployeeBenefitInfo) => employee.id === employee_id);
        if (employeeIndex > -1) {
          const employeeBenefitIndex = this.employeeBenefitList[employeeIndex]?.benefits.findIndex((employeeBenefit: EmployeeBenefitInfo) => employeeBenefit.id == employee_benefit_id)
          if (employeeBenefitIndex > -1) {
            this.employeeBenefitList[employeeIndex].benefits.splice(employeeBenefitIndex, 1)
            useLayoutStore().setStatusMessage('Employee benefit deleted', 'primary');
          }
        }
      }
    },
  },
})