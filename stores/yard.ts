import { defineStore } from 'pinia';
import type { VehicleInYardInfo, YardInfo } from '~/types/yard/yard';
import type { YardDetailInfo} from '~/types/yard/yard';

export interface DwellTimeData {
  average: number;
  min: number;
  max: number;
}

export interface ActivitiesData {
  vehicle_id: number;
  action: string;
  time: string;
}

export interface OccupancyReport {
  current: number;
  capacity: number;
}

interface State {
  yardList: YardInfo[];
  yardDetailVehicle: VehicleInYardInfo[];
  yardDetail: YardDetailInfo[];
  activities: ActivitiesData[],
  locationYard: string | null,
  capacityYard: number | null,
  loading: boolean,
  loadingYardDetail: boolean,
  loadingDwellTime: boolean,
  loadingOccupancyReport: boolean,
  loadingActivities: boolean,
  current: number;
  capacity: number;
  average: number;
  min: number;
  max: number;

  yardMapData: Array<any>;
  loadingYardMapData: boolean;
}

export const useYardStore = defineStore('yard', {
  state: (): State => ({
    yardList: [],
    yardDetailVehicle: [],
    yardDetail: [],
    activities: [],
    locationYard: '',
    capacityYard: 0,
    loading: false,
    loadingYardDetail: false,
    loadingDwellTime: false,
    loadingOccupancyReport: false,
    loadingActivities: false,
    current: 0,
    capacity: 0,
    average: 0,
    min: 0,
    max: 0,


    yardMapData: [],
    loadingYardMapData: false
  }),

  getters: {
    getYardList: (state) => { return state.yardList }
  },

  actions: {
    async fetchYardMapData(){
      this.loadingYardMapData = true;
      const {data,error} = await useApiFetch('/api/yardcheck/yards-map');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch yard map data', 'error')
      } else {
        this.yardMapData = data.value as any;
      }
      this.loadingYardMapData = false
    },

    async fetchYardList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/yardcheck/yards');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch yards list', 'error')
      } else {
        this.yardList = data.value as YardInfo[];
      }
      this.loading = false
    },

    async createYard(payload: YardInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch('/api/yardcheck/yards', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create Yard', 'error');
      } else {
        let yard = data.value as YardInfo;
        this.yardList.push(yard)
        useLayoutStore().setStatusMessage('Yard created', 'primary');
      }
    },

    async updateYard(payload: YardInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch(`/api/yardcheck/yards/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update yard', 'error');
      } else {
        let response = data.value as YardInfo
        let index = this.yardList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.yardList[index], response)
        }
        useLayoutStore().setStatusMessage('Yard updated', 'primary');
      }
    },

    async getYardDetailById(yardId: number) {
      try {
        this.loadingYardDetail = true;
        const { data } = await useApiFetch(`/api/yardcheck/yards/${yardId}`);

        const detailData = data.value as YardDetailInfo;
        this.yardDetail = data.value as YardDetailInfo[];
        this.yardDetailVehicle = detailData.vehicles as VehicleInYardInfo[];
        this.locationYard = detailData.location;
        this.capacityYard = detailData.capacity;

      } catch (error) {
        console.error('Error fetching yard detail data', error);
      } finally {
        this.loadingYardDetail = false;
      }
    },

    async getActivitiesYardById(yardId: number) {
      try {
        this.loadingActivities = true;
        const { data } = await useApiFetch(`/api/yardcheck/yards/${yardId}/activities`);

        this.activities = data.value as ActivitiesData[];

      } catch (error) {
        console.error('Error fetching yard detail data', error);
      } finally {
        this.loadingActivities = false;
      }
    },

    async deleteYard(id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/yardcheck/yards/${id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete yard', 'error');
      }
      else {
        const index = this.yardList.findIndex((yard) => yard.id === id);
        if (index > -1) {
          this.yardList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Yard deleted', 'primary');
      }
    },

    async getYardOccupancyReport(yardId: number) {
      try {
        this.loadingOccupancyReport = true;
        const { data } = await useApiFetch(`/api/yardcheck/yards/${yardId}/occupancy`);
        const ReportData = data.value as OccupancyReport;
        this.current = ReportData.current;
        this.capacity = ReportData.capacity;
      } catch (error) {
        console.error('Error fetching yard occupancy data', error);
      } finally {
        this.loadingOccupancyReport = false;
      }
    },

    async getYardDwellTimeReport(yardId: number) {
      try {
        this.loadingDwellTime = true;
        const { data } = await useApiFetch(`/api/yardcheck/yards/${yardId}/dwellTime`);
        const dwellData = data.value as DwellTimeData;

        this.average = dwellData.average;
        this.min = dwellData.min;
        this.max = dwellData.max;
      } catch (error) {
        console.error('Error fetching yard Dwell Time data', error);
      } finally {
        this.loadingDwellTime = false;
      }
    },

  },
})
