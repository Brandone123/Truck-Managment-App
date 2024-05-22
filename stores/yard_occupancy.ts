import { defineStore } from 'pinia';
import type { YardOccupancyInfo } from '~/types/yard/yard_occupancy';

interface QuickStatsData {
  totalVehicles: number;
  averageDwellTime: string;
  mostPopulatedYard: string;
}

export interface OccupancyData {
  yardId: number | null;
  yardName: string | null;
  dates: string[];
  occupancies: string | null;
}

export interface EntryExitData {
  date: string | null;
  entries: number | null;
  exits: number | null;
}

export interface StationaryData {
  vehicle_id: number | null;
  asset_type: string | null;
  entry_time: string | null;
  stationary_time: string | null;
}

export interface YardMap {
  yardId: number | null;
  name: string | null;
  location: string | null;
  vehicleCount: number | null;
  geometry: string | null;
}

interface State {
  loading: boolean,
  yardOccupancyList: YardOccupancyInfo[],
  totalVehicles: number;
  averageDwellTime: string;
  mostPopulatedYard: string;
  loadingStat: boolean,
  loadingChartData: boolean,
  loadingDwellTime: boolean,
  occupancyData: OccupancyData[],
  yardMap: YardMap[],
  loadingMap: boolean,
  EntryExitFrequency: EntryExitData[],
  stationaryVehicle: StationaryData[],
  loadingStationary: boolean,
}

export const useYardOccupancyStore = defineStore('yard_occupancy', {
  state: (): State => ({
    loading: false,
    loadingStat: false,
    loadingChartData: false,
    loadingMap: false,
    loadingDwellTime: false,
    loadingStationary: false,
    yardOccupancyList: [],
    occupancyData: [],
    yardMap: [],
    EntryExitFrequency: [],
    stationaryVehicle: [],
    totalVehicles: 0,
    averageDwellTime: "",
    mostPopulatedYard: "",
  }),

  getters: {
    getYardSpaceList: (state) => { return state.yardOccupancyList },
    // getStatYard: (state) => state.statYard,
  },

  actions: {
    async fetchYardOccupancyList() {
      try {
        this.loading = true;
        const { data } = await useApiFetch('/api/yardcheck/occupancy-alerts');
        this.yardOccupancyList = data.value as YardOccupancyInfo[];
      } catch (error) {
        console.error('Error fetching yard occupancy list:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchQuickStats() {
      try {
        this.loadingStat = true;
        const { data } = await useApiFetch('/api/yardcheck/quick-stats');
        const statsData = data.value as QuickStatsData;
        this.totalVehicles = statsData.totalVehicles;
        this.averageDwellTime = statsData.averageDwellTime;
        this.mostPopulatedYard = statsData.mostPopulatedYard;
      } catch (error) {
        console.error('Error fetching yard statistic list:', error);
      } finally {
        this.loadingStat = false;
      }
    },

    async yardOccupancyData(timeFrame: string) {
      try {
        this.loadingChartData = true;
        const { data } = await useApiFetch(`/api/yardcheck/occupancy-data?timeFrame=${timeFrame}`);
        this.occupancyData = data.value as OccupancyData[];
      } catch (error) {
        console.error('Error fetching yard occupancy data', error);
      } finally {
        this.loadingChartData = false;
      }
    },

    async getEntryExitFrenquency(yardId: number, timeFrame: string) {
      try {
        this.loadingDwellTime = true;
        const { data } = await useApiFetch(`/api/yardcheck/yards/${yardId}/entry-exit-frequency?timeFrame=${timeFrame}`);
        this.EntryExitFrequency = data.value as EntryExitData[];
      } catch (error) {
        console.error('Error fetching yard occupancy data', error);
      } finally {
        this.loadingDwellTime = false;
      }
    },

    async getStationaryVehicles(yardId: number) {
      try {
        this.loadingStationary = true;
        const { data } = await useApiFetch(`/api/yardcheck/yards/${yardId}/stationary-vehicles`);
        this.stationaryVehicle = data.value as StationaryData[];
      } catch (error) {
        console.error('Error fetching yard occupancy data', error);
      } finally {
        this.loadingStationary = false;
      }
    },

    async fetchYardMap() {
      try {
        this.loadingStat = true;
        const { data } = await useApiFetch('/api/yardcheck/yards-map');
        this.yardMap = data.value as YardMap[];
      } catch (error) {
        console.error('Error fetching yard map list:', error);
      } finally {
        this.loadingStat = false;
      }
    },
    
  },
})