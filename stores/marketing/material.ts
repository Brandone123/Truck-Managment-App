import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { MaterialMarketingInfo } from '~/types/marketing/material';


interface State {
    materialList: MaterialMarketingInfo[];
    loading: boolean;
  }
  
  export const useMaterialMarketingStore = defineStore('materialMarketing', {
    state: (): State => ({
      materialList: [
        {
          id: 1,
          material_name: "Banner Ad",
          type: "Banner",
          file_path: "/images/material/marketing-essentials.webp?url",
          description: "This is a banner ad for promoting our product.",
        },
        {
          id: 2,
          material_name: "Video Ad",
          type: "Video",
          file_path: "/path/to/video.mp4",
          description: "This is a video ad showcasing the features of our product.",
        },
        {
          id: 3,
          material_name: "Text Ad",
          type: "Text",
          file_path: "",
          description: "This is a text ad with compelling copy for driving conversions.",
        },
        {
          id: 4,
          material_name: "Email Newsletter",
          type: "Email",
          file_path: "/path/to/newsletter.pdf",
          description: "This is an email newsletter sent to our subscribers with the latest updates.",
        },
        {
          id: 5,
          material_name: "Social Media Post",
          type: "flyer",
          file_path: "/images/material/flyer.png?url",
          description: "This is a social media post promoting a limited-time offer.",
        },
      ],
      loading: false,
    }),
  
    getters: {
      getMaterialList: (state) => state.materialList,
      getMaterialById: (state) => (materialId: number) =>
        state.materialList.find((material) => material.id === materialId),
    },
  
    actions: {
      createMaterial(payload: MaterialMarketingInfo) {
        this.$state.materialList.push(payload);
      },
  
      updateMaterial(payload: MaterialMarketingInfo) {
        const index = this.$state.materialList.findIndex((material) => material.id === payload.id);
        if (index > -1) {
          Object.assign(this.$state.materialList[index], payload);
        }
      },
  
      deleteMaterial(materialId: number) {
        const index = this.$state.materialList.findIndex((material) => material.id === materialId);
        if (index > -1) {
          this.$state.materialList.splice(index, 1);
        }
      },
    },
  });