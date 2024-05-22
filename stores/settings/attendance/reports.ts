import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
// import type { TimeoffRequest } from '~/types/attendance/timeoff_request';
// import { useLayoutStore } from '~/stores/useLayoutStore';
// interface State {
//     employeeTimeoffRequestList: TimeoffRequest[],
//     loading: boolean,
// }

export const useAttendanceReportStore = defineStore('attendance_reports', {
    // state: (): State => ({
    //     loading: false,
    //     employeeTimeoffRequestList: []
    // }),

    actions: {
       
    async getAttendanceReport(payload: any) {
        return new Promise(async (resolve, reject) => {
          try {
            useLayoutStore().setOverlay(true);
            const { data, error } = await useApiFetch(`/api/attendance/time-off/reports`, {
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
