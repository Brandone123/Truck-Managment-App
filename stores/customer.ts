import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { CustomerInfo } from '~/types/store/customer';

interface State {
  customerList: CustomerInfo[];
  loading: boolean
}

export const useCustomerStore = defineStore('meeting', {
  state: (): State => ({
    customerList: [],
    loading: false
  }),

  getters: {
    getCustomerList: (state) => { return state.customerList }
  },

  actions: {
    async fetchCustomerList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/shared/customers');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch customer list', 'error')
      } else {
        this.customerList = data.value as CustomerInfo[];
      }
      this.loading = false
    },

    async createCustomer(payload: CustomerInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch('/api/shared/customers', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create Customer', 'error');
      } else {
        let customer = data.value as CustomerInfo;
        this.customerList.push(customer)
        useLayoutStore().setStatusMessage('Customer created', 'primary');
      }
    },

    async updateCustomer(payload: CustomerInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/shared/customers/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update customer', 'error');
      } else {
        let response = data.value as CustomerInfo
        let index = this.customerList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.customerList[index], response)
        }
        useLayoutStore().setStatusMessage('Customer updated', 'primary');
      }
    },

    async deleteCustomer(customer_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/shared/customers/${customer_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete customer', 'error');
      }
      else {
        const index = this.customerList.findIndex((customer) => customer.id === customer_id);
        if (index > -1) {
          this.customerList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Customer deleted', 'primary');
      }
    },
  },
})
