import { defineStore } from 'pinia';
import type { PerformanceMetricInfo } from '~/types/marketing/performance_metric';

interface State {
  metricList: PerformanceMetricInfo[];
  loading: boolean
}

export const usePerformanceMetricStore = defineStore('metric', {
  state: (): State => ({
    metricList: [
            {
                id: 1,
                campaign_id: 2,
                date: "2024-05-05",
                metric_type: "Clicks",
                metric_value: 500,
                
            },
            {
                id: 2,
                campaign_id: 1,
                date: "2024-04-20",
                metric_type: "Clicks",
                metric_value: 900,
                
            },
            {
                id: 3,
                campaign_id: 5,
                date: "2023-03-13",
                metric_type: "Conversions",
                metric_value: 100,             
            },
            {
                id: 4,
                campaign_id: 7,
                date: "2022-02-21",
                metric_type: "Clicks",
                metric_value: 300,
                
            },
            {
                id: 5,
                campaign_id: 8,
                date: "2022-05-07",
                metric_type: "Conversions",
                metric_value: 1200,            
            },
            {
                id: 6,
                campaign_id: 3,
                date: "2023-04-26",
                metric_type: "Conversions",
                metric_value: 700,
                
            },
            {
                id: 7,
                campaign_id: 4,
                date: "2024-08-15",
                metric_type: "Impressions",
                metric_value: 235,
                
            },
            {
                id: 8,
                campaign_id: 6,
                date: "2024-07-18",
                metric_type: "Conversions",
                metric_value: 300,
                
            },
            {
                id: 9,
                campaign_id: 5,
                date: "2023-03-17",
                metric_type: "Conversions",
                metric_value: 700,             
            },
            {
                id: 10,
                campaign_id: 7,
                date: "2022-03-02",
                metric_type: "Clicks",
                metric_value: 150,
                
            },
            {
                id: 11,
                campaign_id: 8,
                date: "2022-05-27",
                metric_type: "Conversions",
                metric_value: 200,            
            },
            {
                id: 12,
                campaign_id: 3,
                date: "2023-05-16",
                metric_type: "Clicks",
                metric_value: 100,
                
            },
    ],
    loading: false
  }),

  getters: {
    getMetricList: (state) => { return state.metricList },
    getMetricById: (state) => {
        return (metricId: number) => state.metricList.find(metric => metric.id === metricId)
    }
},
actions: {
    createMetric(payload: PerformanceMetricInfo) {
        this.$state.metricList.push(payload)
    },

    updateMetric(payload: PerformanceMetricInfo) {
        const index = this.$state.metricList.findIndex((metric) => metric.id === payload.id);
        if (index > -1) {
            Object.assign(this.metricList[index], payload)
        }
      },
    deleteMetric(metricId: number) {
        const index = this.$state.metricList.findIndex((metric) => metric.id === metricId);
        if (index > -1) {
            this.metricList.splice(index, 1);
        }
    },
},
})
