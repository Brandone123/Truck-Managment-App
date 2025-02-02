<template>
    <div class="p-4">
        <!-- Barre de recherche et filtre -->
        <!-- <div class="d-flex">
            <div class="ml-auto mb-4">
                <v-btn color="primary" @click="addDocument">Upload Document</v-btn>
            </div>
        </div> -->
        <div class="d-flex justify-between items-center mb-4">
            <v-text-field v-model="pagination.search" placeholder="Search" class="ml-auto mb-2" clearable variant="solo"
                hide-details density="compact" flat>
                <template v-slot:append-inner>
                    <v-btn flat color="primary" class="mr-n2" @click=""><v-icon>mdi-magnify</v-icon></v-btn>
                </template>
            </v-text-field>
        </div>

        <v-divider class="my-3"></v-divider>
        <!-- <div v-if="allDocuments.length === 0" class="text-center py-10 text-gray-500">
                <v-icon size="48" color="gray">mdi-folder-open-outline</v-icon>
                <p class="mt-4 text-lg font-semibold">No document available</p>
                <p class="text-sm">Add a document by clicking on the “Upload Document” button.</p>
                </div> -->
        <!-- Liste des documents -->
        <v-row>
            <v-col  cols="12" md="4" lg="3">
                <v-card class="recent-card hover:shadow-lg transition-shadow cursor-pointer"
                    @click="">
                    <v-card-title class="d-flex items-center">
                        <v-icon color="secondary" class="mr-2">mdi-file-outline</v-icon>
                        <span class="font-semibold text-gray-800 truncate">
                            File
                        </span>
                    </v-card-title>
                    <v-card-subtitle class="text-sm text-gray-600">
                        24/01/2025 10:30:01
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>

        <input ref="documentfile" type="file" multiple accept="application/pdf"
        @change="storeFile($event, 'documents')" style="display: none;" />

        <!-- Pagination -->
        <v-pagination v-model="pagination.page" :length="Math.ceil(total_items / pagination.itemsPerPage)" class="mt-4"
            total-visible="7" color="primary"></v-pagination>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { OrientationMaterialDocument, OrientationMaterial } from '@/types/recruiting/onboardingOrientation';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

const route = useRoute();
const storeOnboarding = OnboardingOrientationStore();

const {
    pagination: documentPagination,
    total_items,
    material_documents,
} = storeToRefs(storeOnboarding);

const allDocuments = computed(() => storeOnboarding.material_documents);
const materialId = parseInt(route.params.materialId as string, 10);

const currentDocument = ref<Partial<OrientationMaterialDocument>>({ });

const mediaStore = useMediaStore()

async function storeFile(event: any, location: string) {
  const files = (event.target as HTMLFormElement).files as FileList;

  if (files.length === 0) {
    return;
  }

  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const { data, error } = await mediaStore.uploadFile(file);
    if (data) {
      switch (location) {
        case 'documents':
        //   if (!Array.isArray(currentDocument.value.documents)) {
        //     currentDocument.value.documents = [];
        //   }
          // Add file data to documents array
        //   currentDocument.value.documents.push(data);
          break;
      }
    }
  }

  //clear input value
  if (event.target) {
    (event.target as HTMLFormElement).value = null
  }
}
const documentfile = ref<HTMLInputElement | null>(null);

function addDocument() {
  documentfile.value?.click();
}

const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString();
};

// Gestion de la pagination et de la recherche
const pagination = computed({
    get() {
        return documentPagination.value;
    },
    set(value) {
        storeOnboarding.setPagination(value);
    },
});

const searchQuery = computed(() => {
    let payload: Record<string, any> = {
        page: pagination.value.page,
        items_per_page: pagination.value.itemsPerPage,
    };

    if (pagination.value.search) {
        payload['search'] = pagination.value.search;
    }

    return payload;
});

// Fetch des documents à chaque changement
onMounted(() => {
    storeOnboarding.fetchDocuments(searchQuery.value, materialId);
});

watch(
    () => pagination.value,
    (newVal, oldVal) => {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            storeOnboarding.fetchDocuments(searchQuery.value, materialId);
        }
    },
    { deep: true }
);
</script>

<style scoped>
/* Styles pour rendre la page professionnelle */
.recent-card {
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    transition: box-shadow 0.2s ease-in-out;
}

.recent-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.v-pagination {
    justify-content: center;
}

.v-text-field {
    max-width: 300px;
}

.v-btn {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>